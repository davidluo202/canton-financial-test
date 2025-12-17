import { publicProcedure, router } from "./_core/trpc";
import { callDataApi } from "./_core/dataApi";

// 服务端缓存
let marketDataCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 静态fallback数据（当API完全失败且无缓存时使用）
const FALLBACK_DATA = [
  { symbol: "^DJI", type: "index", nameZh: "道瓊斯", nameEn: "Dow Jones", price: 43800, change: 15, changePercent: 0.03, currency: "USD" },
  { symbol: "^IXIC", type: "index", nameZh: "納斯達克", nameEn: "NASDAQ", price: 19900, change: 20, changePercent: 0.10, currency: "USD" },
  { symbol: "^GSPC", type: "index", nameZh: "標普500", nameEn: "S&P 500", price: 6050, change: 23, changePercent: 0.38, currency: "USD" },
  { symbol: "000001.SS", type: "index", nameZh: "上證綜指", nameEn: "Shanghai", price: 3250, change: -15, changePercent: -0.46, currency: "CNY" },
  { symbol: "^HSI", type: "index", nameZh: "恆生指數", nameEn: "Hang Seng", price: 19700, change: -150, changePercent: -0.76, currency: "HKD" },
  { symbol: "EURUSD=X", type: "forex", nameZh: "歐元/美元", nameEn: "EUR/USD", price: 1.05, change: 0.002, changePercent: 0.19, currency: "USD" },
  { symbol: "JPY=X", type: "forex", nameZh: "美元/日元", nameEn: "USD/JPY", price: 150.5, change: 0.3, changePercent: 0.20, currency: "JPY" },
  { symbol: "GBPUSD=X", type: "forex", nameZh: "英鎊/美元", nameEn: "GBP/USD", price: 1.27, change: 0.003, changePercent: 0.24, currency: "USD" },
  { symbol: "GC=F", type: "commodity", nameZh: "黃金", nameEn: "Gold", price: 2650, change: 12, changePercent: 0.45, currency: "USD" },
  { symbol: "SI=F", type: "commodity", nameZh: "白銀", nameEn: "Silver", price: 30.5, change: 0.2, changePercent: 0.66, currency: "USD" },
];

export const marketRouter = router({
  /**
   * 获取实时市场数据
   * 包括股票指数、外汇汇率和贵金属价格
   */
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

    const results = [];

    // 并行获取所有市场数据
    const promises = symbols.map(async (item) => {
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
          
          // 计算涨跌
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
        console.error(`Error fetching data for ${item.symbol}:`, error);
        return null;
      }
    });

    const data = await Promise.all(promises);
    
    // 过滤掉失败的请求
    const validData = data.filter((item) => item !== null);
    
    // 只有当获取到有效数据时才更新缓存
    if (validData.length > 0) {
      marketDataCache = validData;
      cacheTimestamp = Date.now();
      console.log(`[MarketData] 缓存已更新，获取到 ${validData.length} 条数据`);
    } else {
      console.log('[MarketData] 未获取到有效数据，保持旧缓存');
    }
    
    // 如果没有新数据但有缓存，返回缓存
    if (validData.length === 0 && marketDataCache) {
      console.log('[MarketData] API失败，返回旧缓存数据');
      return marketDataCache;
    }
    
    // 如果既没有新数据也没有缓存，返回fallback数据
    if (validData.length === 0 && !marketDataCache) {
      console.log('[MarketData] API失败且无缓存，返回fallback数据');
      return FALLBACK_DATA;
    }
    
    return validData;
  }),
});
