import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutUs() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {language === "zh" ? "总览格局，锤穹之势" : "About Us"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "了解誠港金融的发展历程、核心价值观和领导团队"
                : "Learn about CMFinancial's journey, core values, and leadership team"
              }
            </p>
          </div>

          {/* Section 1: Overview - 略陳梗概 */}
          <section id="overview" className="mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {language === "zh" ? "略陳梗概" : "Overview"}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {language === "zh" ? (
                  <p className="text-lg whitespace-pre-line">
                    誠港金融者，創業於香江，奉監於證府，備经纪、諮詢、管理諸牌照，立信乎市，立義乎人。恪守誠正，以為立身之本；講究獨見，以為謀事之樞；尚求變化，以為通達之道。每承客賓所託，皆盡心焉，務使善策得施，良效可彰。
                    
其事則：理債券以濟資，參證券以匡投，綜資產以御風險；更與有資格者，共通市埸之脈，研未來之勢，盡投資管理之能事。

積學以厚業，昌明以達道；願與客君長相與，偕行善世之途。使財者既裕，而道者亦尊；利可長久，名可垂遠。
                  </p>
                ) : (
                  <p className="text-lg">
                    Canton Mutual Financial Limited (CMFinancial) is a Hong Kong–based boutique investment banking firm, duly licensed and regulated by the Securities and Futures Commission. We are committed to delivering superior results through trusted, independent, and innovative financial solutions tailored to the needs of our clients.
                    <br /><br />
                    Our core services span debt offerings, securities investment advisory, and portfolio management. In addition, we provide qualified clients with securities execution, global market strategy research, and comprehensive investment management services.
                    <br /><br />
                    By leveraging deep market expertise and upholding a steadfast commitment to integrity and innovation, CMFinancial aspires to be a long-term partner, supporting our clients in achieving sustainable growth and enduring success.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Our Values - 立身之本 */}
          <section id="values" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {language === "zh" ? "立身之本" : "Our Values"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "zh" 
                  ? "三大核心价值观指引我们的发展方向"
                  : "Three core values that guide our journey"
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1: Profession */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">
                    {language === "zh" ? "專精立業" : "Profession"}
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {language === "zh" ? (
                    <p className="whitespace-pre-line text-center italic">
                      十年淬火，鋒芒自顯；
閱盡風雲，眼底皆兵。
市有百變，吾心如磐；
算似飛矢，決勝毫厘。
專精者，立本之勇也，
能破局於瞬息，制勝於先聲！
                    </p>
                  ) : (
                    <p>
                      Our team, averaging over a decade of professional experience across global market trading, algorithmic investment strategy modeling, corporate financing, and asset management, provides CMFinancial with a distinct competitive edge. This expertise enables us to cultivate strong industry relationships, remain closely attuned to market dynamics, and anticipate future developments with precision.
                    </p>
                  )}
                </div>
              </div>

              {/* Value 2: Potential */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">
                    {language === "zh" ? "潛能傲世" : "Potential"}
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {language === "zh" ? (
                    <p className="whitespace-pre-line text-center italic">
                      機伏暗處，勢起無聲；
時未至而先思動，潮未湧而已起行。
以才為矛，以數為盾，
洞破天機，摘取雲上之星。
潛能者，蓄雷霆於胸臆，
只待霹靂一擊破空明！
                    </p>
                  ) : (
                    <p>
                      Leveraging our team's extensive global market experience and AI-driven data intelligence, we proactively identify, evaluate, and cultivate potential investment opportunities. By combining human expertise with advanced analytics, CMFinancial provides clients with unique insights into evolving market trends, enabling them to capture value with precision and confidence.
                    </p>
                  )}
                </div>
              </div>

              {/* Value 3: Partnership */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    {language === "zh" ? "同道致遠" : "Partnership"}
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {language === "zh" ? (
                    <p className="whitespace-pre-line text-center italic">
                      同舟方識風雨烈，共道乃見赤誠深。
以義結盟，以信立交；
擎旗並肩，長驅直入。
夥伴者，非僅共利之徒，
乃可共闖江山、共證鴻圖之人也！
                    </p>
                  ) : (
                    <p>
                      At CMFinancial, we believe that human intelligence is the cornerstone of sustainable growth. Our people are our greatest asset, and we are committed to fostering a culture that empowers their creativity, expertise, and judgment. We promote openness, teamwork, and accountability across every level of the firm, ensuring that collaboration and integrity guide our decisions. By cultivating these values, CMFinancial builds enduring partnerships and positions itself for long-term success.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Leadership - 倡遠駕策 */}
          <section id="leadership" className="mb-20">
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl shadow-lg p-8 md:p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">
                {language === "zh" ? "倡遠駕策" : "Leadership"}
              </h2>
              <div className="prose prose-lg max-w-none leading-relaxed">
                {language === "zh" ? (
                  <p className="text-lg whitespace-pre-line text-white">
                    領眾以德與識，御勢以智與規；斯為誠港金融之領導所宗。於誠港金融而言，領導非徒管理之謂也。
在於定方略以導向，啟士氣以共進，
並以誠信立交，與客戶相期不負。

我司領導層皆久經市埸之濤瀾，
涉獵全球市場、科技革新、資管謀略，
各有所長，匯而為一。

以責為己任，以和為治本，
崇求變革，善相協作；
使我司應時趨勢而敏進，
因客之需而篤行。
                  </p>
                ) : (
                  <p className="text-lg text-white">
                    At CMFinancial, leadership means more than management — it is about setting direction, inspiring our people, and building trust with our clients. Our leadership team is composed of seasoned professionals with diverse backgrounds in global markets, technology, and asset management. Together, they foster a culture of accountability, collaboration, and innovation, ensuring that CMFinancial remains agile and client-focused in a dynamic financial environment.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
