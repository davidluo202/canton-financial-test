import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

export default function NewsPage() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { data: newsList = [] } = trpc.news.getAll.useQuery();
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">
            {language === "zh" ? "公司動態" : "Company News"}
          </h1>
        </div>
      </div>

      <div className="container py-6">
        {newsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === "zh" ? "暫無新聞" : "No news available"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsList.map((item) => {
              const isExpanded = expandedIds.includes(item.id);
              const displayContent = isExpanded ? item.content : truncateText(item.content, 100);

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {new Date(item.date).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US")}
                  </p>
                  <p className="text-gray-800 leading-relaxed mb-3">{displayContent}</p>

                  {item.content.length > 100 && (
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(item.id)} className="w-full justify-center gap-2">
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          {language === "zh" ? "收起" : "Collapse"}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          {language === "zh" ? "展開" : "Expand"}
                        </>
                      )}
                    </Button>
                  )}

                  {isExpanded && (item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9) && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6, item.image7, item.image8, item.image9].map((img, idx) =>
                        img && (
                          <img
                            key={idx}
                            src={img}
                            alt={`News image ${idx + 1}`}
                            className="w-full h-40 object-cover rounded"
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
