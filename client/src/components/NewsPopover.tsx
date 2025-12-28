import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export default function NewsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { data: newsList = [] } = trpc.news.getAll.useQuery();

  // Check if mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleClick = () => {
    if (isMobile) {
      // Mobile: navigate to /news page
      setLocation("/news");
    } else {
      // Desktop: toggle popover
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 text-sm font-medium transition-all duration-200 animate-pulse-subtle"
        style={{ 
          writingMode: "vertical-rl",
          borderRadius: "4px"
        }}
      >
        {language === "zh" ? "新聞及公司動態" : "News"}
      </button>

      {/* Desktop Popover */}
      {!isMobile && isOpen && (
        <div
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-[800px] h-[450px] backdrop-blur-xl bg-white/80 rounded-lg shadow-2xl p-6 overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            {language === "zh" ? "公司動態" : "Company News"}
          </h3>

          {newsList.length === 0 ? (
            <p className="text-gray-600">
              {language === "zh" ? "暫無新聞" : "No news available"}
            </p>
          ) : (
            <div className="space-y-4">
              {newsList.map((item) => (
                <div key={item.id} className="border-b border-dashed border-gray-300 pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {new Date(item.date).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US")}
                      </p>
                      <p className="text-gray-800 leading-relaxed">{item.content}</p>
                    </div>
                  </div>

                  {/* Images */}
                  {(item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9) && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6, item.image7, item.image8, item.image9].map((img, idx) =>
                        img && (
                          <img
                            key={idx}
                            src={img}
                            alt={`News image ${idx + 1}`}
                            className="w-32 h-32 object-cover rounded"
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
