
import React from 'react';

const Introduction: React.FC = () => {
  return (
    <section id="gioi-thieu" className="scroll-mt-24">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="lg:w-1/2 p-8 md:p-12">
          <span className="text-brand-clay font-bold tracking-widest uppercase text-sm mb-2 block">Di sản văn hóa phi vật thể</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6 leading-tight">
            Linh hồn của Đất & Lửa Mỹ Thiện
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              Nằm bên dòng sông Trà Bồng hiền hòa, làng gốm Mỹ Thiện (thị trấn Châu Ổ, huyện Bình Sơn, Quảng Ngãi) đã tồn tại hơn 200 năm, trải qua bao thăng trầm của lịch sử.
            </p>
            <p>
              Khác biệt với gốm Bát Tràng hay Chu Đậu, gốm Mỹ Thiện nổi tiếng với kỹ thuật <strong>tráng men hỏa biến</strong> và <strong>đắp nổi thủ công</strong>. Mỗi sản phẩm không chỉ là vật dụng, mà là một tác phẩm nghệ thuật mang đậm cốt cách mộc mạc, kiên cường của người dân xứ Quảng.
            </p>
            <p className="italic text-brand-clay font-medium">
              "Gốm Mỹ Thiện - Nơi đất sét hồi sinh qua đôi bàn tay nghệ nhân Đặng Văn Trịnh."
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 h-full">
          <img 
            src="https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=1200" 
            alt="Nghệ nhân nặn gốm" 
            className="w-full h-full min-h-[400px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Introduction;
