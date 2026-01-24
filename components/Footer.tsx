
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLoginModal from './AdminLoginModal';

const Footer: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = React.useState(false);
  const { isLoggedIn } = useAuth();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Xưởng Gốm Mỹ Thiện - Sáng Tạo Di Sản 3D',
          text: 'Khám phá và sáng tạo gốm Mỹ Thiện Quảng Ngãi với công nghệ AI 3D độc đáo!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết vào bộ nhớ tạm!');
    }
  };

  return (
    <footer className="bg-brand-dark text-brand-glaze pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏺</span>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide uppercase">Mỹ Thiện Studio</h3>
            </div>
            <p className="text-sm text-brand-glaze/60 leading-relaxed font-light">
              Nơi hội tụ tinh hoa làng nghề truyền thống Quảng Ngãi và công nghệ số hiện đại. Chúng tôi gìn giữ di sản qua từng pixel và nét chạm khắc 3D.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Chia sẻ trang web
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-brand-clay uppercase tracking-[0.3em]">Liên kết nhanh</h4>
            <nav className="flex flex-col gap-4">
              <a href="https://gom-my-thien.vercel.app/" className="text-sm hover:text-brand-clay transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-clay/40"></span>
                Trang chủ Di sản Mỹ Thiện
              </a>
              <a href="https://t-l-ch-workshop.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-brand-clay transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-clay/40"></span>
                Đặt lịch Workshop làm gốm
              </a>
              <a href="https://shop-gom-my-thien.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-brand-clay transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-clay/40"></span>
                Cửa hàng Gốm Mỹ Thiện
              </a>
            </nav>
          </div>

          {/* Column 3: Contact/Admin */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-brand-clay uppercase tracking-[0.3em]">Hỗ trợ & Quản lý</h4>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <p className="text-[10px] text-brand-glaze/40 uppercase font-bold tracking-widest">Dành cho nghệ nhân</p>
              {!isLoggedIn ? (
                <button 
                  onClick={() => setLoginModalOpen(true)}
                  className="w-full py-3 bg-brand-clay text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-terracotta transition-all shadow-lg"
                >
                  Đăng nhập Quản trị
                </button>
              ) : (
                <div className="flex items-center gap-3 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold">Đã đăng nhập Admin</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] opacity-30 uppercase tracking-[0.2em] font-medium">
            &copy; {new Date().getFullYear()} Xưởng Gốm Kỹ Thuật Số Mỹ Thiện - Quảng Ngãi
          </p>
          <div className="flex gap-6 text-[10px] opacity-30 uppercase tracking-widest">
            <span className="cursor-default">Đất Sét</span>
            <span className="cursor-default">Men Gốm</span>
            <span className="cursor-default">Lửa Hồng</span>
          </div>
        </div>
      </div>

      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
