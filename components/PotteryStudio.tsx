
import React, { useState, useMemo, Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Center, Html, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// SVGs cho hoa văn di sản
const PATTERN_ASSETS = {
  dragon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 50C142.2 50 50 142.2 50 256s92.2 206 206 206 206-92.2 206-206S369.8 50 256 50zm0 372c-91.7 0-166-74.3-166-166S164.3 90 256 90s166 74.3 166 166-74.3 166-166 166z" fill="{{COLOR}}" opacity="0.3"/><path d="M256 120c-75.1 0-136 60.9-136 136s60.9 136 136 136 136-60.9 136-136-60.9-136-136-136zm0 232c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z" fill="{{COLOR}}"/><path d="M256 180c-41.9 0-76 34.1-76 76s34.1 76 76 76 76-34.1 76-76-34.1-76-76-76z" fill="{{COLOR}}" opacity="0.8"/></svg>`,
  lotus: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 100c-20 0-40 40-40 80s20 80 40 80 40-40 40-80-20-80-40-80zM180 140c-15 0-30 45-30 90s15 90 30 90 30-45 30-90-15-90-30-90zM332 140c15 0 30 45 30 90s-15 90-30 90-30-45-30-90 15-90 30-90zM120 220c-10 0-20 50-20 100s10 100 20 100 20-50 20-100-10-100-20-100zM392 220c10 0 20 50 20 100s-10 100-20 100-20-50-20-100 10-100 20-100z" fill="{{COLOR}}"/></svg>`,
  phoenix: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M256 50c-20 80-80 100-80 150s40 100 80 100 80-50 80-100-60-70-80-150z" fill="{{COLOR}}"/><path d="M100 256c50 0 80-30 100-80s-20-100-50-100-100 80-50 180zM412 256c-50 0-80-30-100-80s20-100 50-100 100 80 50 180z" fill="{{COLOR}}" opacity="0.8"/></svg>`,
  waves: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M0 256c50-50 100-50 150 0s100 50 150 0 100-50 150 0v256H0V256zM0 156c50-50 100-50 150 0s100 50 150 0 100-50 150 0v100H0V156z" fill="{{COLOR}}" opacity="0.6"/></svg>`,
  bamboo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M100 512V0h20v512h-20zm150 0V0h20v512h-20zm150 0V0h20v512h-20z" fill="{{COLOR}}" opacity="0.2"/><path d="M100 400l80-40-20-10-60 50zm150-150l80-40-20-10-60 50zm150-100l80-40-20-10-60 50z" fill="{{COLOR}}"/></svg>`,
  chrysanthemum: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><circle cx="256" cy="256" r="40" fill="{{COLOR}}"/><path d="M256 100c10 50 40 50 50 0s-40-50-50 0zm0 312c10-50 40-50 50 0s-40 50-50 0zM100 256c50 10 50 40 0 50s-50-40 0-50zm312 0c-50 10-50 40 0 50s50-40 0-50z" fill="{{COLOR}}" opacity="0.8"/></svg>`
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
  { id: 'bamboo', name: 'Trúc Quân Tử', icon: '🎋', textureBase: PATTERN_ASSETS.bamboo, defaultColor: '#166534' },
  { id: 'chrysanthemum', name: 'Cúc Đại Đóa', icon: '🌼', textureBase: PATTERN_ASSETS.chrysanthemum, defaultColor: '#ca8a04' }
];

const PATTERN_COLORS = [
  { id: 'gold', name: 'Vàng Kim', color: '#ffd700' },
  { id: 'red', name: 'Đỏ Son', color: '#ff0000' },
  { id: 'emerald', name: 'Xanh Ngọc', color: '#008080' },
  { id: 'cobalt', name: 'Xanh Lam', color: '#0047ab' },
  { id: 'white', name: 'Trắng Tuyết', color: '#ffffff' },
  { id: 'black', name: 'Đen Mun', color: '#000000' },
  { id: 'bronze', name: 'Đồng Cổ', color: '#cd7f32' }
];

const EMPTY_TEXTURE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Bàn tay 3D theo dõi khi kéo
const ArtisanHand3D = ({ active, position }: { active: boolean, position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !active) return;
    meshRef.current.position.lerp(position, 0.2);
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 2) * 0.1;
  });

  if (!active) return null;

  return (
    <group ref={meshRef}>
        <Html transform distanceFactor={5} portal={{ current: document.body }} style={{ pointerEvents: 'none' }}>
            <div className="text-6xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] select-none animate-pulse">✋</div>
        </Html>
        <pointLight intensity={1} color="#ff9d00" distance={5} />
    </group>
  );
};

// Component Mũi tên kéo thả trên Model
const DragHandle = ({ 
  position, 
  direction, 
  onDrag, 
  active, 
  label,
  onDragStart,
  onDragEnd
}: { 
  position: [number, number, number], 
  direction: 'y' | 'x',
  onDrag: (delta: number, currentPos: THREE.Vector3) => void,
  active: boolean,
  label: string,
  onDragStart: () => void,
  onDragEnd: () => void
}) => {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pointerStart = useRef(0);
  const worldPos = useRef(new THREE.Vector3());
  const { size, viewport, camera } = useThree();

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setDragging(true);
    onDragStart();
    pointerStart.current = direction === 'y' ? e.clientY : e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: any) => {
    if (!dragging) return;
    const current = direction === 'y' ? e.clientY : e.clientX;
    const delta = (pointerStart.current - current) / (direction === 'y' ? size.height : size.width) * (direction === 'y' ? viewport.height : viewport.width);
    
    // Tính toán vị trí 3D hiện tại của con trỏ để bàn tay đuổi theo
    worldPos.current.set(
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1,
        0.5
    ).unproject(camera);

    onDrag(delta, worldPos.current);
    pointerStart.current = current;
  };

  const handlePointerUp = (e: any) => {
    setDragging(false);
    onDragEnd();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (!active) return null;

  return (
    <group position={position}>
      <Html center transform={false} distanceFactor={15} zIndexRange={[100, 0]}>
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-200 shadow-2xl border-4
            ${dragging ? 'bg-orange-600 border-white scale-125 opacity-0' : hovered ? 'bg-orange-400 border-orange-100 scale-110' : 'bg-white/95 border-orange-500'}
          `}
        >
          <span className="text-xl font-bold text-orange-600">
            {direction === 'y' ? '↕' : '↔'}
          </span>
          
          {(dragging || hovered) && (
            <div className="absolute top-16 whitespace-nowrap bg-black/90 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">
              {label}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

const PotteryModel = ({ 
  shape, glaze, pattern, patternColor, moldingFactors, isMolding, onAdjust
}: { 
  shape: any, glaze: any, pattern: any, patternColor: string, 
  moldingFactors: { height: number, neck: number, body: number, base: number },
  isMolding: boolean,
  onAdjust: (key: string, delta: number, handPos: THREE.Vector3) => void
}) => {
  const [activeDrag, setActiveDrag] = useState(false);
  const [handPos, setHandPos] = useState(new THREE.Vector3());

  const patternTextureUrl = useMemo(() => {
    if (!pattern.textureBase) return EMPTY_TEXTURE;
    const encodedColor = patternColor.replace('#', '%23');
    return pattern.textureBase.replace(/{{COLOR}}/g, encodedColor);
  }, [pattern, patternColor]);

  const patternTexture = useTexture(patternTextureUrl) as THREE.Texture;
  
  useMemo(() => {
    if (patternTexture && pattern.id !== 'none') {
      patternTexture.wrapS = patternTexture.wrapT = THREE.RepeatWrapping;
      patternTexture.repeat.set(4, 2);
      patternTexture.anisotropy = 16;
    }
  }, [patternTexture, pattern.id]);

  const points = useMemo(() => {
    const rawPoints = shape.points.map((p: number[], idx: number) => {
      let x = p[0];
      let y = p[1];
      y *= moldingFactors.height;
      const totalPoints = shape.points.length;
      if (idx < totalPoints * 0.3) {
        x *= moldingFactors.base;
      } else if (idx < totalPoints * 0.7) {
        x *= moldingFactors.body;
      } else {
        x *= moldingFactors.neck;
      }
      return new THREE.Vector2(x, y);
    });
    const curve = new THREE.SplineCurve(rawPoints);
    return curve.getPoints(128);
  }, [shape, moldingFactors]);

  const topY = points[points.length - 1].y;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 128]} />
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
      {pattern.id !== 'none' && (
        <mesh scale={[1.002, 1.002, 1.002]}>
          <latheGeometry args={[points, 128]} />
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

      {/* Các điểm nặn tương tác trực tiếp */}
      <DragHandle 
        position={[0, topY + 1.5, 0]} 
        direction="y" 
        active={isMolding} 
        label="Chiều cao" 
        onDragStart={() => setActiveDrag(true)}
        onDragEnd={() => setActiveDrag(false)}
        onDrag={(d, pos) => { setHandPos(pos); onAdjust('height', d, pos); }} 
      />
      <DragHandle 
        position={[shape.points[Math.floor(shape.points.length * 0.85)][0] * moldingFactors.neck + 1.5, topY * 0.85, 0]} 
        direction="x" 
        active={isMolding} 
        label="Cổ bình" 
        onDragStart={() => setActiveDrag(true)}
        onDragEnd={() => setActiveDrag(false)}
        onDrag={(d, pos) => { setHandPos(pos); onAdjust('neck', d, pos); }} 
      />
      <DragHandle 
        position={[shape.points[Math.floor(shape.points.length * 0.5)][0] * moldingFactors.body + 1.8, topY * 0.5, 0]} 
        direction="x" 
        active={isMolding} 
        label="Thân bình" 
        onDragStart={() => setActiveDrag(true)}
        onDragEnd={() => setActiveDrag(false)}
        onDrag={(d, pos) => { setHandPos(pos); onAdjust('body', d, pos); }} 
      />
      <DragHandle 
        position={[shape.points[Math.floor(shape.points.length * 0.1)][0] * moldingFactors.base + 1.5, topY * 0.1, 0]} 
        direction="x" 
        active={isMolding} 
        label="Đáy bình" 
        onDragStart={() => setActiveDrag(true)}
        onDragEnd={() => setActiveDrag(false)}
        onDrag={(d, pos) => { setHandPos(pos); onAdjust('base', d, pos); }} 
      />

      <ArtisanHand3D active={activeDrag} position={handPos} />
    </group>
  );
};

const PotteryStudio: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedGlaze, setSelectedGlaze] = useState(GLAZES[0]);
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);
  const [selectedPatternColor, setSelectedPatternColor] = useState(PATTERNS[0].defaultColor);
  
  const [isMoldingMode, setIsMoldingMode] = useState(false);
  const [moldingFactors, setMoldingFactors] = useState({
    height: 1.0,
    neck: 1.0,
    body: 1.0,
    base: 1.0
  });

  const [savedMoldingFactors, setSavedMoldingFactors] = useState({ ...moldingFactors });

  const handleAdjust = (key: string, delta: number) => {
    setMoldingFactors(prev => ({
      ...prev,
      // @ts-ignore
      [key]: Math.max(0.4, Math.min(2.5, prev[key] + delta * 0.5))
    }));
  };

  useEffect(() => {
    if (selectedPattern.id !== 'none' && !selectedPatternColor) {
        setSelectedPatternColor(selectedPattern.defaultColor);
    }
  }, [selectedPattern]);

  const handleApplyConfig = (e: any) => {
    const config = e.detail;
    if (config.shapeId) {
      const shape = SHAPES.find(s => s.id === config.shapeId);
      if (shape) {
        setSelectedShape(shape);
        setMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 });
        setSavedMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 });
      }
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

  useEffect(() => {
    window.addEventListener('apply-pottery-config', handleApplyConfig);
    return () => window.removeEventListener('apply-pottery-config', handleApplyConfig);
  }, []);

  const handleConsultArtisan = () => {
    const config = {
      shape: selectedShape,
      glaze: selectedGlaze,
      pattern: selectedPattern,
      patternColor: selectedPatternColor,
      moldingFactors: isMoldingMode ? moldingFactors : null
    };
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
    setMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 });
    setSavedMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 });
    
    if (randomPattern.id !== 'none') {
        setSelectedPatternColor(randomPatternColor);
    } else {
        setSelectedPatternColor(randomPattern.defaultColor);
    }
  };

  const startMolding = () => {
    setSavedMoldingFactors({ ...moldingFactors });
    setIsMoldingMode(true);
  };

  const cancelMolding = () => {
    setMoldingFactors({ ...savedMoldingFactors });
    setIsMoldingMode(false);
  };

  const confirmMolding = () => {
    setSavedMoldingFactors({ ...moldingFactors });
    setIsMoldingMode(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-7xl mx-auto px-4 md:px-0 mb-12">
      <div className="lg:w-2/3 bg-white rounded-[3rem] relative overflow-hidden flex flex-col min-h-[500px] md:min-h-[750px] shadow-2xl border border-zinc-100">
        <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center gap-2 px-8 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-zinc-200 flex items-center gap-3 shadow-sm pointer-events-auto">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isMoldingMode ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              {isMoldingMode ? 'Chế độ: Đang nhào nặn di sản' : 'Bàn Xoay Di Sản 3D'}
            </span>
          </div>
        </div>
        
        <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
          <Canvas shadows camera={{ position: [0, 6, 38], fov: 30 }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={<Html center><div className="text-zinc-400 animate-pulse font-serif italic text-lg text-center font-bold">Đất Mỹ Thiện đang lên khuôn...</div></Html>}>
              <color attach="background" args={['#ffffff']} />
              <Float speed={0.8} rotationIntensity={isMoldingMode ? 0 : 0.1} floatIntensity={0.2}>
                <Center bottom key={`${selectedShape.id}-${selectedPattern.id}-${selectedPatternColor}-${moldingFactors.height}`}>
                  <PotteryModel 
                    shape={selectedShape} 
                    glaze={selectedGlaze} 
                    pattern={selectedPattern} 
                    patternColor={selectedPatternColor}
                    moldingFactors={moldingFactors}
                    isMolding={isMoldingMode}
                    onAdjust={handleAdjust}
                  />
                </Center>
              </Float>
              <ContactShadows position={[0, -0.01, 0]} opacity={0.2} scale={15} blur={2} far={10} color="#000000" />
              <ambientLight intensity={0.8} />
              <spotLight position={[15, 20, 15]} angle={0.25} penumbra={1} intensity={2.5} castShadow />
              <Environment preset="studio" />
              <OrbitControls enablePan={false} minDistance={10} maxDistance={60} makeDefault enabled={!isMoldingMode} autoRotate={!isMoldingMode} autoRotateSpeed={0.4} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-100 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
          
          {/* Section 01: Hình Dáng & Nặn Gốm */}
          <div className="space-y-4">
            <div className="flex flex-col gap-5 border-b border-zinc-100 pb-8">
              <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">01. Hình Dáng</h3>
              
              {!isMoldingMode ? (
                <button 
                  onClick={startMolding}
                  className="w-full py-7 rounded-[2rem] bg-orange-500 border-b-[6px] border-orange-700 text-white font-black uppercase tracking-[0.25em] transition-all shadow-2xl flex flex-col items-center justify-center gap-2 group transform hover:scale-[1.03] active:scale-95"
                >
                  <span className="text-4xl">🏺</span>
                  <span className="text-xl">NẶN GỐM THỦ CÔNG</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={cancelMolding}
                    className="py-5 rounded-2xl bg-zinc-100 text-zinc-500 font-black uppercase tracking-widest text-[10px] border-b-4 border-zinc-200 hover:bg-zinc-200 transition-all active:scale-95"
                  >
                    THOÁT (HỦY)
                  </button>
                  <button 
                    onClick={confirmMolding}
                    className="py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] border-b-4 border-emerald-700 hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    XÁC NHẬN DÁNG
                  </button>
                </div>
              )}
              
              {isMoldingMode && (
                <div className="space-y-3 bg-orange-50 p-5 rounded-3xl border border-orange-100 animate-fade-in shadow-inner">
                  <p className="text-[11px] text-orange-800 font-black text-center italic uppercase tracking-tighter">
                    🌟 Chạm & Kéo bàn tay trên bình để tạo dáng
                  </p>
                  <button 
                    onClick={() => setMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 })}
                    className="w-full py-2 text-[9px] font-black uppercase text-orange-400 hover:text-orange-600 underline"
                  >
                    Đặt lại kích thước mặc định
                  </button>
                </div>
              )}
            </div>

            {!isMoldingMode && (
              <div className="grid grid-cols-2 gap-2 animate-fade-in">
                {SHAPES.map(shape => (
                  <button key={shape.id} onClick={() => { setSelectedShape(shape); setMoldingFactors({ height: 1.0, neck: 1.0, body: 1.0, base: 1.0 }); }} className={`py-3 px-2 rounded-xl border-2 transition-all ${selectedShape.id === shape.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg' : 'border-zinc-50 bg-zinc-50/50 hover:border-zinc-200'}`}>
                    <span className="text-[10px] font-bold font-serif">{shape.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Men Gốm */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
              <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">02. Màu Men</h3>
              <span className="text-[10px] text-zinc-500 font-bold font-serif tracking-widest">{selectedGlaze.name}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {GLAZES.map(glaze => (
                <button key={glaze.id} onClick={() => setSelectedGlaze(glaze)} className={`w-8 h-8 rounded-full border-4 transition-all relative group ${selectedGlaze.id === glaze.id ? 'border-brand-clay scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-110'}`} style={{ backgroundColor: glaze.color }} title={glaze.name} />
              ))}
            </div>
          </div>

          {/* Họa Tiết */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
              <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">03. Họa Tiết</h3>
              <span className="text-[10px] text-zinc-500 font-bold font-serif tracking-widest">{selectedPattern.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {PATTERNS.map(pattern => (
                <button key={pattern.id} onClick={() => setSelectedPattern(pattern)} className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${selectedPattern.id === pattern.id ? 'border-zinc-900 bg-zinc-50 shadow-md' : 'border-zinc-50 hover:border-zinc-200'}`}>
                  <span className="text-2xl">{pattern.icon}</span>
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter text-center">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Màu Họa Tiết */}
          {selectedPattern.id !== 'none' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-3">
                <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">04. Màu Họa Tiết</h3>
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: selectedPatternColor }}></div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PATTERN_COLORS.map(pColor => (
                  <button key={pColor.id} onClick={() => setSelectedPatternColor(pColor.color)} className={`w-7 h-7 rounded-xl border-2 transition-all relative group ${selectedPatternColor === pColor.color ? 'border-zinc-900 scale-110 shadow-md' : 'border-white shadow-sm hover:scale-110'}`} style={{ backgroundColor: pColor.color }} />
                ))}
              </div>
            </div>
          )}

          {/* Điều khiển cuối */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-zinc-100">
            <button 
                onClick={handleRandomize} 
                className="w-full py-4 bg-zinc-100 text-zinc-800 rounded-2xl font-bold text-[10px] shadow-sm hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 border border-zinc-200 group"
            >
                <span className="group-hover:rotate-180 transition-transform duration-500 text-base">🎲</span>
                <span className="tracking-[0.2em] uppercase">PHỐI MẪU NGẪU NHIÊN</span>
            </button>
            
            <button 
                onClick={handleConsultArtisan} 
                className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-[11px] shadow-2xl hover:bg-brand-clay transition-all active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
                <span className="relative z-10 tracking-[0.3em] uppercase">NHẬN TƯ VẤN NGHỆ NHÂN AI</span>
                <div className="absolute inset-0 bg-brand-clay translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotteryStudio;
