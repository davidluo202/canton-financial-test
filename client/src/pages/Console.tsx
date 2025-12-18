import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit2, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Console() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editContent, setEditContent] = useState("");

  // 获取当前用户
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();

  // 获取所有新闻
  const { data: newsList, isLoading: newsLoading, refetch } = trpc.news.getAll.useQuery();

  // 创建新闻
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      toast.success("新闻创建成功");
      setDate("");
      setContent("");
      refetch();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  // 更新新闻
  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      toast.success("新闻更新成功");
      setEditingId(null);
      setEditDate("");
      setEditContent("");
      refetch();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  // 删除新闻
  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      toast.success("新闻删除成功");
      refetch();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  // 检查用户权限
  useEffect(() => {
    if (!userLoading && (!user || user.role !== "admin")) {
      toast.error("您没有权限访问此页面");
      setLocation("/");
    }
  }, [user, userLoading, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !content) {
      toast.error("请填写所有字段");
      return;
    }

    if (content.length > 200) {
      toast.error("新闻内容不能超过200个汉字");
      return;
    }

    createNews.mutate({ date, content });
  };

  const handleEdit = (newsItem: any) => {
    setEditingId(newsItem.id);
    setEditDate(new Date(newsItem.date).toISOString().split("T")[0]);
    setEditContent(newsItem.content);
  };

  const handleUpdate = () => {
    if (!editDate || !editContent) {
      toast.error("请填写所有字段");
      return;
    }

    if (editContent.length > 200) {
      toast.error("新闻内容不能超过200个汉字");
      return;
    }

    updateNews.mutate({
      id: editingId!,
      date: editDate,
      content: editContent,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这条新闻吗？")) {
      deleteNews.mutate({ id });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDate("");
    setEditContent("");
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            新闻稿管理后台
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理公司动态和新闻发布
          </p>
        </div>

        {/* 创建新闻表单 */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              发布新闻
            </CardTitle>
            <CardDescription>
              填写日期和新闻内容（最多200个汉字）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">日期</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="max-w-xs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  新闻内容 ({content.length}/200)
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入新闻内容..."
                  rows={4}
                  maxLength={200}
                  required
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={createNews.isPending}
                className="w-full sm:w-auto"
              >
                {createNews.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    发布新闻
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 新闻列表 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>已发布新闻</CardTitle>
            <CardDescription>
              按日期倒序排列，最新的新闻显示在最前面
            </CardDescription>
          </CardHeader>
          <CardContent>
            {newsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !newsList || newsList.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                暂无新闻，请发布第一条新闻
              </div>
            ) : (
              <div className="space-y-4">
                {newsList.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingId === newsItem.id ? (
                      /* 编辑模式 */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">日期</label>
                          <Input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="max-w-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            新闻内容 ({editContent.length}/200)
                          </label>
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            maxLength={200}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdate}
                            disabled={updateNews.isPending}
                            size="sm"
                          >
                            {updateNews.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                保存中...
                              </>
                            ) : (
                              "保存"
                            )}
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            variant="outline"
                            size="sm"
                          >
                            <X className="mr-2 h-4 w-4" />
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* 显示模式 */
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-primary mb-2">
                            {new Date(newsItem.date).toLocaleDateString("zh-CN")}
                          </div>
                          <div className="text-slate-700 dark:text-slate-300">
                            {newsItem.content}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleEdit(newsItem)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(newsItem.id)}
                            variant="destructive"
                            size="sm"
                            disabled={deleteNews.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
