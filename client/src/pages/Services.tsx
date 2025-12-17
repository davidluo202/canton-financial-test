import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import ServiceCarousel from "@/components/ServiceCarousel";

export default function Services() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/VH1.jpg)' }}>
      <Navbar />
      <MarketTicker />
      
      <div className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {language === "zh" ? "战略纵深，破浪布局" : "What We Do"}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-md">
              {language === "zh" 
                ? "深耕战略纵深，乘风破浪前行，为客户提供全方位的金融服务解决方案"
                : "Cultivate strategic depth and forge ahead, providing comprehensive financial service solutions"
              }
            </p>
          </div>

          {/* Section 1: Investment Banking Services - 投行服務 */}
          <section id="investment-banking" className="mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {language === "zh" ? "投行服務" : "Investment Banking Services"}
              </h2>
              
              {/* Chinese-only introduction */}
              {language === "zh" && (
                <div className="text-center mb-8">
                  <p className="text-base text-gray-700 italic leading-relaxed whitespace-pre-line">
                    以謀為綱，以信為盾；通資本以濟實業，順勢勢以創新局。
— 誠港金融之投行之道
                  </p>
                </div>
              )}

              {/* Three Service Blocks */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {/* Block 1: Liability Management & Restructuring */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                    {language === "zh" ? "負債管理與重組" : "Liability Management & Restructuring"}
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    {language === "zh" ? (
                      <div className="space-y-4">
                        <p className="whitespace-pre-line">
                          我司擅為發行人、工商企業及金融機構制訂全盤負債管理與重組之策，
以優化資產負債之結構，固長遠財務之元氣。
                        </p>
                        <p className="font-semibold">所涉包括：</p>
                        <p>
                          債務再融資、債券回購、交換方案、契約再議，
及量身定制之重組規劃。
                        </p>
                        <p className="whitespace-pre-line">
                          憑離岸人民幣及全球信用市場之深耕，
導引客戶應對繁複談判及監管框架，
審衡諸方利害，保公司價值之存續，
以求善後之策行於久遠。
                        </p>
                      </div>
                    ) : (
                      <p>
                        We provide comprehensive liability management and restructuring solutions to help issuers, corporations, and financial institutions optimize their balance sheets and strengthen long-term financial resilience. Our services include debt refinancing, bond buybacks, exchange offers, covenant renegotiations, and bespoke restructuring strategies. With deep expertise in both offshore RMB and global credit markets, we guide clients through complex negotiations and regulatory frameworks, ensuring sustainable outcomes that balance stakeholder interests and preserve enterprise value.
                      </p>
                    )}
                  </div>
                </div>

                {/* Block 2: Global Market Investment Advisory */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
                    {language === "zh" ? "全球市場投資諮詢" : "Global Market Investment Advisory"}
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    {language === "zh" ? (
                      <div className="space-y-4">
                        <p className="whitespace-pre-line">
                          我司結合宏觀研析、量化模型及智能數據之洞察，
擇機捕勢於環球債券、股票及結構化產品諸領域。
                        </p>
                        <p className="font-semibold">為合資格客戶：</p>
                        <p>
                          規劃資產配置、指引跨境投資、通達政策與市勢變化。
                        </p>
                        <p className="whitespace-pre-line">
                          以深諳中國銀行間市場（CIBM）
暨國際資本市場之交易所積累之經驗，
提供可行之洞見與專策，
益其收益，御其風險。
                        </p>
                      </div>
                    ) : (
                      <p>
                        Our investment advisory services combine in-depth market research, quantitative models, and AI-driven data analytics to identify and capture opportunities across global fixed-income, equity, and structured products. We assist qualified clients in formulating allocation strategies, managing cross-border portfolios, and navigating macroeconomic and policy shifts. By leveraging our trading experience in the China Interbank Bond Market (CIBM) and global capital markets, we deliver actionable insights and tailored strategies designed to enhance returns while mitigating risk.
                      </p>
                    )}
                  </div>
                </div>

                {/* Block 3: Capital Market Solution */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">
                    {language === "zh" ? "資本市場方案" : "Capital Market Solution"}
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    {language === "zh" ? (
                      <div className="space-y-4">
                        <p className="whitespace-pre-line">
                          我司致力開創多元融資與結構化之方案，
助客戶於發行、募資及金融組合之建構。
                        </p>
                        <p className="font-semibold">所長包括：</p>
                        <p className="whitespace-pre-line">
                          債券承銷、資產證券化、結構票據與專屬融資工具，
尤精離岸人民幣市場之推動。
                        </p>
                        <p className="whitespace-pre-line">
                          聯通全球投資者與境內發行人，
以暢其流動、廣其來源、增其收益。
                        </p>
                        <p className="whitespace-pre-line">
                          憑一體化之平台：
行合規之職，聚投資者之網，
貫穿亞歐美三洲，
以精誠執行之力，使其事無不達。
                        </p>
                      </div>
                    ) : (
                      <p>
                        We deliver innovative capital market solutions to support clients in fundraising, issuance, and structured financing across multiple asset classes. Our expertise spans bond origination, securitization, structured notes, and customized financing vehicles, with a strong track record in offshore RMB markets. By bridging global investors with onshore issuers, we create efficient channels for liquidity, diversification, and yield enhancement. CMFinancial's integrated platform ensures seamless execution, regulatory compliance, and access to deep investor networks across Asia, Europe, and the United States.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: FICC and Equity - FICC 與股票業務 */}
          <section id="ficc-equity" className="mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {language === "zh" ? "FICC 與股票業務" : "FICC and Equity"}
              </h2>
              
              {/* Chinese-only introduction */}
              {language === "zh" && (
                <div className="text-center mb-12">
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    以智慧控險，以精準擇勢，與客共謀資本市場之利達。
                  </p>
                </div>
              )}

              {/* Seven Service Blocks in Carousel */}
              <ServiceCarousel
                language={language}
                slides={[
                  {
                    titleZh: "精誠經紀之務",
                    titleEn: "Elite Brokerage Coverage",
                    contentZh: "我司精通債券、貨幣、大宗及股票諸市場，\n為合資格客戶提供迅捷通達與精準執行。\n\n銷售與交易團隊歷練深厚，\n善以多年代理商、銀行及貨幣經紀之網絡，\n爭取優價與充裕流動性。\n\n融人之智與智能數據之明，\n進獻獨到洞見、行情情報與策略設計，\n助客戶審機擇勢，控險制勝。",
                    contentEn: "We provide elite brokerage coverage across fixed income, currencies, commodities (FICC), and equities, delivering seamless market access and execution tailored to qualified clients. Our seasoned sales and trading professionals leverage long-standing relationships with global dealers, banks, and money market brokers to secure competitive pricing and liquidity across diverse markets. By combining human expertise with AI-driven analytics, we offer differentiated insights, market intelligence, and trade ideas that help clients capture opportunities and manage risk with precision.",
                    color: "bg-gradient-to-br from-blue-50 to-indigo-100"
                  },
                  {
                    titleZh: "股票現貨與執行方案",
                    titleEn: "Cash Equities & Execution Solutions",
                    contentZh: "我司提供全方位現貨股票服務：\n大宗交易、程式交易、電子執行等悉備。\n\n以智能路徑、低時延科技，\n銜接亞歐美深厚之流動池，\n務求最佳執行。\n\n按組合之需與監管之度量身定制策略，\n以透明高效，貫串交易全鏈。",
                    contentEn: "Our platform offers comprehensive cash equities services solutions, including block trading, program trading, and electronic execution. We deliver best-execution solutions through smart order routing, low-latency technology, and access to deep pools of liquidity in Asia, Europe, and the United States. With a client-centric approach, we provide customized execution strategies aligned with portfolio objectives, regulatory requirements, and market conditions, ensuring transparency and efficiency throughout the entire trade cycle.",
                    color: "bg-gradient-to-br from-purple-50 to-pink-100"
                  },
                  {
                    titleZh: "衍生品",
                    titleEn: "Derivatives",
                    contentZh: "所涉範圍包括：期權、互換、期貨、結構化產品。\n\n我司為客戶設計避險、增利與風險轉移之策，\n融量化模型與即時行情而為判斷，\n助投資者控波動、優資本、拓資產敞口。\n\n無論基礎工具或定制複合結構，\n我司皆精於執行與策謀。",
                    contentEn: "We offer a full spectrum of derivative solutions across FICC and equities, including options, swaps, futures, and structured products. Our team designs innovative hedging, yield-enhancement, and risk-transfer strategies tailored to client portfolios. By integrating robust quantitative models with real-time market data, we help qualified investors manage volatility, optimize capital efficiency, and gain exposure to targeted asset classes. From plain-vanilla instruments to bespoke structured derivatives, CMFinancial provides both execution expertise and advisory depth to support dynamic investment strategies.",
                    color: "bg-gradient-to-br from-green-50 to-teal-100"
                  },
                  {
                    titleZh: "全球信用",
                    titleEn: "Global Credit",
                    contentZh: "覆蓋投資級、高收益、新興市場與離岸人民幣債券，\n供流動性、定價透明與交易策略於一體。\n\n憑深研信用與深厚代理商網絡，\n助客戶尋相對價值，控信用暴露，\n優化初級與次級市場之回報。",
                    contentEn: "We provide comprehensive coverage across the global credit spectrum, spanning investment-grade, high-yield, emerging market, and offshore RMB bonds. Our team delivers liquidity, pricing transparency, and bespoke trade ideas tailored to client mandates. Leveraging long-standing dealer relationships and deep credit research, we assist qualified investors in identifying relative-value opportunities, managing credit exposure, and optimizing portfolio performance across both primary and secondary markets.",
                    color: "bg-gradient-to-br from-amber-50 to-orange-100"
                  },
                  {
                    titleZh: "利率產品",
                    titleEn: "Interest Rate Products",
                    contentZh: "提供主權債、利率互換、期貨\n及利率掛鉤結構之方案。\n\n洞察收益曲線與政策之變化，\n精準執行、策略予謀，\n無論避險、久期管理或戰術布局，\n皆以量化輔行市情，契合投資人之需。",
                    contentEn: "Our interest rate products desk offers access to sovereign bonds, swaps, futures, and structured rate-linked solutions. We help clients navigate shifting yield curves, policy changes, and global macroeconomic trends through precise execution and strategic advisory. Whether for hedging, duration management, or tactical positioning, CMFinancial combines market insight with quantitative modeling to deliver customized strategies that address the evolving needs of qualified investors.",
                    color: "bg-gradient-to-br from-rose-50 to-red-100"
                  },
                  {
                    titleZh: "抵押及結構化產品",
                    titleEn: "Mortgage & Structured Products",
                    contentZh: "涵蓋 MBS、ABS 與結構信用工具。\n\n我司平台貫通全球資金與多元資產，\n以收益、信用、流動三者平衡為要，\n賦客戶以分散現金流與韌性組合。\n\n亦可協助客戶創構專屬投資載體，\n契合其特定偏好。",
                    contentEn: "We offer specialized expertise in mortgage-backed securities, asset-backed securities, and structured credit solutions. Our platform connects global investors with opportunities in securitized products across both traditional and alternative asset classes. By tailoring structures that balance yield, credit risk, and liquidity considerations, we enable clients to access diversified cash flows and enhance portfolio resilience. Our advisory team also assists in originating and structuring bespoke vehicles that align with specific investor requirements.",
                    color: "bg-gradient-to-br from-cyan-50 to-blue-100"
                  },
                  {
                    titleZh: "回購",
                    titleEn: "Repo",
                    contentZh: "提供高效融資與質押管理方案，\n優化資產負債運用與資金成本。\n\n連通境內外深厚流動，\n支持國債、信用債與結構票據之回購業務。\n\n重靈活安全與對手風控，\n確保清算順暢、融通無虞。",
                    contentEn: "Our repo desk provides efficient financing and collateral management solutions, enabling clients to optimize balance sheet usage and funding costs. With access to deep liquidity pools in both onshore and offshore markets, we deliver customized repo and reverse repo transactions across government bonds, credit products, and structured notes. CMFinancial emphasizes flexibility, transparency, and robust counterparty risk management to ensure smooth settlement and secure financing solutions for qualified clients.",
                    color: "bg-gradient-to-br from-violet-50 to-purple-100"
                  }
                ]}
              />
            </div>
          </section>

          {/* Section 3: Asset and Wealth Management - 資產與財富管理 */}
          <section id="asset-wealth" className="mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {language === "zh" ? "資產與財富管理" : "Asset and Wealth Management"}
              </h2>
              
              {/* Introduction */}
              <div className="text-center mb-12">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  {language === "zh" 
                    ? "財有常增，富可長傳；與君共築百年之業。"
                    : "Building enduring wealth and lasting legacies through disciplined strategies and personalized advisory."
                  }
                </p>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
                {language === "zh" ? (
                  <>
                    <p>
                      於誠港金融，資管與財富之業，在於守其本、興其財；以紀律為綱，以創新為翼，以專誠之諮詢，成客戶之鴻圖。我司融機構所長與客本位之旨，審衡表現、風險與永續三者之度，度身制策，使資產既可增益，亦得長固。
                    </p>
                    <p>
                      我司與高資產人士、家族辦公室及機構投資者長相與同行，渠可得廣布多元之投資組合：涵固定收益、股票、結構化產品、另類投資，暨專屬基金載體。憑離岸人民幣之優勢、動態配置之術、量化研析之明，於市場之興替間，捕機遇而秉韌性。
                    </p>
                    <p>
                      吾等之平台，重透明而審慎，重利益之同軌，重全球之互聯。無論全權委託之管理，抑或顧問式之專項委任，皆以客之志為心，或守富而傳世，或增益以躍進，或取息以恆續。
                    </p>
                    <p>
                      立身於風控與合規之基，誠港金融願為可信賴之伴：以世界為局，以本地為鑑，惠今人，及來者。
                    </p>
                    <p className="text-center font-semibold text-xl mt-8 text-blue-900">
                      財有常增，富可長傳；與君共築百年之業。
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      At CMFinancial, our Asset and Wealth Management business is dedicated to helping clients preserve and grow their capital through disciplined strategies, innovative products, and personalized advisory. We combine institutional expertise with a client-focused approach to deliver solutions that balance performance, risk, and long-term sustainability.
                    </p>
                    <p>
                      We partner with high-net-worth individuals, family offices, and institutional investors, offering access to diversified portfolios across fixed income, equities, structured products, alternative investments, and bespoke fund structures. Leveraging our capabilities in offshore RMB markets, dynamic allocation models, and quantitative research, we provide investment strategies designed to capture opportunities while navigating market cycles with resilience.
                    </p>
                    <p>
                      Our wealth management platform emphasizes transparency, alignment of interests, and global connectivity. From discretionary portfolio management to tailored advisory mandates, we empower clients to achieve their unique financial objectives, whether that means wealth preservation, capital appreciation, income generation, or legacy planning.
                    </p>
                    <p>
                      With a strong foundation in risk management and compliance, CMFinancial is positioned as a trusted partner, bridging global markets with local expertise and delivering long-term value for our clients and their next generations.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
      <AIChatbot />
    </div>
  );
}
