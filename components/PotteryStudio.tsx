
import React, { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, PresentationControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { generatePotteryImage } from '../services/geminiService';

// Định nghĩa các biên dạng (profile) để xoay tròn tạo khối 3D (LatheGeometry)
const SHAPES = [
  { 
    id: 'tyba', 
    name: 'Bình Tỳ Bà', 
    points: [
      [0, -2], [1.2, -1.9], [2.2, -1.5], [2.8, 0], [2.2, 1.5], [0.8, 2.5], [0.5, 3.5], [1.2, 4]
    ],
    desc: 'Dáng bình thanh thoát di sản.'
  },
  { 
    id: 'thap', 
    name: 'Thạp Gốm Cổ', 
    points: [
      [0, -2], [2.5, -2], [2.8, -1.5], [2.8, 2], [3.2, 3], [3.5, 3.5]
    ],
    desc: 'Vẻ đẹp bệ vệ thời Trần - Lê.'
  },
  { 
    id: 'namruou', 
    name: 'Nậm Rượu', 
    points: [
      [0, -2], [2.5, -1.8], [2.8, -1], [1.5, 0.5], [0.8, 1.5], [0.8, 3.5], [1.5, 4]
    ],
    desc: 'Hình dáng bầu bĩnh dân gian.'
  },
  { 
    id: 'docbinh', 
    name: 'Lọ Độc Bình', 
    points: [
      [0, -2], [2, -2], [2.5, -1], [2, 1], [1, 2.5], [1, 3.5], [2, 4]
    ],
    desc: 'Dáng cao trưng bày gian thờ.'
  }
];

const GLAZES = [
  { id: 'xam', name: 'Gốm Xám Đá', color: '#d1d5db', emissive: '#000000', roughness: 0.5, metalness: 0.1, clearcoat: 0.1 },
  { id: 'hoabien', name: 'Men Hỏa Biến', color: '#1a3a3a', emissive: '#111', roughness: 0.1, metalness: 0.8, clearcoat: 1 },
  { id: 'ngoc', name: 'Men Ngọc', color: '#7fb3a1', emissive: '#1a2b25', roughness: 0.2, metalness: 0.1, clearcoat: 0.8 },
  { id: 'ran', name: 'Men Rạn Cổ', color: '#e5d3b3', emissive: '#222', roughness: 0.4, metalness: 0.0, clearcoat: 0.3 }
];

const PATTERNS = [
  { id: 'none', name: 'Mộc', icon: '◌' },
  { id: 'dragon', name: 'Rồng', icon: '🐉' },
  { id: 'lotus', name: 'Sen', icon: '🪷' }
];

// Component mô hình gốm 3D
const PotteryModel = ({ shape, glaze }: { shape: any, glaze: any }) => {
  const points = useMemo(() => {
    return shape.points.map((p: number[]) => new THREE.Vector2(p[0], p[1]));
  }, [shape]);

  return (
    <group position={[0, -0.5, 0]}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 64]} />
        <meshPhysicalMaterial 
          color={glaze.color}
          emissive={glaze.emissive}
          roughness={glaze.roughness}
          metalness={glaze.metalness}
          clearcoat={glaze.clearcoat}
          clearcoatRoughness={0.1}
          reflectivity={1}
        />
      </mesh>
    </group>
  );
};

const PotteryStudio: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedGlaze, setSelectedGlaze] = useState(GLAZES[0]);
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [isFiring, setIsFiring] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleFirePottery = async () => {
    setIsFiring(true);
    setAiResult(null);
    try {
      const prompt = `A museum-quality masterpiece photo of a traditional My Thien pottery ${selectedShape.name}. The piece features a ${selectedGlaze.name} finish and ${selectedPattern.id !== 'none' ? selectedPattern.name + ' motifs' : 'minimalist look'}. Studio lighting on white background, sharp focus, 8k resolution, authentic ceramic texture.`;
      const result = await generatePotteryImage(prompt, null);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      alert("Hệ thống nung gốm đang bận, vui lòng thử lại!");
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-7xl mx-auto">
      
      {/* 3D Visualizer Canvas - Pure White Aesthetic */}
      <div className="lg:w-2/3 bg-white rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[550px] md:min-h-[750px] shadow-2xl border border-zinc-100">
        
        {/* UI Badges Overlay */}
        <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
          <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-zinc-200 flex items-center gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 bg-zinc-300 rounded-full border border-zinc-400"></span>
            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Studio Mỹ Thiện 3D</span>
          </div>
          <div className="px-5 py-1 text-zinc-400 text-[9px] font-mono uppercase tracking-widest flex items-center gap-2">
            <span>Xoay tự do</span>
            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
            <span>Cuộn để phóng to</span>
          </div>
        </div>

        {/* The 3D Engine */}
        <div className="w-full h-full absolute inset-0">
          <Canvas shadows camera={{ position: [0, 2, 12], fov: 35 }}>
            <Suspense fallback={<Html center><div className="text-zinc-400 animate-pulse font-serif italic">Đang tải mô hình gốm...</div></Html>}>
              <color attach="background" args={['#ffffff']} />
              
              <PresentationControls 
                global 
                config={{ mass: 1, tension: 500 }} 
                snap={{ mass: 2, tension: 1500 }} 
                rotation={[0, 0, 0]} 
                polar={[-Math.PI / 4, Math.PI / 4]} 
                azimuth={[-Math.PI / 2, Math.PI / 2]}
              >
                <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
                  <PotteryModel shape={selectedShape} glaze={selectedGlaze} />
                </Float>
              </PresentationControls>

              {/* Realistic Contact Shadows */}
              <ContactShadows 
                position={[0, -2.5, 0]} 
                opacity={0.35} 
                scale={15} 
                blur={2.2} 
                far={4.5} 
                color="#27272a"
              />
              
              {/* Studio Light Setup */}
              <ambientLight intensity={1} />
              <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
              <pointLight position={[-10, 10, -5]} intensity={0.8} />
              <Environment preset="studio" />
              
              <OrbitControls enablePan={false} minDistance={6} maxDistance={15} makeDefault />
            </Suspense>
          </Canvas>
        </div>

        {/* AI Result Overlay */}
        {aiResult && (
          <div className="absolute inset-0 bg-white/98 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-40 animate-fade-in">
            <button 
              onClick={() => setAiResult(null)} 
              className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-900 transition-all hover:rotate-90 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center space-y-8 max-w-lg w-full">
              <div className="space-y-1">
                <span className="text-brand-clay font-mono text-[10px] tracking-[0.6em] uppercase">Kết quả nung gốm AI</span>
                <h4 className="text-2xl font-serif text-zinc-900">Tác phẩm Hoàn thiện</h4>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-zinc-100 rounded-[2.5rem] -z-10 group-hover:bg-zinc-200 transition-colors"></div>
                <img src={aiResult} className="w-full aspect-square rounded-[2rem] shadow-2xl border border-white object-cover" alt="AI Pottery" />
              </div>
              <p className="text-zinc-500 text-sm italic font-serif leading-relaxed px-8">"Sự kết hợp giữa hình dáng truyền thống Mỹ Thiện và men gốm {selectedGlaze.name}."</p>
            </div>
          </div>
        )}

        {isFiring && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center z-40">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-clay border-t-transparent rounded-full animate-spin"></div>
              <div className="text-4xl">🔥</div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-zinc-900 font-bold text-xl tracking-widest uppercase">Đang nung gốm</p>
              <p className="text-zinc-400 text-[10px] font-mono mt-2">Nhiệt độ lò đang lên: 1250°C...</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Station Panel */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-zinc-100 flex flex-col gap-10 h-full">
          
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">01. Hình dáng</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif">{selectedShape.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape)}
                  className={`py-5 px-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group relative ${selectedShape.id === shape.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-200'}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedShape.id === shape.id ? 'text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
                    {shape.id}
                  </span>
                  <span className="text-xs font-bold font-serif">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">02. Men Gốm</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif">{selectedGlaze.name}</span>
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              {GLAZES.map(glaze => (
                <button
                  key={glaze.id}
                  onClick={() => setSelectedGlaze(glaze)}
                  title={glaze.name}
                  className={`w-14 h-14 rounded-2xl border-4 transition-all relative ${selectedGlaze.id === glaze.id ? 'border-brand-clay scale-110 shadow-lg' : 'border-white hover:scale-105'}`}
                  style={{ backgroundColor: glaze.color }}
                >
                  {selectedGlaze.id === glaze.id && (
                    <div className="absolute -top-2 -right-2 bg-brand-clay text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-bold">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] border-b border-zinc-100 pb-4">03. Hoa văn</h3>
            <div className="grid grid-cols-3 gap-3">
              {PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPattern.id === pattern.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-50 hover:border-zinc-100'}`}
                >
                  <span className="text-2xl">{pattern.icon}</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFirePottery}
            disabled={isFiring}
            className="w-full mt-auto py-7 bg-zinc-900 text-white rounded-[2rem] font-black text-xs shadow-2xl hover:bg-zinc-800 hover:-translate-y-1 transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-300 flex items-center justify-center gap-5 group overflow-hidden relative"
          >
            <span className="relative z-10 tracking-[0.3em] uppercase">Bắt đầu nung gốm</span>
            <div className="absolute inset-0 bg-brand-clay translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-0"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PotteryStudio;
