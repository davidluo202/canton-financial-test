import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

  // 手动刷新市场数据
  const { refetch } = trpc.market.getMarketData.useQuery(undefined, {
    enabled: false, // 禁用自动查询
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

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
        
        // 显示成功提示
        toast.success(language === "zh" ? "行情更新成功" : "Market data updated successfully");
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Failed to refresh market data:', error);
      // 显示失败提示
      toast.error(language === "zh" ? "行情更新失败，请稍后重试" : "Failed to update market data, please try again later");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 格式化价格显示
  const formatPrice = (price: number, currency: string) => {
    // 对于外汇汇率，显示更多小数位
    if (currency === 'CNY' || currency === 'USD' || currency === 'EUR' || currency === 'JPY' || currency === 'GBP') {
      return price.toFixed(4);
    }
    // 对于股票指数和贵金属，显示两位小数并添加千位分隔符
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 格式化涨跌幅显示
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  // 计算最后更新时间距离现在的时长
  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return '';
    
    const now = new Date().getTime();
    const updateTime = new Date(timestamp).getTime();
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) {
      return language === "zh" ? "即時更新" : "Just now";
    } else if (diffMins < 60) {
      return language === "zh" ? `${diffMins}分鐘前更新` : `${diffMins} min ago`;
    } else {
      return language === "zh" ? `${diffHours}小時前更新` : `${diffHours} hr ago`;
    }
  };

  // 即使没有数据也显示行情条和更新按钮

  return (
    <div className="fixed top-20 left-0 right-0 bg-blue-950 border-b-2 border-blue-500 shadow-md z-40 flex items-center">
      {/* 滚动行情区域 */}
      <div className="flex-1 overflow-hidden py-0.5">
        {marketData && marketData.length > 0 ? (
          <div className="flex animate-scroll">
            {/* 复制两遍数据以实现无缝滚动 */}
            {[...marketData, ...marketData].map((item, index) => {
            const isPositive = item.change >= 0;
            const colorClass = isPositive ? 'text-blue-400' : 'text-red-400';
            const name = language === "zh" ? item.nameZh : item.nameEn;
            
            return (
              <div key={`${item.symbol}-${index}`} className={`flex items-center mx-3 sm:mx-2 whitespace-nowrap ${colorClass}`}>
                <span className="font-semibold text-[11px] sm:text-xs">{name}</span>
                <span className="ml-2 sm:ml-1.5 text-[10px]">{formatPrice(item.price, item.currency)}</span>
                <span className="ml-1.5 sm:ml-1 text-[10px]">{formatChange(item.change)}</span>
                <span className="ml-1 sm:ml-0.5 text-[10px]">({formatChangePercent(item.changePercent)})</span>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center text-blue-200 text-xs">
            {language === "zh" ? "点击右侧按钮更新市场行情" : "Click the button to update market data"}
          </div>
        )}
      </div>

      {/* 更新按钮 */}
      <div className="flex items-center px-3 py-1 bg-blue-900/50 border-l border-blue-500">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs rounded transition-colors"
          title={language === "zh" ? "更新行情" : "Refresh market data"}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="whitespace-nowrap">
            {language === "zh" ? "行情更新" : "Refresh"}
          </span>
        </button>
      </div>
    </div>
  );
}
