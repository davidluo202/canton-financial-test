import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw } from "lucide-react";

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // 手动获取市场数据（不自动刷新）
  const { refetch, isFetching } = trpc.market.getMarketData.useQuery(undefined, {
    enabled: false, // 禁用自动查询
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // 手动刷新按钮点击处理
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refetch();
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const timestamp = new Date().toISOString();
        
        setMarketData(result.data as MarketData[]);
        setLastUpdateTime(timestamp);
        
        // 保存到localStorage
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
        } catch (error) {
          console.error('Failed to cache market data:', error);
        }
      }
    } catch (error) {
      console.error('Failed to refresh market data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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

  // 格式化最后更新时间显示
  const formatLastUpdateTime = () => {
    if (!lastUpdateTime) return language === "zh" ? "未更新" : "Not updated";
    
    const now = new Date();
    const updateTime = new Date(lastUpdateTime);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) {
      return language === "zh" ? "即時更新" : "Just now";
    } else if (diffMinutes < 60) {
      return language === "zh" ? `${diffMinutes}分鐘前更新` : `${diffMinutes}min ago`;
    } else {
      return language === "zh" ? `${diffHours}小時前更新` : `${diffHours}hr ago`;
    }
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
      {/* 手动刷新按钮 */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-3">
        {/* 最后更新时间 */}
        <span className="text-xs text-gray-300">
          {formatLastUpdateTime()}
        </span>
        
        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md text-xs font-medium transition-colors"
          title={language === "zh" ? "點擊更新行情數據" : "Click to refresh market data"}
        >
          <RefreshCw 
            className={`w-3.5 h-3.5 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} 
          />
          <span>{language === "zh" ? "行情更新" : "Refresh"}</span>
        </button>
      </div>

      {/* 滚动容器 */}
      <div className="flex animate-scroll whitespace-nowrap pr-48">
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
