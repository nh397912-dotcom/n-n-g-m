
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const WorkshopBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: 'Sáng (08:00 - 11:00)',
    guests: 1,
    duration: '60 phút',
    name: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    // Simple validation for phone
    if (!/^\d{10,11}$/.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ (phải gồm 10-11 chữ số).");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border-t-8 border-brand-clay animate-fade-in">
          <div className="text-6xl mb-6">🏺</div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Cảm ơn <strong>{formData.name}</strong>! Chúng tôi đã nhận được yêu cầu đặt lịch cho ngày <strong>{formData.date}</strong>. 
            Nghệ nhân Mỹ Thiện sẽ liên hệ với bạn qua số <strong>{formData.phone}</strong> để xác nhận trong thời gian sớm nhất.
          </p>
          <a href="index.html" className="inline-block bg-brand-terracotta text-white font-bold py-4 px-8 rounded-full hover:bg-brand-clay transition-all shadow-lg">
            Quay về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <a href="index.html" className="inline-flex items-center text-brand-clay hover:text-brand-terracotta font-bold mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Trở về trang chủ
        </a>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-6">Trải nghiệm làm gốm Mỹ Thiện</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Đắm mình trong không gian yên bình của làng nghề, tự tay nhào nặn đất sét và tạo nên tác phẩm mang dấu ấn cá nhân dưới sự hướng dẫn của nghệ nhân.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-clay/10 p-6 rounded-2xl border border-brand-clay/20">
            <h3 className="font-bold text-brand-terracotta uppercase tracking-wider text-sm mb-4">Thông tin Trải nghiệm</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <span className="text-xl">📍</span>
                <span>Thị trấn Châu Ổ, Bình Sơn, Quảng Ngãi</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="text-xl">💰</span>
                <span>Từ 150.000đ / người (bao gồm nguyên liệu & nung gốm)</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="text-xl">🎨</span>
                <span>Sản phẩm được mang về sau khi nung (khoảng 7-10 ngày)</span>
              </li>
            </ul>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=800" 
            className="rounded-2xl shadow-xl w-full h-64 object-cover" 
            alt="Nghệ nhân hướng dẫn"
          />
        </div>

        <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-brand-sand">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ngày tham gia *</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Khung giờ</label>
                <select 
                  value={formData.timeSlot}
                  onChange={e => setFormData({...formData, timeSlot: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
                >
                  <option>Sáng (08:00 - 11:00)</option>
                  <option>Chiều (14:00 - 17:00)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng khách</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={formData.guests}
                  onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thời lượng</label>
                <select 
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
                >
                  <option>60 phút</option>
                  <option>90 phút</option>
                  <option>Trọn buổi (3 tiếng)</option>
                </select>
              </div>
            </div>

            <hr className="border-brand-sand/30" />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên người đặt *</label>
              <input 
                type="text" 
                required
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
              <input 
                type="tel" 
                required
                placeholder="Nhập số điện thoại để chúng tôi liên hệ"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-clay outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-terracotta text-white font-bold py-4 rounded-xl hover:bg-brand-clay transition-all shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
            >
              Đặt lịch trải nghiệm ngay
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <p className="text-center text-xs text-gray-400">
              * Chúng tôi sẽ liên hệ xác nhận và hướng dẫn chi tiết qua điện thoại.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('workshop-root')!);
root.render(<WorkshopBooking />);
