
import React, { useState, useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Center, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { generatePotteryImage } from '../services/geminiService';

// Danh sách biên dạng với độ chi tiết cao và đường cong mềm mại
const SHAPES = [
  { 
    id: 'tyba', 
    name: 'Bình Tỳ Bà', 
    points: [
      [0, 0], [0.7, 0.02], [1.1, 0.15], [1.5, 0.6], [1.7, 1.2], [1.6, 2.0], [1.3, 2.6], [0.8, 3.1], [0.4, 3.6], [0.35, 4.2], [0.45, 4.6], [0.6, 4.7]
    ],
    desc: 'Đường cong uyển chuyển như phím đàn.'
  },
  { 
    id: 'camlo', 
    name: 'Bình Cam Lộ', 
    points: [
      [0, 0], [1.2, 0.1], [1.6, 0.8], [1.5, 1.6], [1.1, 2.3], [0.4, 2.8], [0.3, 3.8], [0.3, 4.8], [0.6, 5.0], [0.7, 5.1]
    ],
    desc: 'Dáng bình thanh tịnh, mềm mại tuyệt đối.'
  },
  { 
    id: 'thap', 
    name: 'Thạp Gốm Cổ', 
    points: [
      // Mặt ngoài đi lên
      [0, 0], [1.6, 0.05], [2.2, 0.8], [2.5, 2.0], [2.3, 3.5], [1.8, 4.2], [2.2, 4.6], 
      // Vành miệng
      [2.1, 4.6],
      // Mặt trong đi xuống tạo lòng thạp rỗng
      [1.7, 4.2], [2.1, 3.5], [2.3, 2.0], [2.0, 0.8], [1.4, 0.2], [0, 0.2]
    ],
    desc: 'Dáng thạp uy nghi với lòng gốm rộng, thành thạp dày dặn thực tế.'
  },
  { 
    id: 'namruou', 
    name: 'Nậm Rượu', 
    points: [
      // Mặt ngoài đi lên
      [0, 0], [1.2, 0.05], [1.7, 1.0], [1.4, 2.0], [0.6, 2.8], [0.4, 3.8], [0.8, 4.5], 
      // Miệng bình
      [0.7, 4.5],
      // Mặt trong đi xuống tạo lòng bầu rượu
      [0.3, 3.8], [0.5, 2.8], [1.2, 2.0], [1.5, 1.0], [1.0, 0.15], [0, 0.15]
    ],
    desc: 'Bầu rượu rỗng bên trong, cổ thắt nhỏ, miệng loe mềm mại.'
  },
  { 
    id: 'giotnuoc', 
    name: 'Bình Giọt Nước', 
    points: [
      [0, 0], [1.8, 0.5], [2.0, 1.5], [1.5, 2.8], [0.8, 3.8], [0.3, 4.5], [0.25, 4.7]
    ],
    desc: 'Tối giản và tinh tế.'
  },
  { 
    id: 'batgom', 
    name: 'Bát Sen Cổ', 
    points: [
      // Mặt ngoài đi lên
      [0, 0], [0.8, 0.05], [1.6, 0.4], [2.4, 1.0], [2.8, 1.8], [3.0, 2.2], 
      // Vành miệng (Rim)
      [2.95, 2.22], 
      // Mặt trong đi xuống tạo độ lõm sâu
      [2.7, 1.8], [2.2, 1.1], [1.4, 0.6], [0.7, 0.35], [0, 0.3]
    ],
    desc: 'Lòng bát sâu, thành bát mỏng dần lên miệng, tạo độ lõm chân thực.'
  }
];

const GLAZES = [
  { id: 'hoabien', name: 'Men Hỏa Biến', color: '#1a3a3a', emissive: '#050a0a', roughness: 0.1, metalness: 0.4, clearcoat: 1.0 },
  { id: 'ngoc', name: 'Men Ngọc', color: '#7fb3a1', emissive: '#0a1411', roughness: 0.2, metalness: 0.1, clearcoat: 0.8 },
  { id: 'ran', name: 'Men Rạn Cổ', color: '#e5d3b3', emissive: '#111', roughness: 0.3, metalness: 0.0, clearcoat: 0.4 },
  { id: 'datnung', name: 'Đất Nung Mộc', color: '#a8763e', emissive: '#2a1808', roughness: 0.7, metalness: 0.0, clearcoat: 0.0 }
];

const PATTERNS = [
  { id: 'none', name: 'Mộc', icon: '◌' },
  { id: 'dragon', name: 'Rồng', icon: '🐉' },
  { id: 'lotus', name: 'Sen', icon: '🪷' }
];

// Component mô hình gốm siêu mịn
const PotteryModel = ({ shape, glaze }: { shape: any, glaze: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const points = useMemo(() => {
    // Sử dụng SplineCurve để làm mượt tuyệt đối các điểm tọa độ
    const rawPoints = shape.points.map((p: number[]) => new THREE.Vector2(p[0], p[1]));
    const curve = new THREE.SplineCurve(rawPoints);
    // Lấy 100 điểm dọc theo đường cong để tạo biên dạng mượt mà nhất có thể
    return curve.getPoints(100);
  }, [shape]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.computeVertexNormals();
    }
  }, [shape]);

  return (
    // @ts-ignore
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* @ts-ignore */}
      <latheGeometry args={[points, 256]} />
      {/* @ts-ignore */}
      <meshPhysicalMaterial 
        color={glaze.color}
        emissive={glaze.emissive}
        roughness={glaze.roughness}
        metalness={glaze.metalness}
        clearcoat={glaze.clearcoat}
        clearcoatRoughness={0.1}
        reflectivity={0.5}
        sheen={1}
        sheenRoughness={0.5}
        sheenColor={glaze.color}
        side={THREE.DoubleSide} 
      />
    </mesh>
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
      const prompt = `A professional studio photograph of a traditional My Thien pottery ${selectedShape.name}. Luxurious ${selectedGlaze.name} finish, ${selectedPattern.id !== 'none' ? selectedPattern.name + ' decorations' : 'clean design'}. Soft bokeh background, 8k resolution, elegant lighting, authentic Vietnamese ceramic.`;
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
    <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-7xl mx-auto px-4 md:px-0">
      
      {/* 3D Visualizer Canvas */}
      <div className="lg:w-2/3 bg-white rounded-[3rem] relative overflow-hidden flex flex-col min-h-[500px] md:min-h-[750px] shadow-2xl border border-zinc-100">
        
        {/* Header labels moved to top-center to avoid obscuring the model */}
        <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center gap-2 px-8 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-zinc-200 flex items-center gap-3 shadow-sm pointer-events-auto">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Mỹ Thiện High-Fidelity</span>
          </div>
          <div className="bg-zinc-900/5 backdrop-blur-[2px] px-4 py-1.5 rounded-full text-zinc-400 text-[9px] font-mono uppercase tracking-widest pointer-events-auto">
            {['batgom', 'thap', 'namruou'].includes(selectedShape.id) ? 'Hollow-Core Realistic Model' : '256 Segments • High Definition'}
          </div>
        </div>

        <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
          <Canvas 
            shadows 
            camera={{ position: [0, 5, 16], fov: 30, near: 0.1, far: 1000 }}
            gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
          >
            <Suspense fallback={<Html center><div className="text-zinc-400 animate-pulse font-serif italic text-lg">Đang chuốt gốm mượt mà...</div></Html>}>
              {/* @ts-ignore */}
              <color attach="background" args={['#ffffff']} />
              
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <Center top key={selectedShape.id}>
                  <PotteryModel shape={selectedShape} glaze={selectedGlaze} />
                </Center>
              </Float>

              <ContactShadows 
                position={[0, -0.01, 0]} 
                opacity={0.25} 
                scale={15} 
                blur={2.5} 
                far={10} 
                color="#000000"
              />
              
              {/* @ts-ignore */}
              <ambientLight intensity={0.9} />
              {/* @ts-ignore */}
              <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={3} castShadow />
              {/* @ts-ignore */}
              <directionalLight position={[-10, 10, 5]} intensity={1} color="#ffffff" />
              <Environment preset="studio" />
              
              <OrbitControls 
                enablePan={false} 
                minDistance={8} 
                maxDistance={25} 
                makeDefault 
                autoRotate={!isFiring && !aiResult}
                autoRotateSpeed={0.4}
                target={[0, 1.2, 0]}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Result Overlay */}
        {aiResult && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-40 animate-fade-in">
            <button 
              onClick={() => setAiResult(null)} 
              className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-900 transition-all p-3 hover:rotate-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center space-y-8 max-w-lg w-full">
              <span className="text-brand-clay font-mono text-[11px] tracking-[0.6em] uppercase block">Kết quả nung gốm AI</span>
              <div className="relative p-2 bg-zinc-50 rounded-[3rem] shadow-2xl border border-zinc-100 group">
                <img src={aiResult} className="w-full aspect-square rounded-[2.8rem] object-cover shadow-sm transition-transform duration-700 group-hover:scale-[1.02]" alt="AI Pottery Result" />
              </div>
              <div>
                <h4 className="text-3xl font-serif text-zinc-900">{selectedShape.name}</h4>
                <p className="text-zinc-400 text-sm mt-2 italic font-serif">Một kiệt tác từ đất linh hồn Quảng Ngãi.</p>
              </div>
            </div>
          </div>
        )}

        {isFiring && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center z-40">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-[4px] border-zinc-100 rounded-full"></div>
              <div className="absolute inset-0 border-[4px] border-brand-clay border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">🏺</div>
            </div>
            <p className="mt-10 text-zinc-900 font-black text-sm tracking-[0.5em] uppercase">Đang nung nhiệt độ cao</p>
          </div>
        )}
      </div>

      {/* Control Station */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-100 flex flex-col gap-10 h-full overflow-y-auto custom-scrollbar">
          
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">01. Hình dáng mềm mại</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif italic">{selectedShape.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {SHAPES.map(shape => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape)}
                  className={`py-5 px-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedShape.id === shape.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl translate-y-[-2px]' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-200'}`}
                >
                  <span className="text-[9px] font-black uppercase opacity-40 tracking-tighter">{shape.id}</span>
                  <span className="text-xs font-bold font-serif">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">02. Sắc thái Men</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif">{selectedGlaze.name}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {GLAZES.map(glaze => (
                <button
                  key={glaze.id}
                  onClick={() => setSelectedGlaze(glaze)}
                  className={`w-14 h-14 rounded-full border-4 transition-all relative group ${selectedGlaze.id === glaze.id ? 'border-brand-clay scale-110 shadow-lg' : 'border-white hover:scale-110 shadow-sm'}`}
                  style={{ backgroundColor: glaze.color }}
                >
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap bg-zinc-900 text-white px-2 py-1 rounded transition-opacity">
                    {glaze.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em] border-b border-zinc-100 pb-4">03. Hoa văn di sản</h3>
            <div className="grid grid-cols-3 gap-3">
              {PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPattern.id === pattern.id ? 'border-zinc-900 bg-zinc-50 shadow-md' : 'border-zinc-50 hover:border-zinc-100'}`}
                >
                  <span className="text-2xl">{pattern.icon}</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFirePottery}
            disabled={isFiring}
            className="w-full mt-auto py-7 bg-zinc-900 text-white rounded-[2rem] font-black text-xs shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-300 flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <span className="relative z-10 tracking-[0.5em] uppercase">Hoàn thiện Tuyệt tác</span>
            <div className="absolute inset-0 bg-brand-clay translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-0"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PotteryStudio;
