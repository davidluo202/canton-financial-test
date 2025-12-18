import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export default function NewsPopover() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  
  // 获取所有新闻
  const { data: newsList, isLoading } = trpc.news.getAll.useQuery();

  const labels = {
    zh_TW: "新聞稿",
    zh_CN: "新闻稿",
    en: "News",
  };

  const noNewsLabels = {
    zh_TW: "暫無新聞",
    zh_CN: "暂无新闻",
    en: "No news available",
  };

  // 桌面端弹窗（玻璃态半透明背景）
  const DesktopPopover = () => (
    <div
      className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 触发区域 - 左侧边缘的标签（缩窄，无图标，只显示中文） */}
      <div
        className={`
          bg-primary text-primary-foreground
          px-2 py-4 rounded-r-md shadow-lg
          cursor-pointer transition-all duration-300
          flex items-center justify-center
          ${isVisible ? "translate-x-0" : "-translate-x-0"}
        `}
        style={{ width: "32px" }}
      >
        <span className="text-xs font-semibold whitespace-nowrap writing-mode-vertical">
          {language === "zh" ? labels.zh_TW : labels.zh_TW}
        </span>
      </div>

      {/* 弹出的新闻内容 - 玻璃态半透明背景 */}
      <div
        className={`
          absolute left-full top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out
          ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 pointer-events-none"}
        `}
        style={{ 
          width: "min(800px, calc(100vw - 64px))",
          maxHeight: "80vh",
        }}
      >
        <Card className="ml-1 shadow-2xl border border-white/20 h-full flex flex-col overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 flex-shrink-0 py-3 backdrop-blur-sm">
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
              {language === "zh" ? labels.zh_TW : labels.en}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !newsList || newsList.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {language === "zh" ? noNewsLabels.zh_TW : noNewsLabels.en}
              </div>
            ) : (
              <div className="space-y-3">
                {newsList.map((newsItem, index) => (
                  <div key={newsItem.id}>
                    <div className="space-y-1.5">
                      <div className="text-sm font-bold text-primary">
                        {new Date(newsItem.date).toLocaleDateString(
                          language === "en" ? "en-US" : "zh-CN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {newsItem.content}
                      </div>
                    </div>
                    {index < newsList.length - 1 && (
                      <div className="border-b border-dashed border-gray-300/50 dark:border-gray-600/50 my-3" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );

  // 移动端按钮（点击跳转到/news页面）
  const MobileButton = () => (
    <div className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={() => setLocation("/news")}
        className="bg-primary text-primary-foreground px-1.5 py-6 rounded-r-md shadow-lg flex items-center justify-center"
        style={{ width: "24px" }}
      >
        <span className="text-xs font-semibold writing-mode-vertical">
          {labels.zh_TW}
        </span>
      </button>

      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );

  return (
    <>
      <DesktopPopover />
      <MobileButton />
    </>
  );
}
