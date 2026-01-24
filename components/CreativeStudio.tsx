
import React, { useState, useRef } from 'react';
import { generatePotteryImage } from '../services/geminiService';

const CreativeStudio: React.FC = () => {
  const [shape, setShape] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [pattern, setPattern] = useState<string>('');
  const [adjustmentPrompt, setAdjustmentPrompt] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<{ data: string; mimeType: string; } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          setReferenceImage({ data: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Vui lòng chọn tệp hình ảnh (JPEG hoặc PNG).');
      setReferenceImage(null);
    }
  };

  const handleGenerate = async () => {
    const combinedPrompt = [
        shape.trim() ? `có hình dáng ${shape.trim()}` : '',
        color.trim() ? `màu sắc ${color.trim()}` : '',
        pattern.trim() ? `với hoa văn ${pattern.trim()}` : '',
    ].filter(Boolean).join(', ');

    if (!combinedPrompt && !referenceImage) {
      setError('Vui lòng nhập mô tả hoặc tải lên hình ảnh mẫu.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generatePotteryImage(combinedPrompt, referenceImage);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      setError('Đã có lỗi xảy ra trong quá trình tạo ảnh. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdjust = async () => {
    if (!adjustmentPrompt.trim()) {
        setError('Vui lòng nhập mô tả để điều chỉnh hình ảnh.');
        return;
    }
    if (!generatedImageUrl) {
        setError('Không có hình ảnh nào để điều chỉnh.');
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        const imageParts = generatedImageUrl.split(';base64,');
        const mimeType = imageParts[0].split(':')[1];
        const base64Data = imageParts[1];
        
        const currentImage = { data: base64Data, mimeType };

        const imageUrl = await generatePotteryImage(adjustmentPrompt, currentImage, true);
        setGeneratedImageUrl(imageUrl);
        setAdjustmentPrompt(''); // Clear prompt after successful adjustment
    } catch (err) {
        setError('Đã có lỗi xảy ra trong quá trình điều chỉnh ảnh. Vui lòng thử lại.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const mimeType = generatedImageUrl.split(';')[0].split(':')[1];
    const extension = mimeType ? mimeType.split('/')[1] : 'png';
    link.download = `san-pham-gom-ai.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg className="animate-spin h-10 w-10 text-brand-clay" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-brand-dark">AI đang nặn gốm, vui lòng chờ...</p>
    </div>
  );

  const Placeholder = () => (
    <div className="text-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="mt-2">Hình ảnh sản phẩm của bạn sẽ hiện ở đây</p>
    </div>
  );

  return (
    <section id="sang-tao" className="bg-white rounded-lg shadow-lg p-6 md:p-8 scroll-mt-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">Xưởng Sáng Tạo AI</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Hãy dùng trí tưởng tượng của bạn để mô tả một sản phẩm gốm độc đáo. AI của chúng tôi sẽ biến ý tưởng của bạn thành hình ảnh.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Input Controls */}
        <div className="lg:w-1/2 flex flex-col">
            <p className="mb-3 font-semibold text-brand-dark font-sans">Mô tả sản phẩm gốm trong mơ của bạn:</p>
            <div className="space-y-4 flex-grow">
                <div>
                    <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">Hình dáng</label>
                    <textarea
                        id="shape"
                        value={shape}
                        onChange={(e) => setShape(e.target.value)}
                        placeholder="Càng chi tiết càng tốt"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-clay focus:border-brand-clay transition-shadow duration-200 resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                </div>
                 <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                    <input
                        type="text"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Ví dụ: xanh coban, men rạn màu be..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-clay focus:border-brand-clay transition-shadow duration-200"
                        disabled={isLoading}
                    />
                </div>
                 <div>
                    <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-1">Hoa văn</label>
                    <textarea
                        id="pattern"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="Càng chi tiết càng tốt"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-clay focus:border-brand-clay transition-shadow duration-200 resize-none"
                        rows={2}
                        disabled={isLoading}
                    />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tải hình mẫu (tùy chọn)</label>
                  {referenceImage ? (
                    <div className="relative group">
                      <img 
                        src={`data:${referenceImage.mimeType};base64,${referenceImage.data}`} 
                        alt="Reference preview" 
                        className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50 p-1"
                      />
                      <button
                        onClick={() => {
                          setReferenceImage(null);
                          if(fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-brand-clay"
                    >
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <p className="pl-1">Nhấn để tải lên</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
            </div>

          
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-4 w-full bg-brand-clay hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
                </>
            ) : "Tạo sản phẩm"}
          </button>
        </div>

        {/* Image Display */}
        <div className="lg:w-1/2 flex items-center justify-center bg-gray-100 rounded-lg min-h-[300px] p-4 border-2 border-dashed border-gray-300">
          {isLoading ? (
            <LoadingSpinner />
          ) : generatedImageUrl ? (
            <div className="flex flex-col items-center w-full">
              <img src={generatedImageUrl} alt="Generated pottery" className="max-w-full max-h-[400px] object-contain rounded-md" />
              <button
                onClick={handleDownload}
                className="mt-4 bg-brand-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải ảnh về
              </button>
              
              {/* Adjustment UI */}
              <div className="w-full mt-6 border-t pt-4">
                  <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700 mb-1">Mô tả điều chỉnh</label>
                  <textarea
                    id="adjustment"
                    value={adjustmentPrompt}
                    onChange={(e) => setAdjustmentPrompt(e.target.value)}
                    placeholder="Ví dụ: thêm hoa văn con công, đổi sang màu xanh ngọc..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-clay focus:border-brand-clay transition-shadow duration-200 resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleAdjust}
                    disabled={isLoading}
                    className="mt-2 w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Điều chỉnh
                  </button>
              </div>

            </div>
          ) : (
            <Placeholder />
          )}
        </div>
      </div>
      {error && 
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
        </div>
      }
    </section>
  );
};

export default CreativeStudio;