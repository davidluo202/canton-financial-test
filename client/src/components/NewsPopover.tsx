import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function NewsPopover() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
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

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // 桌面端弹窗
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

      {/* 弹出的新闻内容 - 紧贴按钮，不超过右边界 */}
      <div
        className={`
          absolute left-full top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out
          ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 pointer-events-none"}
        `}
        style={{ 
          width: "min(800px, calc(100vw - 64px))", // 确保不超过右边界
          maxHeight: "80vh",
        }}
      >
        <Card className="ml-1 shadow-2xl border-2 border-primary/20 h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 flex-shrink-0 py-3">
            <CardTitle className="text-lg">
              {language === "zh" ? labels.zh_TW : labels.en}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !newsList || newsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
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
                      <div className="text-sm text-foreground leading-relaxed">
                        {newsItem.content}
                      </div>
                    </div>
                    {index < newsList.length - 1 && (
                      <div className="border-b border-dashed border-border my-3" />
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

  // 移动端全页面展开（窄长条按钮，无图标）
  const MobilePopover = () => (
    <div className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50">
      {/* 触发按钮 - 窄长条，无图标，只显示中文 */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="bg-primary text-primary-foreground px-1.5 py-6 rounded-r-md shadow-lg flex items-center justify-center"
        style={{ width: "24px" }}
      >
        <span className="text-xs font-semibold writing-mode-vertical">
          {labels.zh_TW}
        </span>
      </button>

      {/* 全页面弹窗 */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="sticky top-0 bg-background border-b border-border z-10">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-bold">
                {labels.zh_TW}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !newsList || newsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {noNewsLabels.zh_TW}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 移动端只显示前3条，可以展开查看完整内容 */}
                {newsList.slice(0, 3).map((newsItem, index) => {
                  const isExpanded = expandedItems.has(newsItem.id);
                  const shouldTruncate = newsItem.content.length > 50;

                  return (
                    <div key={newsItem.id}>
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-primary">
                          {new Date(newsItem.date).toLocaleDateString(
                            "zh-CN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-sm text-foreground leading-relaxed">
                          {isExpanded || !shouldTruncate
                            ? newsItem.content
                            : truncateContent(newsItem.content)}
                        </div>
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleExpand(newsItem.id)}
                            className="text-xs text-primary flex items-center gap-1 mt-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3" />
                                收起
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3" />
                                展开
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      {index < Math.min(newsList.length, 3) - 1 && (
                        <div className="border-b border-dashed border-border my-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

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
      <MobilePopover />
    </>
  );
}
