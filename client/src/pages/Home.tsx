import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-slate-900/80"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 border-4 border-white/30 inline-block px-12 py-8">
            誠港金融股份有限公司
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light">
            專業，潛力和合作夥伴
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            誠港金融股份有限公司是一家註冊在香港的，受SFC監管的持有1、4和9號牌照的為客戶提供高度定制化的金融服務和產品的精品投資銀行。
          </p>
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">關於我們</h2>
            <p className="text-lg max-w-2xl mx-auto">
              了解我們的公司背景、價值觀和領導團隊，探索誠港金融的專業實力與企業文化。
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/90 via-gray-800/90 to-slate-900/90"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">關於我們</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            了解我們的公司背景、價值觀和領導團隊，探索誠港金融的專業實力與企業文化。
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2064')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/85 via-blue-900/85 to-slate-900/85"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">我們可以</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            探索我們的核心業務服務，包括投資銀行、固定收益股權方案和資產財富管理解決方案。
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section
        id="leadership"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-gray-700 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/85 via-gray-700/85 to-slate-900/85"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">思想領導力</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            深入了解我們的市場洞察、行業分析和前瞻性思維，引領金融服務創新發展。
          </p>
        </div>
      </section>

      {/* Career Section */}
      <section
        id="career"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/85 via-indigo-900/85 to-slate-900/85"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">職業發展</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            加入我們的專業團隊，在充滿活力的環境中發展您的職業生涯。
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-rose-800 to-slate-900 text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/85 via-rose-800/85 to-slate-900/85"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            歡迎與我們預約聯繫
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            準備開始合作？聯繫我們的專業團隊，討論您的金融需求和投資目標。
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => alert("聯繫功能即將推出")}
          >
            聯繫我們
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
