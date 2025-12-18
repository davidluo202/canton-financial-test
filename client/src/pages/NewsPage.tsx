import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NewsPage() {
  const [, setLocation] = useLocation();
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

  const backLabels = {
    zh_TW: "返回首頁",
    zh_CN: "返回首页",
    en: "Back to Home",
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

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="container flex items-center justify-between py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "zh" ? backLabels.zh_TW : backLabels.en}
          </Button>
          <h1 className="text-xl font-bold">
            {language === "zh" ? labels.zh_TW : labels.en}
          </h1>
          <div className="w-20" /> {/* 占位保持居中 */}
        </div>
      </div>

      {/* 新闻内容 */}
      <div className="container py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !newsList || newsList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-lg">
            {language === "zh" ? noNewsLabels.zh_TW : noNewsLabels.en}
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* 显示前3条新闻 */}
            {newsList.slice(0, 3).map((newsItem, index) => {
              const isExpanded = expandedItems.has(newsItem.id);
              const shouldTruncate = newsItem.content.length > 50;

              return (
                <div
                  key={newsItem.id}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="text-base font-bold text-primary">
                      {new Date(newsItem.date).toLocaleDateString(
                        language === "en" ? "en-US" : "zh-CN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-base text-foreground leading-relaxed">
                      {isExpanded || !shouldTruncate
                        ? newsItem.content
                        : truncateContent(newsItem.content)}
                    </div>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(newsItem.id)}
                        className="text-sm text-primary flex items-center gap-1.5 mt-2 hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            收起
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            展开阅读
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
