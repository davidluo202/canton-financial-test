import { publicProcedure, router } from "./_core/trpc";

// 服务端缓存
let marketDataCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15分钟缓存

export const marketRouter = router({
  getMarketData: publicProcedure.query(async () => {
    // 检查缓存是否有效
    const now = Date.now();
    if (marketDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[MarketData] 返回缓存数据');
      return marketDataCache;
    }
    // 定义所有需要获取的市场数据符号
    const symbols = [
      // 股票指数
      { symbol: "^DJI", type: "index", nameZh: "道瓊斯", nameEn: "Dow Jones" },
      { symbol: "^IXIC", type: "index", nameZh: "納斯達克", nameEn: "NASDAQ" },
      { symbol: "^GSPC", type: "index", nameZh: "標普500", nameEn: "S&P 500" },
      { symbol: "000001.SS", type: "index", nameZh: "上證綜指", nameEn: "Shanghai" },
      { symbol: "^HSI", type: "index", nameZh: "恆生指數", nameEn: "Hang Seng" },
      
      // 外汇汇率
      { symbol: "CNY=X", type: "forex", nameZh: "美元/人民幣", nameEn: "USD/CNY" },
      { symbol: "EURUSD=X", type: "forex", nameZh: "歐元/美元", nameEn: "EUR/USD" },
      { symbol: "JPY=X", type: "forex", nameZh: "美元/日元", nameEn: "USD/JPY" },
      { symbol: "GBPUSD=X", type: "forex", nameZh: "英鎊/美元", nameEn: "GBP/USD" },
      
      // 贵金属
      { symbol: "GC=F", type: "commodity", nameZh: "黃金", nameEn: "Gold" },
      { symbol: "SI=F", type: "commodity", nameZh: "白銀", nameEn: "Silver" },
    ];

    try {
      const results = [];
      for (const item of symbols) {
        try {
          // Add a user agent to bypass some simple blocks
          const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.symbol)}?interval=1d&range=2d`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) continue;
          
          const data = await response.json();
          if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
            const result = data.chart.result[0];
            const meta = result.meta;
            
            const currentPrice = meta.regularMarketPrice || 0;
            const previousClose = meta.chartPreviousClose || meta.previousClose || 0;
            
            const change = currentPrice - previousClose;
            const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
            
            results.push({
              symbol: item.symbol,
              type: item.type,
              nameZh: item.nameZh,
              nameEn: item.nameEn,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              currency: meta.currency || "USD",
            });
          }
        } catch (e) {
          console.error(`Failed to fetch ${item.symbol}:`, e);
        }
      }
      
      if (results.length > 0) {
        marketDataCache = results;
        cacheTimestamp = Date.now();
        console.log(`[MarketData] 缓存已更新，获取到 ${results.length} 条数据`);
        return results;
      }
    } catch (e) {
      console.error('[MarketData] Fetch all failed', e);
    }

    if (marketDataCache) return marketDataCache;

    // Fallback data if everything fails
    return [
      { symbol: "^DJI", type: "index", nameZh: "道瓊斯", nameEn: "Dow Jones", price: 44071.56, change: 55.96, changePercent: 0.11, currency: "USD" },
      { symbol: "^IXIC", type: "index", nameZh: "納斯達克", nameEn: "NASDAQ", price: 18685.12, change: -172.33, changePercent: -0.72, currency: "USD" },
      { symbol: "^GSPC", type: "index", nameZh: "標普500", nameEn: "S&P 500", price: 5969.01, change: -9.02, changePercent: -0.13, currency: "USD" },
      { symbol: "000001.SS", type: "index", nameZh: "上證綜指", nameEn: "Shanghai", price: 3432.61, change: -0.09, changePercent: -0.002, currency: "CNY" },
      { symbol: "^HSI", type: "index", nameZh: "恆生指數", nameEn: "Hang Seng", price: 19325.89, change: 462.74, changePercent: 1.72, currency: "HKD" },
      { symbol: "CNY=X", type: "forex", nameZh: "美元/人民幣", nameEn: "USD/CNY", price: 7.2495, change: 0.002, changePercent: 0.03, currency: "CNY" },
      { symbol: "EURUSD=X", type: "forex", nameZh: "歐元/美元", nameEn: "EUR/USD", price: 1.0535, change: -0.0037, changePercent: -0.31, currency: "USD" },
      { symbol: "JPY=X", type: "forex", nameZh: "美元/日元", nameEn: "USD/JPY", price: 153.55, change: 0.54, changePercent: 0.35, currency: "JPY" },
      { symbol: "GBPUSD=X", type: "forex", nameZh: "英鎊/美元", nameEn: "GBP/USD", price: 1.2569, change: -0.0042, changePercent: -0.30, currency: "USD" },
      { symbol: "GC=F", type: "commodity", nameZh: "黃金", nameEn: "Gold", price: 2975.50, change: 20.70, changePercent: 0.39, currency: "USD" },
      { symbol: "SI=F", type: "commodity", nameZh: "白銀", nameEn: "Silver", price: 31.58, change: 1.15, changePercent: 1.01, currency: "USD" },
    ];
  }),
});
