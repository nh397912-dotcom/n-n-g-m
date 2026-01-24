
import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import EditProductModal from './EditProductModal';

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const { isLoggedIn } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div 
        ref={cardRef}
        className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group relative ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-serif font-bold text-brand-dark group-hover:text-brand-clay transition-colors">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">{product.description}</p>
          <div className="mt-4 w-12 h-1 bg-brand-sand group-hover:w-full transition-all duration-500"></div>
        </div>
        {isLoggedIn && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setEditModalOpen(true)}
              className="bg-brand-accent/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brand-accent transition-all shadow-lg"
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      </div>
      {isLoggedIn && (
        <EditProductModal
          product={product}
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
};


const ProductGallery: React.FC = () => {
  const { products } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="san-pham" className="mb-12 md:mb-16 scroll-mt-24 overflow-hidden">
      <div className="text-center mb-16">
        <span className="text-brand-clay font-bold tracking-[0.3em] uppercase text-xs">Di sản gốm xưa</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mt-3">
          Bộ sưu tập tiêu biểu
        </h2>
        <div className="w-24 h-1 bg-brand-clay mx-auto mt-6"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Video Section: Traditional Craftsmanship */}
      <div className="relative mt-20 bg-brand-dark rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 p-8 md:p-16 space-y-6">
            <div className="inline-flex items-center gap-2 text-brand-clay font-bold tracking-widest text-xs uppercase">
              <span className="w-8 h-px bg-brand-clay"></span>
              Phim tư liệu ngắn
            </div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Hành trình của <br/> <span className="text-brand-clay italic">Đất & Lửa</span>
            </h3>
            <p className="text-brand-sand/70 text-lg leading-relaxed font-light">
              Mỗi tác phẩm gốm Mỹ Thiện đều bắt đầu từ những tảng đất sét thô sơ, được "thai nghén" qua bàn xoay thủ công và tôi luyện trong ngọn lửa đỏ rực của lò bầu truyền thống. 
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="text-white font-bold text-sm uppercase mb-2">Bàn xoay thủ công</h4>
                <p className="text-xs text-brand-sand/50">Không dùng máy móc, mọi hình dáng đều từ đôi tay nhịp nhàng.</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase mb-2">Men Hỏa Biến</h4>
                <p className="text-xs text-brand-sand/50">Sự biến ảo kỳ diệu của nhiệt độ tạo nên sắc màu độc bản.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full aspect-video lg:aspect-square relative group cursor-pointer overflow-hidden bg-black">
            {isPlaying ? (
              <iframe 
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/uSv1mywmaMQ?autoplay=1" 
                title="Hành trình Gốm Mỹ Thiện" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full relative" onClick={() => setIsPlaying(true)}>
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                >
                  <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27dc36997cf628ee8da9051a44dba595cf39803&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                
                {/* Artistic Frame Overlay */}
                <div className="absolute inset-0 border-[16px] border-brand-dark pointer-events-none"></div>
                
                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-clay/40 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Texture Decor */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-clay to-transparent opacity-30"></div>
      </div>
    </section>
  );
};

export default ProductGallery;
