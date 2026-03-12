import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Maximize2, Minimize2, X } from "lucide-react";

export default function NewsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: newsList = [], refetch } = trpc.news.getAll.useQuery(undefined, {
    enabled: false, // 禁用自动查询
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Check if mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (isMobile) {
      // Mobile: navigate to /news page
      setLocation("/news");
    } else {
      // Desktop: toggle popover
      if (!isOpen) {
        setIsOpen(true);
        refetch();
      } else {
        setIsOpen(false);
        setIsExpanded(false);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isExpanded) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsOpen(true);
      refetch();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isExpanded) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 300); // 延迟关闭，允许鼠标移动到弹窗内部
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

      {/* Desktop Popover / Modal */}
      {!isMobile && isOpen && (
        <div
          className={`${
            isExpanded 
              ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] z-[60] bg-white shadow-2xl" 
              : "absolute left-full ml-2 top-1/2 -translate-y-1/2 w-[800px] h-[450px] backdrop-blur-xl bg-white/95 shadow-2xl"
          } rounded-lg p-6 overflow-y-auto transition-all duration-300 ease-in-out border border-gray-200`}
          style={{ maxHeight: isExpanded ? "90vh" : "80vh" }}
          onMouseEnter={handleMouseEnter} // 确保鼠标在弹窗内时不关闭
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {language === "zh" ? "公司動態" : "Company News"}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title={isExpanded ? (language === "zh" ? "縮小" : "Minimize") : (language === "zh" ? "放大瀏覽" : "Expand")}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              {isExpanded && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title={language === "zh" ? "關閉" : "Close"}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {newsList.length === 0 ? (
            <p className="text-gray-600">
              {language === "zh" ? "暫無新聞" : "No news available"}
            </p>
          ) : (
            <div className="space-y-6">
              {newsList.map((item) => (
                <div key={item.id} className="border-b border-dashed border-gray-300 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        {new Date(item.date).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US")}
                      </p>
                      <p className={`text-gray-800 leading-relaxed ${isExpanded ? "text-lg" : "text-base"}`}>
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Images */}
                  {(item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9) && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6, item.image7, item.image8, item.image9].map((img, idx) => {
                        const images = [item.image1, item.image2, item.image3, item.image4, item.image5, item.image6, item.image7, item.image8, item.image9].filter(Boolean);
                        return img && (
                          <img
                            key={idx}
                            src={img}
                            alt={`News image ${idx + 1}`}
                            className={`${isExpanded ? "w-48 h-48" : "w-32 h-32"} object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 shadow-sm`}
                            onClick={() => {
                              setCurrentImages(images);
                              setLightboxIndex(images.indexOf(img));
                              setLightboxOpen(true);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox for image preview */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={currentImages.map(src => ({ src }))}
        index={lightboxIndex}
      />
    </div>
  );
}
