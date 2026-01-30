import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWebSocket } from "@/hooks/useWebSocket";

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

const CACHE_KEY = 'market_ticker_data';
const CACHE_TIMESTAMP_KEY = 'market_ticker_timestamp';

export default function MarketTicker() {
  const { language } = useLanguage();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [useWebSocketMode, setUseWebSocketMode] = useState(true);

  // 从localStorage加载缓存数据
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData) {
        setMarketData(JSON.parse(cachedData));
      }
      if (cachedTimestamp) {
        setLastUpdateTime(cachedTimestamp);
      }
    } catch (error) {
      console.error('Failed to load cached market data:', error);
    }
  }, []);

  // WebSocket连接
  const { isConnected: wsConnected, error: wsError } = useWebSocket({
    url: '/ws/market-data',
    onMessage: (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        const timestamp = new Date().toISOString();
        
        setMarketData(data as MarketData[]);
        setLastUpdateTime(timestamp);
        
        // 保存到localStorage
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
        } catch (error) {
          console.error('Failed to cache market data:', error);
        }
      }
    },
    onError: (error) => {
      console.error('[MarketTicker] WebSocket错误，降级到轮询模式');
      setUseWebSocketMode(false);
    },
    onClose: () => {
      console.log('[MarketTicker] WebSocket连接关闭');
    },
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // 降级方案：使用tRPC轮询（仅在WebSocket失败时启用）
  const { data: pollingData } = trpc.market.getMarketData.useQuery(undefined, {
    enabled: !useWebSocketMode || !wsConnected, // 只有在WebSocket模式关闭或未连接时才启用轮询
    refetchInterval: 1 * 60 * 1000, // 每1分钟刷新一次
    refetchOnWindowFocus: false,
  });

  // 当轮询获取到新数据时，更新state和localStorage缓存
  useEffect(() => {
    if ((!useWebSocketMode || !wsConnected) && pollingData && Array.isArray(pollingData) && pollingData.length > 0) {
      const timestamp = new Date().toISOString();
      
      setMarketData(pollingData as MarketData[]);
      setLastUpdateTime(timestamp);
      
      // 保存到localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(pollingData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
      } catch (error) {
        console.error('Failed to cache market data:', error);
      }
    }
  }, [pollingData, useWebSocketMode, wsConnected]);

  // 格式化价格显示
  const formatPrice = (price: number, currency: string) => {
    // 对于外汇汇率，显示更多小数位
    if (currency === 'CNY' || currency === 'JPY') {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    } else if (price < 10) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    } else if (price < 100) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  // 获取涨跌颜色类名 - 国际标准：涨蓝跌红
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-blue-400"; // 涨：蓝色
    if (change < 0) return "text-red-400"; // 跌：红色
    return "text-gray-400"; // 平：灰色
  };

  // 获取涨跌符号
  const getChangeSymbol = (change: number) => {
    if (change > 0) return "+";
    if (change < 0) return "";
    return "";
  };

  // 格式化涨跌幅
  const formatChange = (change: number) => {
    return Math.abs(change).toFixed(2);
  };

  // 格式化涨跌百分比
  const formatChangePercent = (changePercent: number) => {
    return `${getChangeSymbol(changePercent)}${Math.abs(changePercent).toFixed(2)}%`;
  };

  // 复制数据用于无限滚动
  const duplicatedData = useMemo(() => {
    return [...marketData, ...marketData];
  }, [marketData]);

  if (marketData.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 text-white py-3 overflow-hidden border-b-2 border-blue-500/30 shadow-lg">
      {/* 连接状态指示器 */}
      <div className="absolute top-1 right-4 flex items-center gap-2 text-xs">
        {useWebSocketMode && wsConnected && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">实时</span>
          </div>
        )}
        {useWebSocketMode && !wsConnected && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400">重连中</span>
          </div>
        )}
        {!useWebSocketMode && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-400">轮询</span>
          </div>
        )}
      </div>

      {/* 滚动容器 */}
      <div className="flex animate-scroll whitespace-nowrap">
        {duplicatedData.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="inline-flex items-center px-6 border-r border-white/20"
          >
            <span className="font-medium mr-2">
              {language === "zh" ? item.nameZh : item.nameEn}
            </span>
            <span className="mr-2">{formatPrice(item.price, item.currency)}</span>
            <span className={`${getChangeColor(item.change)} font-medium`}>
              {getChangeSymbol(item.change)}{formatChange(item.change)} ({formatChangePercent(item.changePercent)})
            </span>
          </div>
        ))}
      </div>

      {/* CSS动画 */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
