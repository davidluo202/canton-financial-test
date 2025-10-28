import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {language === "zh" ? "四海志士，垂詢見教" : "Contact"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "zh" 
                ? "欢迎各界志士仁人垂询指教，期待与您携手合作，共同探讨金融服务的无限可能"
                : "Welcome inquiries from all aspiring individuals. We look forward to working with you"
              }
            </p>
          </div>

          {/* Contact Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {language === "zh" ? "联系我们" : "Get In Touch"}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {language === "zh" 
                ? "此页面内容正在完善中，敬请期待..."
                : "Content coming soon..."
              }
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => alert(language === "zh" ? "聯繫功能即將推出" : "Contact feature coming soon")}
            >
              {language === "zh" ? "發送消息" : "Send Message"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
