import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { compressImageToDataURL } from "@/lib/imageCompression";

const CONSOLE_AUTH_TOKEN = "console_admin_session";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Cmf25617028%";

export default function Console() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // News form state
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [image6, setImage6] = useState("");
  const [image7, setImage7] = useState("");
  const [image8, setImage8] = useState("");
  const [image9, setImage9] = useState("");
  
  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: newsList = [], refetch } = trpc.news.getAll.useQuery();
  const createNews = trpc.news.create.useMutation();
  const updateNews = trpc.news.update.useMutation();
  const deleteNews = trpc.news.delete.useMutation();
  const uploadImage = trpc.news.uploadImage.useMutation();

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem("consoleAuth");
    if (auth === CONSOLE_AUTH_TOKEN) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("consoleAuth", CONSOLE_AUTH_TOKEN);
      setIsAuthenticated(true);
      toast.success("登錄成功");
    } else {
      toast.error("用戶名或密碼錯誤");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("consoleAuth");
    setIsAuthenticated(false);
    toast.success("已退出登錄");
  };

  const handleImageUpload = async (file: File, imageNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => {
    try {
      // 压缩图片到300KB以下
      const compressedDataURL = await compressImageToDataURL(file, 300);
      
      // 直接使用压缩后的Data URL（无需上传到服务器）
      if (imageNumber === 1) setImage1(compressedDataURL);
      if (imageNumber === 2) setImage2(compressedDataURL);
      if (imageNumber === 3) setImage3(compressedDataURL);
      if (imageNumber === 4) setImage4(compressedDataURL);
      if (imageNumber === 5) setImage5(compressedDataURL);
      if (imageNumber === 6) setImage6(compressedDataURL);
      if (imageNumber === 7) setImage7(compressedDataURL);
      if (imageNumber === 8) setImage8(compressedDataURL);
      if (imageNumber === 9) setImage9(compressedDataURL);
      
      toast.success(`圖片 ${imageNumber} 上傳成功（已壓縮）`);
    } catch (error) {
      console.error("圖片上傳失敗：", error);
      toast.error("圖片上傳失敗");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content) {
      toast.error("請填寫日期和內容");
      return;
    }

    if (content.length > 300) {
      toast.error("內容不能超過300個字");
      return;
    }

    try {
      if (editingId) {
        await updateNews.mutateAsync({
          id: editingId,
          date,
          content,
          image1,
          image2,
          image3,
          image4,
          image5,
          image6,
          image7,
          image8,
          image9,
          consoleAuth: CONSOLE_AUTH_TOKEN,
        });
        toast.success("新聞更新成功");
        setEditingId(null);
      } else {
        await createNews.mutateAsync({
          date,
          content,
          image1,
          image2,
          image3,
          image4,
          image5,
          image6,
          image7,
          image8,
          image9,
          consoleAuth: CONSOLE_AUTH_TOKEN,
        });
        toast.success("新聞發布成功");
      }

      // Reset form
      setDate("");
      setContent("");
      setImage1("");
      setImage2("");
      setImage3("");
      setImage4("");
      setImage5("");
      setImage6("");
      setImage7("");
      setImage8("");
      setImage9("");
      refetch();
    } catch (error) {
      toast.error("操作失敗");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setDate(new Date(item.date).toISOString().split("T")[0]);
    setContent(item.content);
    setImage1(item.image1 || "");
    setImage2(item.image2 || "");
    setImage3(item.image3 || "");
    setImage4(item.image4 || "");
    setImage5(item.image5 || "");
    setImage6(item.image6 || "");
    setImage7(item.image7 || "");
    setImage8(item.image8 || "");
    setImage9(item.image9 || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這條新聞嗎？")) return;

    try {
      await deleteNews.mutateAsync({
        id,
        consoleAuth: CONSOLE_AUTH_TOKEN,
      });
      toast.success("新聞刪除成功");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate("");
    setContent("");
    setImage1("");
    setImage2("");
    setImage3("");
    setImage4("");
    setImage5("");
    setImage6("");
    setImage7("");
    setImage8("");
    setImage9("");
  };

  // Login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">新聞稿管理後台</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">用戶名</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="請輸入用戶名"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">密碼</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              登錄
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // Console page
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">新聞稿管理後台</h1>
          <Button onClick={handleLogout} variant="outline">
            退出登錄
          </Button>
        </div>

        {/* News Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "編輯新聞" : "發布新聞"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">日期</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                內容（最多300個字）
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="請輸入新聞內容"
                rows={4}
                maxLength={300}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/300 字
              </p>
            </div>

            {/* Image uploads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const imageUrl = 
                  num === 1 ? image1 :
                  num === 2 ? image2 :
                  num === 3 ? image3 :
                  num === 4 ? image4 :
                  num === 5 ? image5 :
                  num === 6 ? image6 :
                  num === 7 ? image7 :
                  num === 8 ? image8 :
                  image9;
                return (
                  <div key={num}>
                    <label className="block text-sm font-medium mb-2">
                      圖片 {num}（可選）
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, num as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
                      }}
                    />
                    {imageUrl && (
                      <div className="mt-2">
                        <img
                          src={imageUrl}
                          alt={`Preview ${num}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-1 w-full"
                          onClick={() => {
                            if (num === 1) setImage1("");
                            if (num === 2) setImage2("");
                            if (num === 3) setImage3("");
                            if (num === 4) setImage4("");
                            if (num === 5) setImage5("");
                            if (num === 6) setImage6("");
                            if (num === 7) setImage7("");
                            if (num === 8) setImage8("");
                            if (num === 9) setImage9("");
                          }}
                        >
                          移除
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "更新新聞" : "發布新聞"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  取消編輯
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* News List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">已發布新聞</h2>
          {newsList.length === 0 ? (
            <p className="text-gray-500">暫無新聞</p>
          ) : (
            <div className="space-y-4">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-700">
                      {new Date(item.date).toLocaleDateString("zh-CN")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        編輯
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        刪除
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{item.content}</p>
                  {(item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9) && (
                    <div className="flex gap-2 flex-wrap">
                      {[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6, item.image7, item.image8, item.image9].map((img, idx) => 
                        img && (
                          <img
                            key={idx}
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded"
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
      </div>
    </div>
  );
}
