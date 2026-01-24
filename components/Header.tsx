
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-brand-sand">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 mx-auto lg:mx-0">
          <a href="/" className="flex items-center gap-3 group">
            <div className="bg-brand-clay text-white w-10 h-10 rounded-lg flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 transition-transform">
              🏺
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-terracotta leading-none">
                MỸ THIỆN STUDIO
              </h1>
              <p className="text-[10px] md:text-xs text-brand-dark tracking-[0.2em] font-bold uppercase mt-1">Nghệ thuật tạo hình 3D</p>
            </div>
          </a>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-brand-clay">
          <span className="px-3 py-1 border border-brand-clay rounded-full">DI SẢN QUẢNG NGÃI</span>
          <span className="px-3 py-1 border border-brand-clay rounded-full">TRUYỀN THỐNG 200 NĂM</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
