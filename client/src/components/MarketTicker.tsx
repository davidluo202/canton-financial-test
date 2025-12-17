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

export default function MarketTicker() {
  const { language } = useLanguage();
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  // 获取市场数据
  const { data, isLoading } = trpc.market.getMarketData.useQuery(undefined, {
    refetchInterval: 60000, // 每60秒刷新一次
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setMarketData(data as MarketData[]);
    }
  }, [data]);

  if (isLoading || marketData.length === 0) {
    return (
      <div className="bg-slate-900 text-white py-2 overflow-hidden">
        <div className="text-center text-sm text-slate-400">
          {language === "zh" ? "載入市場數據..." : "Loading market data..."}
        </div>
      </div>
    );
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

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900 text-white py-2 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {/* 渲染两次数据以实现无缝循环滚动 */}
          {[...marketData, ...marketData].map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="ticker-item inline-flex items-center px-6 whitespace-nowrap"
            >
              <span className="font-semibold text-sm mr-2">
                {language === "zh" ? item.nameZh : item.nameEn}
              </span>
              <span className="text-sm mr-2">
                {formatPrice(item.price, item.type)}
              </span>
              <span className={`text-xs font-medium ${getChangeColor(item.change)}`}>
                {getChangeSymbol(item.change)}
                {item.change.toFixed(2)} (
                {getChangeSymbol(item.changePercent)}
                {item.changePercent.toFixed(2)}%)
              </span>
              <span className="mx-4 text-slate-600">|</span>
            </div>
          ))}
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
