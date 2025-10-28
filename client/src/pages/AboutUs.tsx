import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutUs() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/VictoriaHarbor.jpg)' }}>
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {language === "zh" ? "总览格局，锤穹之势" : "About CMF"}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-md">
              {language === "zh" 
                ? "了解誠港金融的发展历程、核心价值观和领导团队"
                : "Learn about CMFinancial's journey, core values, and leadership team"
              }
            </p>
          </div>

           {/* Section 1: Overview - 略陳梗概 */}
          <section id="overview" className="mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "zh" ? "略陳梗概" : "Overview"}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {language === "zh" ? (
                  <p className="text-base whitespace-pre-line">
                    誠港金融者，創業於香江，奉監於證府，備经纪、諮詢、管理諸牌照，立信乎市，立義乎人。恪守誠正，以為立身之本；講究獨見，以為謀事之樞；尚求變化，以為通達之道。每承客賓所託，皆盡心焉，務使善策得施，良效可彰。
                    
其事則：理債券以濟資，參證券以匡投，綜資產以御風險；更與有資格者，共通市埸之脈，研未來之勢，盡投資管理之能事。

積學以厚業，昌明以達道；願與客君長相與，偕行善世之途。使財者既裕，而道者亦尊；利可長久，名可垂遠。
                  </p>
                ) : (
                  <p className="text-base">
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
          <section id="values" className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {language === "zh" ? "立身之本" : "Our Values"}
              </h2>
              <p className="text-lg text-white drop-shadow-md">
                {language === "zh" 
                  ? "三大核心价值观指引我们的发展方向"
                  : "Three core values that guide our journey"
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1: Profession */}
              <div className="bg-white/75 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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
              <div className="bg-white/75 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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
              <div className="bg-white/75 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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
          <section id="leadership" className="mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "zh" ? "倡遠駕策" : "Leadership"}
              </h2>
              <div className="prose prose-lg max-w-none leading-relaxed">
                {language === "zh" ? (
                  <p className="text-base whitespace-pre-line text-gray-800">
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
                  <p className="text-base text-gray-800">
                    At CMFinancial, leadership means more than management — it is about setting direction, inspiring our people, and building trust with our clients. Our leadership team is composed of seasoned professionals with diverse backgrounds in global markets, technology, and asset management. Together, they foster a culture of accountability, collaboration, and innovation, ensuring that CMFinancial remains agile and client-focused in a dynamic financial environment.
                  </p>
                )}
              </div>

              {/* Executive Bios */}
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Jack Mou Bio */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <img 
                        src="/Jack.jpg" 
                        alt="Jack Mou" 
                        className="w-32 h-32 rounded-xl object-cover border-4 border-white/20"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {language === "zh" ? "牟致雪" : "Jack Mou"}
                      </h3>
                      <p className="text-blue-600 text-lg">
                        {language === "zh" ? "创始人兼董事长" : "Founder & Chairman"}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {language === "zh" ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
牟公歷涬金融二十載，馳騁全球市場，洞達監理規章；曾效力於多家國際名門金融機構，履歷顯赫，望重業林。所長涵蓋監管統御、產品創新、風險治理及跨境資本運作，於複雜金融工具尤精，能為機構與高資者度身制策，應變無虞。

主政誠港金融之日，牟公以嚴治風控，以正立規範——樹合規與風險管理之鴻樞，厚植企業可久之基；使合規不獨為責任之所歸，乃企業精神之所宗。

牟公領導之道，曰：「合規先於營商。」
是言也，深徹人心，貫穿公司運行之全域：
守信託之義，護客戶之利；明程序之正，存操守之清。
策劃創新，必以安全為先；開拓商機，尤以倫理為重。

在其高瞻遠矚之引領下，誠港金融既臻穩健之基，又拓創新之路；
以卓越守護為盾，以前瞻策略為矛，
為客戶開啟安心長興之財智大道。
                      </p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
Jack Mou brings over two decades of distinguished leadership in compliance and global markets, with an extensive track record at premier international financial institutions. His deep expertise encompasses regulatory oversight, financial product innovation, enterprise risk management, and cross-border capital markets operations. Recognized industry-wide for his mastery of complex financial instruments, Jack specializes in developing bespoke solutions for institutional investors and high-net-worth individuals.
<br /><br />
As Chairman of CMFinancial, Jack spearheads the firm's strategic governance framework, setting uncompromising standards in compliance and risk management. Under his stewardship, CMFinancial has institutionalized a culture where regulatory excellence transcends obligation—becoming a foundational pillar of corporate identity.
<br /><br />
Jack's leadership philosophy—"Compliance precedes commerce"—permeates every facet of CMFinancial's operations. This principle ensures client interests remain paramount through rigorous adherence to fiduciary duty, operational transparency, and ethical business practices. With Jack's visionary guidance, CMFinancial continues to pioneer secure, innovative financial solutions while maintaining an unwavering commitment to client protection.
                      </p>
                    )}
                  </div>
                </div>

                {/* Xintao Luo Bio */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <img 
                        src="/Xintao.jpg" 
                        alt="Xintao Luo" 
                        className="w-32 h-32 rounded-xl object-cover border-4 border-white/20"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {language === "zh" ? "羅新濤" : "Xintao Luo"}
                      </h3>
                      <p className="text-blue-600 text-lg">
                        {language === "zh" ? "行政总裁兼CEO" : "President & CEO"}
                      </p>
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {language === "zh" ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
羅公，治金融三十載，統領銀行、證券與監管之業，足跡跨美歐亞三洲。曾任中國工商銀行美國行行長兼總裁，主持併購後全局調整，創發該行首張美國信用卡，自草創而立盈收，以至年利達巨額，功績卓著。往昔任職海通國際首席技術官，及海通美國副行政總裁，管轄SFC、SEC、FINRA諸監境之營運與科技，駕輕就熟。其所擅者，涵資本市場之通達、金融科技之創新、數十億美金資產之管理運籌，一以貫之。

羅公肘業康奈爾大學，獲高階工商管理碩士（EMBA）；兼具FRM資格與FINRA執照，理論與實踐並臻其妙。能英語華語雙擅，融全球視野與本地合規之智，統籌全局，務求穩健卓遠之成長；治事果決，執行不紊，推企業卓越運營之道。以識領勢，以法制權；以創御變，以行致功。

羅公所踐，即誠港金融永續昌興之道也。
                      </p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
Xintao Luo is a seasoned financial services executive with over three decades of leadership in global banking, securities markets, and regulatory compliance. He served as President & CEO of ICBC USA, he spearheaded the post-acquisition transformation, launched the bank's first U.S. credit card, and grew the profitability from inception to tens of millions of dollars annual revenues.
<br /><br />
With a proven track record across the U.S., Europe, and Asia, he has held executive roles including CTO of Haitong International and Deputy CEO of Haitong Securities USA, overseeing regulated operations and technology across SFC, SEC, and FINRA jurisdictions. His expertise spans capital markets, fintech innovation, and multi-billion-dollar AUM management.
<br /><br />
With an Executive MBA graduate from Cornell University, and a FINRA-licensed, FRM-certified professional, Xintao blends strategic vision with hands-on execution in regulated environments. Fluent in English and Chinese, he integrates global insight with local compliance acumen to drive sustainable growth and operational excellence.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
