
import React from 'react';

const steps = [
  {
    title: 'Làm đất',
    desc: 'Đất sét được lấy từ các mỏ địa phương, phơi khô, nghiền nhỏ và lọc bỏ tạp chất để đạt độ dẻo mịn tối đa.',
    icon: '🏺'
  },
  {
    title: 'Tạo hình',
    desc: 'Sử dụng bàn xoay thủ công kết hợp bàn tay khéo léo để tạo dáng cho sản phẩm theo ý muốn.',
    icon: '👐'
  },
  {
    title: 'Trang trí',
    desc: 'Nghệ nhân dùng kỹ thuật khắc vạch, đắp nổi các họa tiết rồng, phượng, hoa văn dân gian.',
    icon: '🖌️'
  },
  {
    title: 'Tráng men',
    desc: 'Lớp men độc bản từ tro củi và đá nghiền được phủ lên, tạo nên màu sắc hỏa biến đặc trưng.',
    icon: '✨'
  },
  {
    title: 'Nung gốm',
    desc: 'Sản phẩm được đưa vào lò nung ở nhiệt độ 1.200°C trong nhiều ngày đêm để đạt độ bền vĩnh cửu.',
    icon: '🔥'
  }
];

const PotteryProcess: React.FC = () => {
  return (
    <section id="quy-trinh" className="scroll-mt-24">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-10 text-center">
        Quy trình Chế tác Thủ công
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-brand-clay hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 text-center">{step.icon}</div>
            <h3 className="text-lg font-bold text-brand-terracotta mb-2 text-center">
              {index + 1}. {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed text-center">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PotteryProcess;
