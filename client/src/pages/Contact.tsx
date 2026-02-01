import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
// import AIChatbot from "@/components/AIChatbot";
import { MapPin, Phone, FileText, Mail, Globe, Clock, AlertCircle } from "lucide-react";

export default function Contact() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      labelZh: "地址",
      labelEn: "Address",
      contentZh: "香港上環德輔道中308號2304-05室",
      contentEn: "Units 2304-5, 23/F, 308 Central Des Voeux, No. 308 Des Voeux Road Central, Hong Kong"
    },
    {
      icon: Phone,
      labelZh: "聯繫電話",
      labelEn: "Telephone",
      contentZh: "+852 2598 1700",
      contentEn: "+852 2598 1700",
      link: "tel:+85225981700"
    },
    {
      icon: FileText,
      labelZh: "傳真",
      labelEn: "Fax",
      contentZh: "+852 2561 7028",
      contentEn: "+852 2561 7028"
    },
    {
      icon: Mail,
      labelZh: "電子郵箱",
      labelEn: "Email",
      contentZh: "customer-services@cmfinancial.com\ninfo@cmfinancial.com",
      contentEn: "customer-services@cmfinancial.com\ninfo@cmfinancial.com",
      links: ["mailto:customer-services@cmfinancial.com", "mailto:info@cmfinancial.com"]
    },
    {
      icon: Globe,
      labelZh: "網站",
      labelEn: "Website",
      contentZh: "www.cmfinancial.com",
      contentEn: "www.cmfinancial.com",
      link: "https://www.cmfinancial.com"
    },
    {
      icon: Clock,
      labelZh: "營業時間",
      labelEn: "Business Hours",
      contentZh: "週一至週五：上午9:00 - 下午6:00\n週末及公眾假期：休息",
      contentEn: "Monday - Friday: 9:00 AM - 6:00 PM\nWeekends & Public Holidays: Closed"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <MarketTicker />
      
      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-rose-900 via-pink-900 to-purple-900 text-white py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
              {language === "zh" ? "四海志士，垂詢見教" : "Contact Us"}
            </h1>
            <p className="text-xl md:text-2xl text-center text-pink-100 max-w-4xl mx-auto">
              {language === "zh" 
                ? "欢迎各界志士仁人垂询指教"
                : "Welcome Inquiries from All Aspiring Individuals"
              }
            </p>
          </div>
        </div>

        {/* AI Customer Service Notice */}
        <div className="container py-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "zh" ? "AI客服暂停服务通知" : "AI Customer Service Temporarily Unavailable"}
                </h3>
                <p className="text-gray-700 mb-3">
                  {language === "zh" 
                    ? "我们的AI智能客服目前正在进行系统优化升级，暂时无法为您服务。请通过以下方式联系我们，我们的专业团队将立即为您提供帮助："
                    : "Our AI customer service is currently undergoing system optimization and is temporarily unavailable. Please contact us through the following channels, and our professional team will assist you immediately:"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+85225981700"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {language === "zh" ? "电话：+852 2598 1700" : "Phone: +852 2598 1700"}
                  </a>
                  <a 
                    href="mailto:customer-services@cmfinancial.com"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {language === "zh" ? "邮件：customer-services@cmfinancial.com" : "Email: customer-services@cmfinancial.com"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-16">
          {/* Building Image Section */}
          <section className="mb-12 flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg max-w-md">
              <img 
                src="/308building-2.jpg" 
                alt="CMFinancial Office Building"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* Contact Information Section */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {language === "zh" ? "聯繫方式" : "Contact Information"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {language === "zh" ? item.labelZh : item.labelEn}
                          </h3>
                          {item.links ? (
                            <div className="space-y-1">
                              {item.links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  className="block text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  {(language === "zh" ? item.contentZh : item.contentEn).split('\n')[i]}
                                </a>
                              ))}
                            </div>
                          ) : item.link ? (
                            <a
                              href={item.link}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              target={item.icon === Globe ? "_blank" : undefined}
                              rel={item.icon === Globe ? "noopener noreferrer" : undefined}
                            >
                              {language === "zh" ? item.contentZh : item.contentEn}
                            </a>
                          ) : (
                            <p className="text-gray-700 whitespace-pre-line">
                              {language === "zh" ? item.contentZh : item.contentEn}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Message */}
              <div className="mt-12 text-center">
                <p className="text-lg text-gray-700">
                  {language === "zh" 
                    ? "我們期待與您攜手合作，共同探討金融服務的無限可能，開創互利共贏的美好未來。"
                    : "We look forward to working with you to explore the infinite possibilities of financial services and create a mutually beneficial future."
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
      {/* <AIChatbot /> */} {/* 暂停AI聊天机器人以降低API用量消耗 */}
    </div>
  );
}
