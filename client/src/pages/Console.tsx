import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { compressImageToDataURL } from "@/lib/imageCompression";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Upload } from "lucide-react";

const CONSOLE_AUTH_TOKEN = "console_admin_session";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Cmf25617028%";

// Sortable Image Item Component
function SortableImageItem({ id, imageUrl, onRemove }: { id: string; imageUrl: string; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
    >
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-32 object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white rounded-full hover:bg-gray-100 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 bg-white rounded-full hover:bg-red-100"
        >
          <X className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default function Console() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // News form state
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  
  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: newsList = [], refetch } = trpc.news.getAll.useQuery();
  const createNews = trpc.news.create.useMutation();
  const updateNews = trpc.news.update.useMutation();
  const deleteNews = trpc.news.delete.useMutation();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Handle single image upload
  const handleImageUpload = async (file: File) => {
    if (images.length >= 9) {
      toast.error("最多只能上傳9張圖片");
      return;
    }

    try {
      const compressedDataURL = await compressImageToDataURL(file, 300);
      setImages([...images, compressedDataURL]);
      toast.success(`圖片上傳成功（已壓縮）`);
    } catch (error) {
      console.error("圖片上傳失敗：", error);
      toast.error("圖片上傳失敗");
    }
  };

  // Handle batch image upload
  const handleBatchUpload = async (files: FileList) => {
    const remainingSlots = 9 - images.length;
    if (files.length > remainingSlots) {
      toast.error(`最多還能上傳${remainingSlots}張圖片`);
      return;
    }

    const uploadPromises = Array.from(files).map(file => compressImageToDataURL(file, 300));
    
    try {
      const compressedImages = await Promise.all(uploadPromises);
      setImages([...images, ...compressedImages]);
      toast.success(`成功上傳${files.length}張圖片（已壓縮）`);
    } catch (error) {
      console.error("批量上傳失敗：", error);
      toast.error("批量上傳失敗");
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((_, idx) => `image-${idx}` === active.id);
        const newIndex = items.findIndex((_, idx) => `image-${idx}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
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

    // Prepare image data (fill empty slots with empty strings)
    const imageData = {
      image1: images[0] || "",
      image2: images[1] || "",
      image3: images[2] || "",
      image4: images[3] || "",
      image5: images[4] || "",
      image6: images[5] || "",
      image7: images[6] || "",
      image8: images[7] || "",
      image9: images[8] || "",
    };

    try {
      if (editingId) {
        await updateNews.mutateAsync({
          id: editingId,
          date,
          content,
          ...imageData,
          consoleAuth: CONSOLE_AUTH_TOKEN,
        });
        toast.success("新聞更新成功");
        setEditingId(null);
      } else {
        await createNews.mutateAsync({
          date,
          content,
          ...imageData,
          consoleAuth: CONSOLE_AUTH_TOKEN,
        });
        toast.success("新聞發布成功");
      }

      // Reset form
      setDate("");
      setContent("");
      setImages([]);
      refetch();
    } catch (error) {
      toast.error("操作失敗");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setDate(new Date(item.date).toISOString().split("T")[0]);
    setContent(item.content);
    
    // Load images from item
    const loadedImages = [
      item.image1,
      item.image2,
      item.image3,
      item.image4,
      item.image5,
      item.image6,
      item.image7,
      item.image8,
      item.image9,
    ].filter(Boolean);
    
    setImages(loadedImages);
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
    setImages([]);
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
  }

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

            {/* Image uploads with drag and drop */}
            <div>
              <label className="block text-sm font-medium mb-2">
                圖片（最多9張，支持拖拽排序）
              </label>
              
              {/* Batch upload button */}
              <div className="mb-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleBatchUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                  id="batch-upload"
                />
                <label htmlFor="batch-upload">
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <span className="flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="h-4 w-4" />
                      批量上傳圖片（{images.length}/9）
                    </span>
                  </Button>
                </label>
              </div>

              {/* Sortable images grid */}
              {images.length > 0 && (
                <div className="mb-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((_, idx) => `image-${idx}`)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                          <SortableImageItem
                            key={`image-${idx}`}
                            id={`image-${idx}`}
                            imageUrl={img}
                            onRemove={() => handleRemoveImage(idx)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Single image upload */}
              {images.length < 9 && (
                <div className="mt-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="single-upload"
                  />
                  <label htmlFor="single-upload">
                    <Button type="button" variant="ghost" className="w-full border-2 border-dashed" asChild>
                      <span className="flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="h-4 w-4" />
                        添加單張圖片
                      </span>
                    </Button>
                  </label>
                </div>
              )}
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
