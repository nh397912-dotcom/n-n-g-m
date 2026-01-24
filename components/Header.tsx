
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLoginModal from './AdminLoginModal';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-brand-sand">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
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
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-brand-clay mr-4">
            <span className="px-3 py-1 border border-brand-clay rounded-full">DI SẢN QUẢNG NGÃI</span>
          </div>
          
          {isLoggedIn ? (
            <button 
              onClick={logout}
              className="bg-brand-dark text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-brand-clay transition-all shadow-md flex items-center gap-2"
            >
              <span>Admin</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="bg-brand-clay text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-brand-terracotta transition-all shadow-md"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
      
      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
