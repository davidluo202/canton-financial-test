import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

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

  // 获取市场数据
  const { data, isLoading } = trpc.market.getMarketData.useQuery(undefined, {
    refetchInterval: 60000, // 每60秒刷新一次
    refetchOnWindowFocus: false,
  });

  // 当获取到新数据时，更新state和localStorage缓存
  useEffect(() => {
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
  }, [data]);

  // 如果没有数据（包括缓存），不显示组件
  if (marketData.length === 0) {
    return null;
  }

  // 格式化价格显示
  const formatPrice = (price: number, type: string) => {
    if (type === "forex") {
      return price.toFixed(4);
    } else if (type === "commodity") {
      return price.toFixed(2);
    } else {
      return price.toFixed(2);
    }
  };

  // 获取涨跌颜色类名 - 国际标准：涨蓝跌红
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"; // 涨：绿色/蓝色
    if (change < 0) return "text-red-400"; // 跌：红色
    return "text-gray-400"; // 平：灰色
  };

  // 获取涨跌符号
  const getChangeSymbol = (change: number) => {
    if (change > 0) return "+";
    return "";
  };

  // 格式化时间显示
  const formatUpdateTime = () => {
    if (!lastUpdateTime) return '';
    
    try {
      const updateDate = new Date(lastUpdateTime);
      const now = new Date();
      const diffMs = now.getTime() - updateDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        return language === 'zh' ? '剚剚更新' : 'Just now';
      } else if (diffMins < 60) {
        return language === 'zh' ? `${diffMins}分鐘前更新` : `Updated ${diffMins}m ago`;
      } else {
        const diffHours = Math.floor(diffMins / 60);
        return language === 'zh' ? `${diffHours}小時前更新` : `Updated ${diffHours}h ago`;
      }
    } catch (error) {
      return '';
    }
  };

  // 如果没有数据，不显示组件（避免空白栏）
  if (marketData.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-blue-950 text-white overflow-hidden">
      <div className="flex items-center">
        {/* 时间戳显示 */}
        {lastUpdateTime && (
          <div className="px-3 py-0.5 text-[10px] text-slate-300 whitespace-nowrap border-r border-slate-700">
            {formatUpdateTime()}
          </div>
        )}
        
        {/* 滚动行情条 */}
        <div className="flex-1 ticker-wrapper">
          <div className="ticker-content py-0.5">
          {/* 渲染两次数据以实现无缝循环滚动 */}
          {[...marketData, ...marketData].map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="ticker-item inline-flex items-center px-3 whitespace-nowrap"
            >
              <span className="font-semibold text-xs mr-1.5">
                {language === "zh" ? item.nameZh : item.nameEn}
              </span>
              <span className="text-xs mr-1.5">
                {formatPrice(item.price, item.type)}
              </span>
              <span className={`text-[10px] font-medium ${getChangeColor(item.change)}`}>
                {getChangeSymbol(item.change)}
                {item.change.toFixed(2)} (
                {getChangeSymbol(item.changePercent)}
                {item.changePercent.toFixed(2)}%)
              </span>
              <span className="mx-2 text-slate-400 text-xs">|</span>
            </div>
          ))}
          </div>
        </div>
      </div>

      <style>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .ticker-content {
          display: inline-flex;
          animation: scroll-left 60s linear infinite;
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-item {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
