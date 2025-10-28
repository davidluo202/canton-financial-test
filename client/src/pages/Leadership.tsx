import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Leadership() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {language === "zh" ? "承纲执樞，龙骧虎步" : "Leadership Excellence"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "执掌核心要务，引领行业发展，以卓越的领导力开创金融服务新格局"
                : "Master core affairs and lead industry development with outstanding leadership"
              }
            </p>
          </div>

          {/* Leadership Content - Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {language === "zh" ? "思想领导力" : "Thought Leadership"}
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
