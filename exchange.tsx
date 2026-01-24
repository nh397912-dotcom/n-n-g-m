
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const EXCHANGE_PRODUCTS: Product[] = [
  { id: 101, name: 'Bình Gốm Men Hỏa Biến', price: 450000, imageUrl: 'https://images.unsplash.com/photo-1578749553348-4736934f029a?auto=format&fit=crop&q=80&w=600', category: 'Trang trí' },
  { id: 102, name: 'Chum Rượu Mỹ Thiện Cổ', price: 1200000, imageUrl: 'https://dulichquangngai.vn/uploads/news/2023_12/lang-gom-my-thien.jpg', category: 'Gia dụng' },
  { id: 103, name: 'Ấm Trà Đất Nung Mỹ Thiện', price: 650000, imageUrl: 'https://media.baovanhoa.vn/zoom/600_400/Portals/0/EasyGalleryImages/1/56864/g%E1%BB%91m-1.jpg', category: 'Gia dụng' },
  { id: 104, name: 'Bình Vôi Đắp Nổi Rồng', price: 350000, imageUrl: 'https://resource.kinhtedothi.vn/2021/12/25/trinh.jpg', category: 'Tâm linh' },
  { id: 105, name: 'Lọ Hoa Men Ngọc Mỹ Thiện', price: 580000, imageUrl: 'https://resource.kinhtedothi.vn/2024/01/29/fbe69c260171ab2ff26051.jpg', category: 'Trang trí' },
  { id: 106, name: 'Bát Ăn Cơm Gốm Cổ', price: 85000, imageUrl: 'https://covatdanang.com/wp-content/uploads/2024/11/bst-gom-chau-o.jpg', category: 'Gia dụng' },
  { id: 107, name: 'Đĩa Trang Trí Hoa Văn Xưa', price: 220000, imageUrl: 'https://vnanet.vn/Data/Articles/2025/07/10/8141479/vna_potal_nghe_gom_my_thien_-_di_san_van_hoa_phi_vat_the_quoc_gia_stand.jpg', category: 'Trang trí' },
  { id: 108, name: 'Lu Đựng Nước Men Rạn', price: 1800000, imageUrl: 'https://images.unsplash.com/photo-1590424744257-fdb035767566?q=80&w=600', category: 'Gia dụng' },
];

const ExchangeApp: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="index.html" className="flex items-center gap-2">
            <span className="text-2xl">🏺</span>
            <span className="font-serif font-bold text-brand-terracotta text-xl hidden sm:inline">MỸ THIỆN EXCHANGE</span>
          </a>
          
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm gốm..." 
                className="w-full bg-gray-100 border-none rounded-sm px-4 py-2 focus:ring-2 focus:ring-brand-clay text-sm"
              />
              <button className="absolute right-2 top-1.5 bg-brand-terracotta text-white px-3 py-1 rounded-sm text-xs">Tìm</button>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 text-brand-terracotta hover:bg-gray-100 rounded-full transition-all ${isAnimating ? 'cart-bounce' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-shopee-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Mini */}
      <div className="bg-brand-terracotta text-white py-4 text-center text-sm font-medium">
        🔥 Miễn phí vận chuyển cho đơn hàng gốm trên 1.000.000đ tại Quảng Ngãi!
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-brand-clay"></span>
          Sản phẩm Gốm Giao lưu
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {EXCHANGE_PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative aspect-square overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-0 right-0 bg-brand-clay/90 text-white text-[10px] px-2 py-1 font-bold">
                  YÊU THÍCH
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-shopee-orange font-bold text-lg">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full border border-brand-clay text-brand-clay hover:bg-brand-clay/5 py-2 rounded-sm text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b flex justify-between items-center bg-brand-dark text-white">
              <h2 className="font-bold flex items-center gap-2">
                <span>🛒</span> Giỏ hàng của bạn ({totalItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <span className="text-6xl mb-4">🏺</span>
                  <p>Chưa có sản phẩm nào trong giỏ</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-sm border" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-1">{item.name}</h4>
                      <p className="text-shopee-orange font-bold text-sm mb-2">{item.price.toLocaleString('vi-VN')}đ</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border flex items-center justify-center rounded-sm hover:bg-gray-50">-</button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 border flex items-center justify-center rounded-sm hover:bg-gray-50">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-shopee-orange">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <button 
                className="w-full bg-shopee-orange text-white font-bold py-3 rounded-sm hover:bg-opacity-90 transition-all shadow-lg disabled:bg-gray-300"
                disabled={cart.length === 0}
                onClick={() => alert("Cảm ơn bạn! Đơn hàng gốm đã được ghi nhận.")}
              >
                MUA HÀNG NGAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Mini */}
      <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-2 italic">"Gốm Mỹ Thiện - Nét tinh hoa dân tộc"</p>
          <p>&copy; 2024 Sàn Gốm Mỹ Thiện - Quảng Ngãi</p>
        </div>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('exchange-root')!);
root.render(<ExchangeApp />);
