import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  const menuItems = [
    { zh: "關於我們", en: "About Us", id: "about" },
    { zh: "我們可以", en: "What We Can Do", id: "services" },
    { zh: "思想領導力", en: "Thought Leadership", id: "leadership" },
    { zh: "職業發展", en: "Career", id: "career" },
    { zh: "聯繫我們", en: "Contact Us", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="誠港金融"
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="ml-3 text-xl font-bold text-blue-900">
              誠港金融
            </span>
          </div>

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
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="ml-4"
            >
              {language === "zh" ? "EN" : "中文"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
            >
              {language === "zh" ? "EN" : "中文"}
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
