import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with User's Background Image */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center text-white pt-20"
        style={{
          backgroundImage: "url('/HomePagebackground.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Reduced opacity for brighter background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900/30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Company Name Image - switches based on language */}
          <div className="mb-8 flex justify-center">
            <img
              src={language === "zh" ? "/诚港金融股份有限公司White.png" : "/CANTONMUTUALFINANCIALLIMITED.png"}
              alt={language === "zh" ? "誠港金融股份有限公司" : "Canton Mutual Financial Limited"}
              className="w-full max-w-2xl h-auto px-4 md:px-8"
              style={{
                filter: language === "en" ? "invert(1)" : "none"
              }}
            />
          </div>
          <p className="text-2xl md:text-3xl mb-8 font-light">
            {language === "zh" ? "專業，潛力和合作夥伴" : "Profession, Potential and Partnership"}
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            {language === "zh" 
              ? "誠港金融股份有限公司是一家註冊在香港的，受SFC監管的持有1、4和9號牌照的為客戶提供高度定制化的金融服務和產品的精品投資銀行。"
              : "Canton Mutual Financial Limited is a boutique investment bank registered in Hong Kong, regulated by the SFC, holding licenses 1, 4, and 9, providing highly customized financial services and products to clients."
            }
          </p>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/VIctoriaHarbor.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/70 via-gray-800/70 to-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {language === "zh" ? "总览格局，锤穹之势" : "About CMF"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {language === "zh"
              ? "纵观全局，把握大势。以宏观视野洞察市场格局，以战略眼光布局未来发展，铸就稳固根基，成就卓越之势。"
              : "Grasp the overall situation with a macro perspective. Understand market patterns with strategic vision, build solid foundations, and achieve excellence."
            }
          </p>
          <Link href="/about">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
              {language === "zh" ? "了解更多" : "Learn More"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/VH1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {language === "zh" ? "战略纵深，破浪布局" : "What We Do"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {language === "zh"
              ? "深耕战略纵深，乘风破浪前行。以专业实力开拓市场，以创新思维引领发展，为客户提供全方位的金融服务解决方案。"
              : "Cultivate strategic depth and forge ahead through challenges. Expand markets with professional strength, lead development with innovative thinking, and provide comprehensive financial service solutions."
            }
          </p>
          <Link href="/services">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
              {language === "zh" ? "了解更多" : "Learn More"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Leadership Section */}
      <section
        id="leadership"
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-gray-700 to-slate-900 text-white"
        style={{
          backgroundImage: "url('/VictoriaHarborevening.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 via-gray-700/70 to-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {language === "zh" ? "承纲执樞，龙骧虎步" : "Thought Leadership"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {language === "zh"
              ? "执掌核心要务，引领行业发展。以卓越的领导力和专业洞察，把握市场脉搏，开创金融服务新格局。"
              : "Master core affairs and lead industry development. With outstanding leadership and professional insights, grasp market pulse and create new patterns in financial services."
            }
          </p>
          <Link href="/leadership">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
              {language === "zh" ? "了解更多" : "Learn More"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Career Section */}
      <section
        id="career"
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/70 via-indigo-900/70 to-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {language === "zh" ? "求贤若渴，群英并举" : "Talent Recruitment"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {language === "zh"
              ? "广纳天下英才，共创辉煌未来。我们诚邀各界精英加入，在充满机遇的平台上施展才华，共同成就卓越事业。"
              : "Welcome talents from all fields to create a brilliant future together. We sincerely invite elites to join us, showcase their talents on a platform full of opportunities, and achieve excellence together."
            }
          </p>
          <Link href="/career">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white">
              {language === "zh" ? "了解更多" : "Learn More"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-pink-800 via-rose-900 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-800/70 via-rose-900/70 to-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {language === "zh" ? "四海志士，垂詢見教" : "Contact"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-12">
            {language === "zh"
              ? "欢迎各界志士仁人垂询指教。我们期待与您携手合作，共同探讨金融服务的无限可能，开创互利共赢的美好未来。"
              : "Welcome inquiries from all aspiring individuals. We look forward to working with you to explore the infinite possibilities of financial services and create a mutually beneficial future."
            }
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              {language === "zh" ? "聯繫我們" : "Contact Us"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
