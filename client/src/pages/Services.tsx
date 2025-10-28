import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Services() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {language === "zh" ? "战略纵深，破浪布局" : "What We Do"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "深耕战略纵深，乘风破浪前行，为客户提供全方位的金融服务解决方案"
                : "Cultivate strategic depth and forge ahead, providing comprehensive financial service solutions"
              }
            </p>
          </div>

          {/* Section 1: Investment Banking Services - 投行服務 */}
          <section id="investment-banking" className="mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {language === "zh" ? "投行服務" : "Investment Banking Services"}
              </h2>
              
              {/* Chinese-only introduction */}
              {language === "zh" && (
                <div className="text-center mb-12">
                  <p className="text-lg text-gray-700 italic leading-relaxed whitespace-pre-line">
                    以謀為綱，以信為盾；通資本以濟實業，順勢勢以創新局。
— 誠港金融之投行之道
                  </p>
                </div>
              )}

              {/* Three Service Blocks */}
              <div className="grid md:grid-cols-3 gap-8 mt-12">
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

          {/* Placeholder for additional sub-sections */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <p className="text-lg text-gray-600">
              {language === "zh" 
                ? "更多服务内容即将推出，敬请期待..."
                : "More services coming soon..."
              }
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
