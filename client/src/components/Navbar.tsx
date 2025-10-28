import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { zh: "总览格局，锤穹之势", en: "Overview", id: "about" },
    { zh: "战略纵深，破浪布局", en: "Strategic Depth", id: "services" },
    { zh: "承纲执樞，龙骧虎步", en: "Leadership Excellence", id: "leadership" },
    { zh: "求贤若渴，群英并举", en: "Talent Recruitment", id: "career" },
    { zh: "四海志士，垂詢見教", en: "Contact", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Clickable to return to top, switches based on language */}
          <button
            onClick={scrollToTop}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={language === "zh" ? "/logo-chinese.png" : "/Logoblack.png"}
              alt={language === "zh" ? "誠港金融" : "CMFinancial"}
              className="h-12 w-auto"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {language === "zh" ? item.zh : item.en}
              </button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="ml-4"
              title={language === "zh" ? "Switch to English" : "切换到中文"}
            >
              <Globe className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={language === "zh" ? "Switch to English" : "切换到中文"}
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                {language === "zh" ? item.zh : item.en}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
