import imageCompression from 'browser-image-compression';

/**
 * 压缩图片文件到指定大小以下
 * @param file 原始图片文件
 * @param maxSizeKB 最大文件大小（KB），默认300KB
 * @returns 压缩后的文件
 */
export async function compressImage(file: File, maxSizeKB: number = 300): Promise<File> {
  // 检查文件大小，如果小于等于目标大小，直接返回
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB <= maxSizeKB) {
    console.log(`[ImageCompression] 文件大小 ${fileSizeKB.toFixed(2)}KB，无需压缩`);
    return file;
  }

  console.log(`[ImageCompression] 开始压缩图片：${file.name}，原始大小：${fileSizeKB.toFixed(2)}KB`);

  const options = {
    maxSizeMB: maxSizeKB / 1024, // 转换为MB
    maxWidthOrHeight: 1920, // 最大宽度或高度
    useWebWorker: true, // 使用Web Worker提升性能
    fileType: file.type, // 保持原始文件类型
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const compressedSizeKB = compressedFile.size / 1024;
    
    console.log(`[ImageCompression] 压缩完成：${compressedSizeKB.toFixed(2)}KB（压缩率：${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%）`);
    
    return compressedFile;
  } catch (error) {
    console.error('[ImageCompression] 压缩失败：', error);
    // 压缩失败时返回原文件
    return file;
  }
}

/**
 * 将文件转换为Base64 Data URL
 * @param file 图片文件
 * @returns Base64 Data URL字符串
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片并转换为Base64 Data URL
 * @param file 原始图片文件
 * @param maxSizeKB 最大文件大小（KB），默认300KB
 * @returns Base64 Data URL字符串
 */
export async function compressImageToDataURL(file: File, maxSizeKB: number = 300): Promise<string> {
  const compressedFile = await compressImage(file, maxSizeKB);
  return fileToDataURL(compressedFile);
}
