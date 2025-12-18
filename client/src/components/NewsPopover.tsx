import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewsPopover() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  
  // 获取所有新闻
  const { data: newsList, isLoading } = trpc.news.getAll.useQuery();

  const labels = {
    zh_TW: "新聞稿（公司動態）",
    zh_CN: "新闻稿（公司动态）",
    en: "News & Updates",
  };

  const noNewsLabels = {
    zh_TW: "暫無新聞",
    zh_CN: "暂无新闻",
    en: "No news available",
  };

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 触发区域 - 左侧边缘的标签 */}
      <div
        className={`
          bg-primary text-primary-foreground
          px-3 py-6 rounded-r-lg shadow-lg
          cursor-pointer transition-all duration-300
          flex items-center gap-2
          ${isVisible ? "translate-x-0" : "-translate-x-0"}
        `}
      >
        <Newspaper className="h-5 w-5" />
        <span className="text-sm font-semibold whitespace-nowrap writing-mode-vertical">
          {language === "zh" ? labels.zh_TW : labels.en}
        </span>
      </div>

      {/* 弹出的新闻内容 */}
      <div
        className={`
          absolute left-0 top-0 transition-all duration-300 ease-in-out
          ${isVisible ? "translate-x-full opacity-100" : "translate-x-0 opacity-0 pointer-events-none"}
        `}
        style={{ minWidth: "400px", maxWidth: "500px" }}
      >
        <Card className="ml-2 shadow-2xl border-2 border-primary/20 max-h-[80vh] overflow-hidden flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Newspaper className="h-6 w-6 text-primary" />
              {language === "zh" ? labels.zh_TW : labels.en}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !newsList || newsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === "zh" ? noNewsLabels.zh_TW : noNewsLabels.en}
              </div>
            ) : (
              <div className="space-y-4">
                {newsList.map((newsItem, index) => (
                  <div key={newsItem.id}>
                    <div className="space-y-2">
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
                      <div className="text-sm text-foreground leading-relaxed">
                        {newsItem.content}
                      </div>
                    </div>
                    {index < newsList.length - 1 && (
                      <div className="border-b border-dashed border-border my-4" />
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
}
