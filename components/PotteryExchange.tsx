
import React from 'react';

const PotteryExchange: React.FC = () => {
  return (
    <section id="trao-doi" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-brand-sand/30 border-2 border-brand-clay/20 p-8 md:p-16 text-center">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-brand-clay/30 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-brand-clay/30 rounded-br-2xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-brand-terracotta font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Cộng đồng yêu gốm Mỹ Thiện</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
            Trao đổi sản phẩm gốm
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            Nơi kết nối những tâm hồn đồng điệu, cho phép bạn trao đổi những tác phẩm gốm độc bản, 
            chia sẻ câu chuyện đằng sau mỗi vật dụng và cùng nhau gìn giữ nét đẹp di sản Quảng Ngãi.
          </p>
          
          <div className="flex justify-center">
            <a 
              href="exchange.html" 
              className="group relative inline-flex items-center justify-center bg-brand-terracotta text-white font-bold py-4 px-10 rounded-full transition-all hover:bg-brand-clay shadow-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Tham gia trao đổi
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
          </div>
        </div>

        {/* Subtle background motif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[200px] leading-none">🏺</span>
        </div>
      </div>
    </section>
  );
};

export default PotteryExchange;
