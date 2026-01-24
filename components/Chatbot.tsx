
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface Message {
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [hasApiKey, setHasApiKey] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            setHasApiKey(false);
            setMessages([
                { role: 'model', text: 'Chào bạn! Có vẻ như hệ thống chưa được cấu hình API Key. Vui lòng thêm biến môi trường API_KEY trên Vercel để tôi có thể trò chuyện cùng bạn.' }
            ]);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `Bạn là 'Sứ giả Gốm Mỹ Thiện'. 
                    Nhiệm vụ: Giới thiệu lịch sử 200 năm của làng gốm Mỹ Thiện tại Quảng Ngãi. 
                    Phong cách: Thân thiện, am hiểu sâu sắc về kỹ thuật làm gốm (nung lò bầu, tráng men hỏa biến, đắp nổi).
                    Luôn trả lời bằng tiếng Việt trang trọng nhưng gần gũi. 
                    Nếu người dùng hỏi về mua hàng, hãy nói rằng đây là website giới thiệu văn hóa và khuyến khích họ đến thăm làng gốm trực tiếp tại thị trấn Châu Ổ.`,
                },
            });
            setChat(newChat);
            setMessages([
                { role: 'model', text: 'Chào bạn! Tôi là Sứ giả của Làng gốm Mỹ Thiện. Tôi có thể giúp bạn tìm hiểu gì về nghệ thuật đất và lửa của quê hương Quảng Ngãi?' }
            ]);
        } catch (error) {
            console.error("Lỗi khởi tạo Chat:", error);
            setHasApiKey(false);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat || !hasApiKey) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: userInput });
            const modelMessage: Message = { role: 'model', text: response.text || 'Tôi chưa tìm được câu trả lời phù hợp.' };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            console.error('Chatbot error:', error);
            let errorMessage = 'Lò nung đang quá nhiệt, xin hãy đợi một chút rồi hỏi lại nhé!';
            if (error.message?.includes('403')) {
                errorMessage = 'Lỗi xác thực API Key. Vui lòng kiểm tra lại cấu hình API trên Vercel.';
            }
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-center p-5 bg-brand-terracotta text-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-glaze rounded-full flex items-center justify-center text-xl">🏺</div>
                        <div>
                            <h3 className="font-bold">Sứ giả Mỹ Thiện</h3>
                            <p className="text-xs opacity-80">Trực tuyến</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-brand-glaze bg-opacity-30">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-brand-clay text-white rounded-tr-none' : 'bg-white text-brand-dark rounded-tl-none border border-gray-100'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-150"></span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2 rounded-b-2xl">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={hasApiKey ? "Khám phá gốm Mỹ Thiện..." : "API chưa được cấu hình..."}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-brand-clay outline-none disabled:bg-gray-100"
                        disabled={!hasApiKey || isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!hasApiKey || isLoading}
                        className="bg-brand-terracotta text-white p-2 rounded-full hover:scale-105 transition-transform disabled:bg-gray-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-terracotta text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50 group"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {hasApiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full border-2 border-white animate-ping"></span>}
                </div>
            </button>
        </>
    );
};

export default Chatbot;
