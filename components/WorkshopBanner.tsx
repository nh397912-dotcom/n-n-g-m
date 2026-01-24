
import React from 'react';

const WorkshopBanner: React.FC = () => {
  return (
    <section id="workshop-banner" className="scroll-mt-24">
      <div className="bg-brand-dark rounded-3xl overflow-hidden relative group">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-2/3">
            <span className="text-brand-clay font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Gắn kết văn hóa</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Bạn muốn tự tay tạo nên <br/> một tác phẩm gốm?
            </h2>
            <p className="text-brand-sand/80 text-lg mb-8 max-w-xl">
              Đăng ký tham gia Trải nghiệm làm gốm để thấu hiểu hơn về giá trị của đất sét Mỹ Thiện và sự kỳ công của nghệ nhân xứ Quảng.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://t-l-ch-workshop.vercel.app/" 
                className="bg-brand-clay hover:bg-brand-terracotta text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl inline-flex items-center gap-2"
              >
                Đặt lịch Trải nghiệm làm gốm
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block w-1/3">
            <div className="relative">
               <div className="w-64 h-64 border-2 border-brand-sand/20 rounded-full absolute -top-8 -right-8 animate-pulse"></div>
               <div className="w-48 h-48 bg-brand-clay/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
                  <span className="text-8xl select-none">🎨</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopBanner;
