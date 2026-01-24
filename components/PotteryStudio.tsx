
import React, { useState, useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Center, Html, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// SVGs cho hoa văn di sản (Sử dụng {{COLOR}} làm placeholder để thay thế động)
const PATTERN_ASSETS = {
  dragon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 50C142.2 50 50 142.2 50 256s92.2 206 206 206 206-92.2 206-206S369.8 50 256 50zm0 372c-91.7 0-166-74.3-166-166S164.3 90 256 90s166 74.3 166 166-74.3 166-166 166z" fill="{{COLOR}}" opacity="0.3"/><path d="M256 120c-75.1 0-136 60.9-136 136s60.9 136 136 136 136-60.9 136-136-60.9-136-136-136zm0 232c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z" fill="{{COLOR}}"/><path d="M256 180c-41.9 0-76 34.1-76 76s34.1 76 76 76 76-34.1 76-76-34.1-76-76-76z" fill="{{COLOR}}" opacity="0.8"/></svg>`,
  lotus: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 100c-20 0-40 40-40 80s20 80 40 80 40-40 40-80-20-80-40-80zM180 140c-15 0-30 45-30 90s15 90 30 90 30-45 30-90-15-90-30-90zM332 140c15 0 30 45 30 90s-15 90-30 90-30-45-30-90 15-90 30-90zM120 220c-10 0-20 50-20 100s10 100 20 100 20-50 20-100-10-100-20-100zM392 220c10 0 20 50 20 100s-10 100-20 100-20-50-20-100 10-100 20-100z" fill="{{COLOR}}"/></svg>`,
  phoenix: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 50c-20 80-80 100-80 150s40 100 80 100 80-50 80-100-60-70-80-150z" fill="{{COLOR}}"/><path d="M100 256c50 0 80-30 100-80s-20-100-50-100-100 80-50 180zM412 256c-50 0-80-30-100-80s20-100 50-100 100 80 50 180z" fill="{{COLOR}}" opacity="0.8"/></svg>`,
  waves: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M0 256c50-50 100-50 150 0s100 50 150 0 100-50 150 0v256H0V256zM0 156c50-50 100-50 150 0s100 50 150 0 100-50 150 0v100H0V156z" fill="{{COLOR}}" opacity="0.6"/></svg>`,
  crane: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 100l-50 150h100L256 100zM156 300l100 50 100-50-100-20-100 20z" fill="{{COLOR}}"/><circle cx="256" cy="180" r="30" fill="{{COLOR}}" opacity="0.8"/></svg>`
};

const SHAPES = [
  { id: 'tyba', name: 'Bình Tỳ Bà', points: [[0, 0], [0.7, 0.02], [1.1, 0.15], [1.5, 0.6], [1.7, 1.2], [1.6, 2.0], [1.3, 2.6], [0.8, 3.1], [0.4, 3.6], [0.35, 4.2], [0.45, 4.6], [0.6, 4.7]] },
  { id: 'camlo', name: 'Bình Cam Lộ', points: [[0, 0], [1.2, 0.1], [1.6, 0.8], [1.5, 1.6], [1.1, 2.3], [0.4, 2.8], [0.3, 3.8], [0.3, 4.8], [0.6, 5.0], [0.7, 5.1]] },
  { id: 'thap', name: 'Thạp Gốm Cổ', points: [[0, 0], [1.6, 0.05], [2.2, 0.8], [2.5, 2.0], [2.3, 3.5], [1.8, 4.2], [2.2, 4.6], [2.1, 4.6], [1.7, 4.2], [2.1, 3.5], [2.3, 2.0], [2.0, 0.8], [1.4, 0.2], [0, 0.2]] },
  { id: 'namruou', name: 'Nậm Rượu', points: [[0, 0], [1.2, 0.05], [1.7, 1.0], [1.4, 2.0], [0.6, 2.8], [0.4, 3.8], [0.8, 4.5], [0.7, 4.5], [0.3, 3.8], [0.5, 2.8], [1.2, 2.0], [1.5, 1.0], [1.0, 0.15], [0, 0.15]] },
  { id: 'giotnuoc', name: 'Bình Giọt Nước', points: [[0, 0], [1.8, 0.5], [2.0, 1.5], [1.5, 2.8], [0.8, 3.8], [0.3, 4.5], [0.25, 4.7]] },
  { id: 'batgom', name: 'Bát Sen Cổ', points: [[0, 0], [0.8, 0.05], [1.6, 0.4], [2.4, 1.0], [2.8, 1.8], [3.0, 2.2], [2.95, 2.22], [2.7, 1.8], [2.2, 1.1], [1.4, 0.6], [0.7, 0.35], [0, 0.3]] }
];

const GLAZES = [
  { id: 'ngoc', name: 'Men Ngọc', color: '#b2d8d0', emissive: '#0a1411', roughness: 0.2, metalness: 0.1, clearcoat: 0.8 },
  { id: 'trangnga', name: 'Men Trắng Ngà', color: '#fcfaf2', emissive: '#111', roughness: 0.3, metalness: 0.0, clearcoat: 0.6 },
  { id: 'vangtram', name: 'Men Vàng Tràm', color: '#d4af37', emissive: '#1a0d00', roughness: 0.25, metalness: 0.1, clearcoat: 0.7 },
  { id: 'chusa', name: 'Men Chu Sa', color: '#a52a2a', emissive: '#2a0000', roughness: 0.2, metalness: 0.1, clearcoat: 0.9 },
  { id: 'ran', name: 'Men Rạn Cổ', color: '#e8d5b5', emissive: '#111', roughness: 0.3, metalness: 0.0, clearcoat: 0.4 },
  { id: 'thanhlam', name: 'Men Thanh Lam', color: '#afeeee', emissive: '#0a1a1a', roughness: 0.1, metalness: 0.1, clearcoat: 0.9 },
  { id: 'tro', name: 'Men Tro', color: '#d3d3d3', emissive: '#050505', roughness: 0.4, metalness: 0.0, clearcoat: 0.3 },
  { id: 'hophach', name: 'Men Hổ Phách', color: '#ffbf00', emissive: '#2a1800', roughness: 0.15, metalness: 0.3, clearcoat: 1.0 },
  { id: 'datnung', name: 'Đất Nung Mộc', color: '#a8763e', emissive: '#2a1808', roughness: 0.7, metalness: 0.0, clearcoat: 0.0 }
];

const PATTERNS = [
  { id: 'none', name: 'Mộc (Trơn)', icon: '◌', textureBase: null, defaultColor: '#000000' },
  { id: 'dragon', name: 'Rồng Thần', icon: '🐉', textureBase: PATTERN_ASSETS.dragon, defaultColor: '#22c55e' },
  { id: 'lotus', name: 'Liên Hoa', icon: '🪷', textureBase: PATTERN_ASSETS.lotus, defaultColor: '#ec4899' },
  { id: 'phoenix', name: 'Phượng Hoàng', icon: '🕊️', textureBase: PATTERN_ASSETS.phoenix, defaultColor: '#f59e0b' },
  { id: 'waves', name: 'Sóng Nước', icon: '🌊', textureBase: PATTERN_ASSETS.waves, defaultColor: '#3b82f6' },
  { id: 'crane', name: 'Hạc Linh', icon: 'Swan', textureBase: PATTERN_ASSETS.crane, defaultColor: '#ef4444' }
];

const PATTERN_COLORS = [
  { id: 'gold', name: 'Vàng Kim', color: '#ffd700' },
  { id: 'red', name: 'Đỏ Son', color: '#ff0000' },
  { id: 'emerald', name: 'Xanh Ngọc', color: '#008080' },
  { id: 'pink', name: 'Hồng Phấn', color: '#ffc0cb' },
  { id: 'cobalt', name: 'Xanh Lam', color: '#0047ab' },
  { id: 'white', name: 'Trắng Tuyết', color: '#ffffff' },
  { id: 'black', name: 'Đen Mun', color: '#000000' },
  { id: 'bronze', name: 'Đồng Cổ', color: '#cd7f32' }
];

const PotteryModel = ({ shape, glaze, pattern, patternColor }: { shape: any, glaze: any, pattern: any, patternColor: string }) => {
  const textureUrl = useMemo(() => {
    if (!pattern.textureBase) return null;
    const encodedColor = patternColor.replace('#', '%23');
    return pattern.textureBase.replace(/{{COLOR}}/g, encodedColor);
  }, [pattern, patternColor]);

  const patternTexture = textureUrl ? useTexture(textureUrl) : null;
  
  if (patternTexture) {
    patternTexture.wrapS = patternTexture.wrapT = THREE.RepeatWrapping;
    patternTexture.repeat.set(4, 2);
    patternTexture.anisotropy = 16;
  }

  const points = useMemo(() => {
    const rawPoints = shape.points.map((p: number[]) => new THREE.Vector2(p[0], p[1]));
    const curve = new THREE.SplineCurve(rawPoints);
    return curve.getPoints(64);
  }, [shape]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        {/* @ts-ignore */}
        <latheGeometry args={[points, 128]} />
        {/* @ts-ignore */}
        <meshPhysicalMaterial 
          color={glaze.color}
          emissive={glaze.emissive}
          roughness={glaze.roughness}
          metalness={glaze.metalness}
          clearcoat={glaze.clearcoat}
          clearcoatRoughness={0.1}
          reflectivity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {patternTexture && (
        <mesh scale={[1.002, 1.002, 1.002]}>
          {/* @ts-ignore */}
          <latheGeometry args={[points, 128]} />
          {/* @ts-ignore */}
          <meshPhysicalMaterial 
            transparent={true}
            map={patternTexture}
            bumpMap={patternTexture}
            bumpScale={0.02}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            alphaTest={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

const PotteryStudio: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedGlaze, setSelectedGlaze] = useState(GLAZES[0]);
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [selectedPatternColor, setSelectedPatternColor] = useState(PATTERNS[0].defaultColor);

  useEffect(() => {
    if (selectedPattern.id !== 'none' && !selectedPatternColor) {
        setSelectedPatternColor(selectedPattern.defaultColor);
    }
  }, [selectedPattern]);

  // Lắng nghe yêu cầu cập nhật từ Chatbot AI
  useEffect(() => {
    const handleApplyConfig = (e: any) => {
      const config = e.detail;
      if (config.shapeId) {
        const shape = SHAPES.find(s => s.id === config.shapeId);
        if (shape) setSelectedShape(shape);
      }
      if (config.glazeId) {
        const glaze = GLAZES.find(g => g.id === config.glazeId);
        if (glaze) setSelectedGlaze(glaze);
      }
      if (config.patternId) {
        const pattern = PATTERNS.find(p => p.id === config.patternId);
        if (pattern) setSelectedPattern(pattern);
      }
      if (config.patternColor) {
        setSelectedPatternColor(config.patternColor);
      }
    };

    window.addEventListener('apply-pottery-config', handleApplyConfig);
    return () => window.removeEventListener('apply-pottery-config', handleApplyConfig);
  }, []);

  const handleConsultArtisan = () => {
    const config = {
      shape: selectedShape,
      glaze: selectedGlaze,
      pattern: selectedPattern,
      patternColor: selectedPatternColor,
    };
    // Gửi thông tin hiện tại sang chatbot và yêu cầu tư vấn
    const event = new CustomEvent('artisan-consult', { detail: config });
    window.dispatchEvent(event);
  };

  const handleRandomize = () => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const randomGlaze = GLAZES[Math.floor(Math.random() * GLAZES.length)];
    const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const randomPatternColor = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)].color;

    setSelectedShape(randomShape);
    setSelectedGlaze(randomGlaze);
    setSelectedPattern(randomPattern);
    
    // Nếu mẫu là "Mộc" thì để màu mặc định, còn không thì lấy màu ngẫu nhiên
    if (randomPattern.id !== 'none') {
        setSelectedPatternColor(randomPatternColor);
    } else {
        setSelectedPatternColor(randomPattern.defaultColor);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-7xl mx-auto px-4 md:px-0 mb-12">
      <div className="lg:w-2/3 bg-white rounded-[3rem] relative overflow-hidden flex flex-col min-h-[500px] md:min-h-[750px] shadow-2xl border border-zinc-100">
        <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center gap-2 px-8 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-zinc-200 flex items-center gap-3 shadow-sm pointer-events-auto">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Bàn Xoay Di Sản 3D</span>
          </div>
        </div>
        <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
          <Canvas shadows camera={{ position: [0, 6, 38], fov: 30 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={<Html center><div className="text-zinc-400 animate-pulse font-serif italic text-lg text-center">Đang nhào nặn đất sét...</div></Html>}>
              {/* @ts-ignore */}
              <color attach="background" args={['#ffffff']} />
              <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
                <Center bottom key={`${selectedShape.id}-${selectedPattern.id}-${selectedPatternColor}`}>
                  <PotteryModel shape={selectedShape} glaze={selectedGlaze} pattern={selectedPattern} patternColor={selectedPatternColor} />
                </Center>
              </Float>
              <ContactShadows position={[0, -0.01, 0]} opacity={0.2} scale={15} blur={2} far={10} color="#000000" />
              {/* @ts-ignore */}
              <ambientLight intensity={0.8} />
              {/* @ts-ignore */}
              <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={2.5} castShadow />
              <Environment preset="studio" />
              <OrbitControls enablePan={false} minDistance={10} maxDistance={60} makeDefault autoRotate autoRotateSpeed={0.4} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-100 flex flex-col gap-10 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">01. Hình Dáng</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif italic">{selectedShape.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SHAPES.map(shape => (
                <button key={shape.id} onClick={() => setSelectedShape(shape)} className={`py-5 px-3 rounded-2xl border-2 transition-all ${selectedShape.id === shape.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-200'}`}>
                  <span className="text-xs font-bold font-serif">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">02. Màu Men</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif">{selectedGlaze.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {GLAZES.map(glaze => (
                <button key={glaze.id} onClick={() => setSelectedGlaze(glaze)} className={`w-10 h-10 rounded-full border-4 transition-all relative group ${selectedGlaze.id === glaze.id ? 'border-brand-clay scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-110'}`} style={{ backgroundColor: glaze.color }} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
              <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">03. Họa Tiết</h3>
              <span className="text-[11px] text-zinc-500 font-bold font-serif">{selectedPattern.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PATTERNS.map(pattern => (
                <button key={pattern.id} onClick={() => setSelectedPattern(pattern)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPattern.id === pattern.id ? 'border-zinc-900 bg-zinc-50 shadow-md' : 'border-zinc-50 hover:border-zinc-100'}`}>
                  <span className="text-2xl">{pattern.icon}</span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter text-center">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedPattern.id !== 'none' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
                <h3 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">04. Màu Họa Tiết</h3>
                <div className="w-4 h-4 rounded-full border border-zinc-200" style={{ backgroundColor: selectedPatternColor }}></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {PATTERN_COLORS.map(pColor => (
                  <button key={pColor.id} onClick={() => setSelectedPatternColor(pColor.color)} className={`w-8 h-8 rounded-lg border-2 transition-all relative group ${selectedPatternColor === pColor.color ? 'border-zinc-900 scale-110 shadow-md' : 'border-white shadow-sm hover:scale-105'}`} style={{ backgroundColor: pColor.color }} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            <button 
                onClick={handleRandomize} 
                className="w-full py-4 bg-zinc-100 text-zinc-800 rounded-2xl font-bold text-xs shadow-sm hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3 border border-zinc-200 group"
            >
                <span className="group-hover:rotate-180 transition-transform duration-500">🎲</span>
                <span className="tracking-widest uppercase">Phối mẫu ngẫu nhiên</span>
            </button>
            
            <button 
                onClick={handleConsultArtisan} 
                className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black text-xs shadow-2xl hover:bg-brand-clay transition-all active:scale-95 flex items-center justify-center gap-4 group relative overflow-hidden"
            >
                <span className="relative z-10 tracking-[0.4em] uppercase">Nhận tư vấn từ Nghệ nhân AI</span>
                <div className="absolute inset-0 bg-brand-clay translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotteryStudio;
