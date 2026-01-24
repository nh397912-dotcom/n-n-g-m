
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Product } from '../types';

const initialProducts: Product[] = [
    {
      id: 1,
      name: 'Chum đựng nước',
      description: 'Chiếc chum gốm mộc mạc, vật dụng không thể thiếu trong mỗi gia đình xưa, giúp giữ nước luôn trong lành và mát mẻ.',
      imageUrl: 'https://dulichquangngai.vn/uploads/news/2023_12/lang-gom-my-thien.jpg',
    },
    {
      id: 2,
      name: 'Bình hoa Mỹ Thiện',
      description: 'Bình hoa gốm với kiểu dáng thanh lịch, mộc mạc, tôn lên vẻ đẹp của những đóa hoa tươi thắm, mang lại sự ấm cúng cho không gian sống.',
      imageUrl: 'https://resource.kinhtedothi.vn/2021/12/25/trinh.jpg',
    },
    {
      id: 3,
      name: 'Bình hoa Rồng',
      description: 'Bình vôi gốm với hình dáng độc đáo, một nét văn hóa trầu cau đặc trưng của người Việt xưa.',
      imageUrl: 'https://media.baovanhoa.vn/zoom/600_400/Portals/0/EasyGalleryImages/1/56864/g%E1%BB%91m-1.jpg',
    },
    {
      id: 4,
      name: 'Bếp lò đất nung',
      description: 'Chiếc bếp lò đất nung quen thuộc, gợi nhớ về những gian bếp xưa ấm cúng, nơi tạo ra những món ăn ngon.',
      imageUrl: 'https://vnanet.vn/Data/Articles/2025/07/10/8141479/vna_potal_nghe_gom_my_thien_-_di_san_van_hoa_phi_vat_the_quoc_gia_stand.jpg',
    },
     {
      id: 5,
      name: 'Bình đắp nổi',
      description: 'Bình gốm được trang trí bằng kỹ thuật đắp nổi tinh xảo, tạo nên những họa tiết sống động và độc đáo, mang đậm dấu ấn nghệ thuật.',
      imageUrl: 'https://resource.kinhtedothi.vn/2024/01/29/fbe69c260171ab2ff26051.jpg',
    },
     {
      id: 6,
      name: 'Trưng bày sản phẩm',
      description: 'Các sản phẩm gốm Mỹ Thiện được trưng bày, thể hiện sự đa dạng và vẻ đẹp tinh hoa của làng nghề truyền thống.',
      imageUrl: 'https://covatdanang.com/wp-content/uploads/2024/11/bst-gom-chau-o.jpg',
    },
];


interface AuthContextType {
  isLoggedIn: boolean;
  products: Product[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProductImage: (productId: number, newImageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const login = (username: string, password: string): boolean => {
    // In a real app, you'd use a proper auth system.
    // Here, we'll use simple hardcoded credentials.
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateProductImage = (productId: number, newImageUrl: string) => {
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.id === productId ? { ...p, imageUrl: newImageUrl } : p
      )
    );
  };

  const value = { isLoggedIn, products, login, logout, updateProductImage };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
