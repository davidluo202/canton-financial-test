import { publicProcedure, router } from "./_core/trpc";
import { callDataApi } from "./_core/dataApi";

export const marketRouter = router({
  /**
   * 获取实时市场数据
   * 包括股票指数、外汇汇率和贵金属价格
   */
  getMarketData: publicProcedure.query(async () => {
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
    return data.filter((item) => item !== null);
  }),
});
