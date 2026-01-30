import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: 'market_data' | 'ping' | 'pong' | 'error';
  data?: any;
  timestamp?: number;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  error: string | null;
  send: (message: any) => void;
  reconnect: () => void;
}

/**
 * WebSocket自定义Hook
 * 提供自动重连、心跳检测等功能
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isManualCloseRef = useRef(false);

  /**
   * 清理心跳定时器
   */
  const clearHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  /**
   * 启动心跳检测
   */
  const startHeartbeat = useCallback(() => {
    clearHeartbeat();
    
    // 每30秒发送一次ping
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30 * 1000);
  }, [clearHeartbeat]);

  /**
   * 连接WebSocket
   */
  const connect = useCallback(() => {
    try {
      // 如果已经有连接，先关闭
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // 构建WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}${url}`;
      
      console.log(`[WebSocket] 正在连接: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] 连接成功');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // 启动心跳
        startHeartbeat();
        
        if (onOpen) {
          onOpen();
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // 处理pong响应
          if (message.type === 'pong') {
            // console.log('[WebSocket] 收到pong响应');
            return;
          }
          
          // 处理市场数据
          if (message.type === 'market_data' && onMessage) {
            onMessage(message.data);
          }
        } catch (error) {
          console.error('[WebSocket] 解析消息失败:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('[WebSocket] 连接错误:', event);
        setError('WebSocket连接错误');
        
        if (onError) {
          onError(event);
        }
      };

      ws.onclose = (event) => {
        console.log(`[WebSocket] 连接关闭: code=${event.code}, reason=${event.reason}`);
        setIsConnected(false);
        clearHeartbeat();
        
        if (onClose) {
          onClose();
        }

        // 如果不是手动关闭，尝试重连
        if (!isManualCloseRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`[WebSocket] 将在 ${reconnectInterval}ms 后尝试第 ${reconnectAttemptsRef.current} 次重连...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError(`WebSocket重连失败，已达到最大重连次数 (${maxReconnectAttempts})`);
        }
      };
    } catch (error) {
      console.error('[WebSocket] 创建连接失败:', error);
      setError('创建WebSocket连接失败');
    }
  }, [url, onMessage, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts, startHeartbeat, clearHeartbeat]);

  /**
   * 手动重连
   */
  const reconnect = useCallback(() => {
    console.log('[WebSocket] 手动重连');
    reconnectAttemptsRef.current = 0;
    setError(null);
    connect();
  }, [connect]);

  /**
   * 发送消息
   */
  const send = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] 无法发送消息，连接未打开');
    }
  }, []);

  /**
   * 组件挂载时连接
   */
  useEffect(() => {
    isManualCloseRef.current = false;
    connect();

    // 组件卸载时清理
    return () => {
      isManualCloseRef.current = true;
      clearHeartbeat();
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, clearHeartbeat]);

  return {
    isConnected,
    error,
    send,
    reconnect,
  };
}
