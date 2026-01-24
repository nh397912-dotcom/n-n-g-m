
import React, { useState, useEffect } from 'react';
import { generatePotteryImage } from '../services/geminiService';

const SHAPES = [
  { id: 'chum', name: 'Chum Mỹ Thiện', path: 'M50,10 C20,10 10,40 10,60 C10,90 30,100 50,100 C70,100 90,90 90,60 C90,40 80,10 50,10 Z' },
  { id: 'binh', name: 'Bình Cao', path: 'M50,5 C35,5 30,20 30,35 C30,60 15,80 15,95 L85,95 C85,80 70,60 70,35 C70,20 65,5 50,5 Z' },
  { id: 'lo', name: 'Lọ Hoa', path: 'M50,15 C40,15 35,25 35,35 C35,50 20,60 20,90 L80,90 C80,60 65,50 65,35 C65,25 60,15 50,15 Z' }
];

const GLAZES = [
  { id: 'hoabien', name: 'Men Hỏa Biến', color: 'linear-gradient(135deg, #4a3728, #2d5a27, #1a3a3a)', desc: 'Biến ảo của lửa' },
  { id: 'ngoc', name: 'Men Ngọc', color: 'linear-gradient(135deg, #7fb3a1, #a8d5ba)', desc: 'Trong như ngọc' },
  { id: 'moc', name: 'Gốm Mộc', color: 'linear-gradient(135deg, #a67c52, #8b5a2b)', desc: 'Đất nguyên bản' }
];

const PATTERNS = [
  { id: 'none', name: 'Trơn', icon: '⚪' },
  { id: 'dragon', name: 'Đắp Rồng', icon: '🐉' },
  { id: 'lotus', name: 'Hoa Sen', icon: '🪷' },
  { id: 'waves', name: 'Sóng Nước', icon: '🌊' }
];

const PotteryStudio: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedGlaze, setSelectedGlaze] = useState(GLAZES[0]);
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [isFiring, setIsFiring] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    if (isRotating && !isFiring) {
      interval = window.setInterval(() => {
        setRotation(prev => (prev + 0.8) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isRotating, isFiring]);

  const handleFirePottery = async () => {
    setIsFiring(true);
    setAiResult(null);
    try {
      const prompt = `A professional photorealistic studio shot of a traditional Vietnamese My Thien pottery ${selectedShape.name} with ${selectedGlaze.name} glaze and ${selectedPattern.name} decorative elements. Soft lighting, 8k resolution, authentic texture.`;
      const result = await generatePotteryImage(prompt, null);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      alert("Xưởng gốm bận, vui lòng thử lại!");
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      
      {/* 3D Visualization Area */}
      <div className="lg:w-3/5 bg-white rounded-3xl border-2 border-brand-sand shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-12 min-h-[500px] md:min-h-[600px]">
        <div className="absolute top-8 left-8 z-10">
          <div className="bg-brand-clay/10 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-clay animate-ping rounded-full"></span>
            <span className="text-xs font-bold text-brand-clay uppercase tracking-widest">Đang xem 360°</span>
          </div>
        </div>

        {/* The Model */}
        <div 
          className="relative w-72 h-96 transition-all duration-300 cursor-grab active:cursor-grabbing"
          style={{ 
            transform: `perspective(1200px) rotateY(${rotation}deg)`,
            filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.15))'
          }}
          onMouseEnter={() => setIsRotating(false)}
          onMouseLeave={() => setIsRotating(true)}
        >
          <svg viewBox="0 0 100 110" className="w-full h-full">
            <defs>
              <linearGradient id="pot-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
                <stop offset="30%" stopColor="transparent" stopOpacity="0" />
                <stop offset="70%" stopColor="transparent" stopOpacity="0" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path 
              d={selectedShape.path} 
              fill={selectedGlaze.id === 'moc' ? '#a67c52' : selectedGlaze.id === 'ngoc' ? '#7fb3a1' : '#2d3e3a'}
              className="transition-all duration-700 ease-in-out"
            />
            <path d={selectedShape.path} fill="url(#pot-shadow)" />
            {selectedPattern.id !== 'none' && (
              <text x="50" y="65" textAnchor="middle" fontSize="14" fill="white" fillOpacity="0.3" className="select-none pointer-events-none">
                {selectedPattern.icon}
              </text>
            )}
          </svg>
        </div>

        {/* Podium */}
        <div className="w-56 h-6 bg-brand-sand/50 rounded-[100%] blur-[2px] mt-2"></div>
        <div className="w-72 h-3 bg-brand-dark/5 rounded-[100%] blur-md -mt-1"></div>

        {/* AI Result View */}
        {aiResult && (
          <div className="absolute inset-0 bg-brand-dark/95 flex flex-col items-center justify-center p-10 z-30 animate-fade-in">
            <button 
              onClick={() => setAiResult(null)} 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-brand-clay font-bold tracking-[0.4em] uppercase text-[10px] mb-4">Sản phẩm hoàn thiện</span>
            <img src={aiResult} className="max-h-[75%] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10" alt="AI Pottery" />
            <p className="text-brand-sand mt-6 text-center text-sm font-serif italic">"Tác phẩm mang linh hồn đất Mỹ Thiện được nung từ trí tuệ nhân tạo"</p>
          </div>
        )}

        {isFiring && (
          <div className="absolute inset-0 bg-brand-terracotta/60 backdrop-blur-md flex flex-col items-center justify-center z-30">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🔥</div>
            </div>
            <p className="text-white font-bold text-xl mt-6 tracking-widest uppercase">Đang nung trong lò bầu...</p>
          </div>
        )}
      </div>

      {/* Customization Panel */}
      <div className="lg:w-2/5 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-sand flex-1">
          <div className="space-y-8">
            
            {/* Shape Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full"></span>
                1. Hình Dáng Gốm
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {SHAPES.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${selectedShape.id === shape.id ? 'border-brand-clay bg-brand-clay/5' : 'border-gray-50 hover:border-brand-sand hover:bg-gray-50'}`}
                  >
                    <svg viewBox="0 0 100 110" className="w-12 h-12 transition-transform group-hover:scale-110">
                      <path d={shape.path} fill={selectedShape.id === shape.id ? '#A8763E' : '#ddd'} />
                    </svg>
                    <span className="text-[10px] font-bold text-brand-dark uppercase">{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Glaze Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full"></span>
                2. Men Gốm Đặc Trưng
              </h3>
              <div className="space-y-2">
                {GLAZES.map(glaze => (
                  <button
                    key={glaze.id}
                    onClick={() => setSelectedGlaze(glaze)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedGlaze.id === glaze.id ? 'border-brand-clay bg-brand-clay/5' : 'border-gray-50 hover:border-brand-sand'}`}
                  >
                    <div className="w-12 h-12 rounded-xl shadow-inner" style={{ background: glaze.color }}></div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-bold text-brand-dark">{glaze.name}</div>
                      <div className="text-[10px] text-gray-500 font-medium">{glaze.desc}</div>
                    </div>
                    {selectedGlaze.id === glaze.id && <span className="text-brand-clay">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full"></span>
                3. Hoa Văn Trang Trí
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PATTERNS.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedPattern.id === pattern.id ? 'border-brand-clay bg-brand-clay/5' : 'border-gray-50 hover:border-brand-sand'}`}
                  >
                    <span className="text-2xl">{pattern.icon}</span>
                    <span className="text-xs font-bold text-brand-dark">{pattern.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleFirePottery}
          disabled={isFiring}
          className="group w-full py-6 bg-brand-terracotta text-white rounded-3xl font-bold text-lg shadow-[0_15px_30px_rgba(139,69,19,0.3)] hover:bg-brand-clay hover:-translate-y-1 transition-all active:scale-95 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-4"
        >
          <span className="tracking-widest uppercase">🔥 Nung gốm nghệ thuật</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PotteryStudio;
