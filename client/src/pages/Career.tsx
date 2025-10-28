import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

export default function Career() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
              {language === "zh" ? "求贤若渴，群英并举" : "Talent Recruitment"}
            </h1>
            <p className="text-xl md:text-2xl text-center text-blue-100 max-w-4xl mx-auto">
              {language === "zh" 
                ? "廣納天下英才，共創輝煌未來"
                : "Welcome Talents from All Fields to Create a Brilliant Future Together"
              }
            </p>
          </div>
        </div>

        <div className="container py-16">
          {/* Building Image Section */}
          <section className="mb-12 flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg max-w-md">
              <img 
                src="/308building-1.jpg" 
                alt="CMFinancial Office Building"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* Content Section */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {language === "zh" ? (
                  <>
                    <p className="text-xl mb-8 whitespace-pre-line">
                      誠邀英才，共襄偉業。
誠港金融以弘毅為志，志在構建一方充盈生氣、創意與專業之園地。吾輩深信，人之才華，乃企業最珍之寶。無論君為歷練深厚之金融宿將，抑或意氣風發之初露青年，皆誠迎並肩而行。
                    </p>
                    <p className="text-lg text-gray-700 mb-12 whitespace-pre-line">
                      在誠港金融，君將得與寰球市場並馳，參與投行宏業；與業界俊彥同席共策；於挑戰與機遇並陳之境，砥礪自新，日進不已。
                    </p>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Mail className="mr-3 h-6 w-6 text-blue-600" />
                        有意者請將個人簡歷發送至：
                      </h3>
                      <a 
                        href="mailto:HR@cmfinancial.com"
                        className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        HR@cmfinancial.com
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl mb-8">
                      We sincerely invite elites to join us, showcase their talents on a platform full of opportunities, and achieve excellence together.
                    </p>
                    <p className="text-lg text-gray-700 mb-8">
                      CMFinancial is committed to creating a dynamic, innovative, and professional work environment. We believe that outstanding talent is the company's most valuable asset. Whether you are an experienced financial professional or a passionate recent graduate, we look forward to your joining.
                    </p>
                    <p className="text-lg text-gray-700 mb-12">
                      At CMFinancial, you will have the opportunity to participate in global investment banking business, work with top industry experts, and grow continuously in an environment full of challenges and opportunities.
                    </p>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Mail className="mr-3 h-6 w-6 text-blue-600" />
                        Please send your resume to:
                      </h3>
                      <a 
                        href="mailto:HR@cmfinancial.com"
                        className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        HR@cmfinancial.com
                      </a>
                    </div>
                  </>
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
