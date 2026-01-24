
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-brand-glaze py-8 mt-12">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm opacity-70 mb-2 font-serif">"Gốm Mỹ Thiện - Nơi đất sét hồi sinh qua tâm hồn người Việt"</p>
        <div className="w-12 h-px bg-brand-clay mx-auto mb-4 opacity-30"></div>
        <p className="text-[10px] opacity-50 uppercase tracking-widest">&copy; {new Date().getFullYear()} Xưởng Gốm Kỹ Thuật Số Mỹ Thiện - Quảng Ngãi</p>
      </div>
    </footer>
  );
};

export default Footer;
