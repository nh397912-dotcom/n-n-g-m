
import React from 'react';
import Header from './components/Header';
import PotteryStudio from './components/PotteryStudio';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-pottery-texture">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 relative">
          <div className="text-center mb-10">
            <span className="text-brand-clay font-bold tracking-[0.3em] uppercase text-xs">Phòng tạo tác kỹ thuật số</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mt-2">Xưởng Gốm Mỹ Thiện</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto italic">Tự tay nhào nặn di sản qua từng đường nét, chọn men và nung gốm với sức mạnh AI.</p>
          </div>
          
          <PotteryStudio />
        </main>
        <Chatbot />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
