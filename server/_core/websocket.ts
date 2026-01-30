import { WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { callDataApi } from './dataApi';

// 市场数据类型定义
interface MarketData {
  symbol: string;
  type: string;
  nameZh: string;
  nameEn: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

// WebSocket消息类型
interface WSMessage {
  type: 'market_data' | 'ping' | 'pong' | 'error';
  data?: any;
  timestamp?: number;
}

// 客户端连接信息
interface ClientInfo {
  ws: WebSocket;
  isAlive: boolean;
  connectedAt: number;
}

// 市场数据符号配置
const MARKET_SYMBOLS = [
  { symbol: "^DJI", type: "index", nameZh: "道瓊斯", nameEn: "Dow Jones" },
  { symbol: "^IXIC", type: "index", nameZh: "納斯達克", nameEn: "NASDAQ" },
  { symbol: "^GSPC", type: "index", nameZh: "標普500", nameEn: "S&P 500" },
  { symbol: "000001.SS", type: "index", nameZh: "上證綜指", nameEn: "Shanghai" },
  { symbol: "^HSI", type: "index", nameZh: "恆生指數", nameEn: "Hang Seng" },
  { symbol: "CNY=X", type: "forex", nameZh: "美元/人民幣", nameEn: "USD/CNY" },
  { symbol: "EURUSD=X", type: "forex", nameZh: "歐元/美元", nameEn: "EUR/USD" },
  { symbol: "JPY=X", type: "forex", nameZh: "美元/日元", nameEn: "USD/JPY" },
  { symbol: "GBPUSD=X", type: "forex", nameZh: "英鎊/美元", nameEn: "GBP/USD" },
  { symbol: "GC=F", type: "commodity", nameZh: "黃金", nameEn: "Gold" },
  { symbol: "SI=F", type: "commodity", nameZh: "白銀", nameEn: "Silver" },
];

// Fallback数据（2026-01-29）
const FALLBACK_DATA: MarketData[] = [
  { symbol: "^DJI", type: "index", nameZh: "道瓊斯", nameEn: "Dow Jones", price: 49071.56, change: 55.96, changePercent: 0.11, currency: "USD" },
  { symbol: "^IXIC", type: "index", nameZh: "納斯達克", nameEn: "NASDAQ", price: 23685.12, change: -172.33, changePercent: -0.72, currency: "USD" },
  { symbol: "^GSPC", type: "index", nameZh: "標普500", nameEn: "S&P 500", price: 6969.01, change: -9.02, changePercent: -0.13, currency: "USD" },
  { symbol: "000001.SS", type: "index", nameZh: "上證綜指", nameEn: "Shanghai", price: 4132.61, change: -0.09, changePercent: -0.002, currency: "CNY" },
  { symbol: "^HSI", type: "index", nameZh: "恆生指數", nameEn: "Hang Seng", price: 27325.89, change: 462.74, changePercent: 1.72, currency: "HKD" },
  { symbol: "CNY=X", type: "forex", nameZh: "美元/人民幣", nameEn: "USD/CNY", price: 6.9495, change: 0.002, changePercent: 0.03, currency: "CNY" },
  { symbol: "EURUSD=X", type: "forex", nameZh: "歐元/美元", nameEn: "EUR/USD", price: 1.1935, change: -0.0037, changePercent: -0.31, currency: "USD" },
  { symbol: "JPY=X", type: "forex", nameZh: "美元/日元", nameEn: "USD/JPY", price: 153.55, change: 0.54, changePercent: 0.35, currency: "JPY" },
  { symbol: "GBPUSD=X", type: "forex", nameZh: "英鎊/美元", nameEn: "GBP/USD", price: 1.3769, change: -0.0042, changePercent: -0.30, currency: "USD" },
  { symbol: "GC=F", type: "commodity", nameZh: "黃金", nameEn: "Gold", price: 5375.50, change: 20.70, changePercent: 0.39, currency: "USD" },
  { symbol: "SI=F", type: "commodity", nameZh: "白銀", nameEn: "Silver", price: 115.58, change: 1.15, changePercent: 1.01, currency: "USD" },
];

export class MarketDataWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientInfo> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private latestData: MarketData[] = FALLBACK_DATA;
  private isUpdating: boolean = false;

  constructor(private server: HTTPServer) {}

  /**
   * 初始化WebSocket服务器
   */
  public initialize() {
    this.wss = new WebSocketServer({ 
      server: this.server,
      path: '/ws/market-data'
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      const clientInfo: ClientInfo = {
        ws,
        isAlive: true,
        connectedAt: Date.now(),
      };

      this.clients.set(clientId, clientInfo);
      console.log(`[WebSocket] 客户端连接: ${clientId}, 总连接数: ${this.clients.size}`);

      // 立即发送当前数据
      this.sendToClient(ws, {
        type: 'market_data',
        data: this.latestData,
        timestamp: Date.now(),
      });

      // 处理客户端消息
      ws.on('message', (message: Buffer) => {
        try {
          const msg: WSMessage = JSON.parse(message.toString());
          this.handleClientMessage(clientId, msg);
        } catch (error) {
          console.error(`[WebSocket] 解析消息失败:`, error);
        }
      });

      // 处理pong响应
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
        }
      });

      // 处理连接关闭
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`[WebSocket] 客户端断开: ${clientId}, 剩余连接数: ${this.clients.size}`);
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error(`[WebSocket] 客户端错误 ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // 启动定时更新市场数据（每30秒）
    this.startDataUpdate();

    // 启动心跳检测（每30秒）
    this.startHeartbeat();

    console.log('[WebSocket] 市场数据WebSocket服务器已启动，路径: /ws/market-data');
  }

  /**
   * 处理客户端消息
   */
  private handleClientMessage(clientId: string, msg: WSMessage) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (msg.type) {
      case 'ping':
        // 响应ping
        this.sendToClient(client.ws, { type: 'pong', timestamp: Date.now() });
        break;
      default:
        console.log(`[WebSocket] 未知消息类型: ${msg.type}`);
    }
  }

  /**
   * 启动定时更新市场数据
   */
  private startDataUpdate() {
    // 立即执行一次
    this.updateMarketData();

    // 每30秒更新一次
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
    }, 30 * 1000);
  }

  /**
   * 更新市场数据并广播给所有客户端
   */
  private async updateMarketData() {
    if (this.isUpdating) {
      console.log('[WebSocket] 正在更新数据，跳过本次更新');
      return;
    }

    this.isUpdating = true;

    try {
      console.log('[WebSocket] 开始获取市场数据...');
      
      const promises = MARKET_SYMBOLS.map(async (item) => {
        try {
          const response = await callDataApi("YahooFinance/get_stock_chart", {
            query: {
              symbol: item.symbol,
              region: "US",
              interval: "1d",
              range: "1d",
            },
          });

          if (response && (response as any).chart && (response as any).chart.result && (response as any).chart.result.length > 0) {
            const result = (response as any).chart.result[0];
            const meta = result.meta;

            const currentPrice = meta.regularMarketPrice || 0;
            const previousClose = meta.previousClose || meta.chartPreviousClose || 0;
            const change = currentPrice - previousClose;
            const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

            return {
              symbol: item.symbol,
              type: item.type,
              nameZh: item.nameZh,
              nameEn: item.nameEn,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              currency: meta.currency || "USD",
            };
          }
          
          return null;
        } catch (error) {
          console.error(`[WebSocket] 获取 ${item.symbol} 数据失败:`, error);
          return null;
        }
      });

      const data = await Promise.all(promises);
      const validData = data.filter((item): item is MarketData => item !== null);

      if (validData.length > 0) {
        this.latestData = validData;
        console.log(`[WebSocket] 市场数据已更新，获取到 ${validData.length} 条数据`);
        
        // 广播给所有客户端
        this.broadcast({
          type: 'market_data',
          data: this.latestData,
          timestamp: Date.now(),
        });
      } else {
        console.log('[WebSocket] 未获取到有效数据，保持旧数据');
      }
    } catch (error) {
      console.error('[WebSocket] 更新市场数据失败:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          console.log(`[WebSocket] 客户端 ${clientId} 心跳超时，断开连接`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }

        client.isAlive = false;
        client.ws.ping();
      });
    }, 30 * 1000);
  }

  /**
   * 广播消息给所有客户端
   */
  private broadcast(message: WSMessage) {
    const messageStr = JSON.stringify(message);
    let successCount = 0;
    let failCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(messageStr);
          successCount++;
        } catch (error) {
          console.error(`[WebSocket] 发送消息给客户端 ${clientId} 失败:`, error);
          failCount++;
        }
      }
    });

    if (successCount > 0) {
      console.log(`[WebSocket] 广播消息成功: ${successCount} 个客户端, 失败: ${failCount} 个`);
    }
  }

  /**
   * 发送消息给指定客户端
   */
  private sendToClient(ws: WebSocket, message: WSMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('[WebSocket] 发送消息失败:', error);
      }
    }
  }

  /**
   * 生成客户端ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 关闭WebSocket服务器
   */
  public close() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.wss) {
      this.wss.close(() => {
        console.log('[WebSocket] 市场数据WebSocket服务器已关闭');
      });
    }
  }
}
