import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Career() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {language === "zh" ? "求贤若渴，群英并举" : "Talent Recruitment"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "广纳天下英才，共创辉煌未来，在充满机遇的平台上施展才华"
                : "Welcome talents to create a brilliant future together on a platform full of opportunities"
              }
            </p>
          </div>

          {/* Career Content - Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {language === "zh" ? "职业发展" : "Career Opportunities"}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === "zh" 
                ? "此页面内容正在完善中，敬请期待..."
                : "Content coming soon..."
              }
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
