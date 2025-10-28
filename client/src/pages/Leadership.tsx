import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Leadership() {
  const { language } = useLanguage();

  const pillars = [
    {
      titleZh: "一、觀遠",
      titleEn: "Vision",
      contentZh: "洞察寰球資本市場新態，\n化趨勢為可行之策。",
      contentEn: "Identifying emerging trends in global capital markets and translating them into actionable strategies.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      titleZh: "二、創變",
      titleEn: "Innovation",
      contentZh: "融AI演算、結構工具與跨境所長，\n為客戶度身成器。",
      contentEn: "Developing bespoke financial solutions that integrate AI-driven analytics, structured products, and cross-border expertise.",
      color: "from-purple-500 to-pink-500"
    },
    {
      titleZh: "三、立信",
      titleEn: "Credibility",
      contentZh: "恪守誠信與監理之法，\n以正道贏信托之心。",
      contentEn: "Earning trust through consistent integrity, regulatory discipline, and client-centric insights.",
      color: "from-green-500 to-teal-500"
    },
    {
      titleZh: "四、致效",
      titleEn: "Impact",
      contentZh: "參與市場論道，\n推動離岸人民幣、結構票據與資管之演進。",
      contentEn: "Contributing to the broader market dialogue, shaping the evolution of offshore RMB markets, structured notes, and asset management strategies.",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
              {language === "zh" ? "承纲执樞，龙骧虎步" : "Thought Leadership"}
            </h1>
            <p className="text-xl md:text-2xl text-center text-blue-100 max-w-4xl mx-auto">
              {language === "zh" 
                ? "以智化勢，以策導大局，引領行業前行"
                : "Shaping the Future of Finance Through Vision and Innovation"
              }
            </p>
          </div>
        </div>

        <div className="container py-16">
          {/* Introduction Section */}
          <section className="mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {language === "zh" ? (
                  <>
                    <p className="text-xl leading-relaxed mb-6">
                      思領者，不徒自思；<br/>
                      以智化勢，以策導大局，使群賓同向光明之途。不但專精於業務，更在以卓識引眾志，以遠見定潮向：以獨立之判斷開先河，以原創之洞察開新局。
                    </p>
                    <p className="text-lg text-gray-700 mb-8">
                      誠港金融之思領，所寓於四：
                    </p>
                  </>
                ) : (
                  <p className="text-xl leading-relaxed">
                    Thought leadership goes beyond expertise — it is the ability to influence, inspire, and guide others through original insights, independent judgment, and forward-looking perspectives. In finance and investment banking, thought leadership means anticipating market shifts, framing new solutions to complex challenges, and setting industry standards rather than following them.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Four Pillars Section */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${pillar.color}`}></div>
                  
                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">
                      {language === "zh" ? pillar.titleZh : pillar.titleEn}
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                      {language === "zh" ? pillar.contentZh : pillar.contentEn}
                    </p>
                  </div>

                  {/* Decorative gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>
          </section>

          {/* Conclusion Section */}
          <section>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {language === "zh" ? (
                  <p className="text-xl text-center font-medium">
                    於金融與投行之域，思領即先知市場之變，能為諸難設策，破局於未萌；<br/>
                    非逐時風而動，乃立規範而先行者也。
                  </p>
                ) : (
                  <p className="text-xl text-center">
                    In essence, thought leadership is not just about independent thinking, but about turning insight into influence — helping clients, partners, and the industry at large to navigate uncertainty, capture opportunities, and move confidently into the future.
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
