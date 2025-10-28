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
              {language === "zh" ? "战略纵深，破浪布局" : "Strategic Depth"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "深耕战略纵深，乘风破浪前行，为客户提供全方位的金融服务解决方案"
                : "Cultivate strategic depth and forge ahead, providing comprehensive financial service solutions"
              }
            </p>
          </div>

          {/* Services Content - Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {language === "zh" ? "核心业务" : "Core Services"}
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
