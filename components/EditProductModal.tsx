
import React, { useState } from 'react';
import type { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const { updateProductImage } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      updateProductImage(product.id, imageUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-brand-dark mb-4">Chỉnh sửa ảnh sản phẩm</h2>
        <p className="text-brand-dark mb-2 font-semibold">{product.name}</p>
        <img src={imageUrl} alt={`Xem trước ${product.name}`} className="w-full h-48 object-cover rounded-md mb-4 bg-gray-100"/>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL hình ảnh mới</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-clay focus:border-brand-clay sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
