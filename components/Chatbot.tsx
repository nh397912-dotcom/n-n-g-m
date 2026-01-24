
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";

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

    // Cấu hình công cụ cập nhật model gốm cho AI
    const updatePotteryTool = {
        name: 'updatePotteryConfig',
        parameters: {
            type: Type.OBJECT,
            description: 'Cập nhật cấu hình của bình gốm 3D để phù hợp với sở thích của người dùng.',
            properties: {
                shapeId: {
                    type: Type.STRING,
                    description: 'ID của hình dáng bình: tyba, camlo, thap, namruou, giotnuoc, batgom',
                },
                glazeId: {
                    type: Type.STRING,
                    description: 'ID của màu men: ngoc, trangnga, vangtram, chusa, ran, thanhlam, tro, hophach, datnung',
                },
                patternId: {
                    type: Type.STRING,
                    description: 'ID của họa tiết: none, dragon, lotus, phoenix, waves, bamboo, chrysanthemum',
                },
                patternColor: {
                    type: Type.STRING,
                    description: 'Mã màu HEX cho họa tiết (ví dụ: #ffd700 cho Vàng Kim)',
                },
            },
        },
    };

    useEffect(() => {
        if (!process.env.API_KEY) {
            setHasApiKey(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `Bạn là 'Nghệ nhân AI' của Làng gốm Mỹ Thiện. 
                    Nhiệm vụ: Tư vấn cho người dùng cách phối dáng, men và họa tiết gốm đẹp, sang trọng và đúng văn hóa Quảng Ngãi.
                    
                    Danh mục trong xưởng:
                    - Dáng (Shapes): tyba (Tỳ bà), camlo (Cam lộ), thap (Thạp), namruou (Nậm rượu), giotnuoc (Giọt nước), batgom (Bát sen).
                    - Men (Glazes): ngoc (Men ngọc - xanh nhạt), trangnga (Trắng ngà), vangtram (Vàng tràm), chusa (Chu sa - đỏ đậm), ran (Men rạn cổ), thanhlam (Thanh lam - xanh ngọc bích), tro (Men tro), hophach (Hổ phách - vàng cam), datnung (Đất nung mộc).
                    - Họa tiết (Patterns): dragon (Rồng), lotus (Sen), phoenix (Phượng), waves (Sóng), bamboo (Trúc), chrysanthemum (Cúc).
                    - Màu họa tiết: Sử dụng các mã màu HEX đẹp (Vàng Kim: #ffd700, Đỏ: #ff0000, Xanh Coban: #0047ab, Trắng: #ffffff, v.v.).
                    
                    Quy tắc phối đồ mới:
                    1. Bình Tỳ bà nên đi với men Ngọc hoặc Thanh Lam, họa tiết Rồng hoặc Phượng màu Vàng Kim để thể hiện sự quyền quý.
                    2. Bát sen cổ nên đi với men Trắng Ngà, họa tiết Sen màu Hồng Phấn (#ffc0cb) hoặc Xanh Ngọc (#008080).
                    3. Men Vàng Tràm rất hợp với họa tiết Trúc (bamboo) màu Xanh Lá hoặc Đen để tạo vẻ thanh tao.
                    4. Men Chu Sa hợp với họa tiết Cúc Đại Đóa (chrysanthemum) màu Trắng hoặc Vàng Kim để tạo vẻ ấm áp.
                    5. Đất nung mộc không nên dùng họa tiết màu quá rực rỡ, nên dùng màu Đen hoặc Trắng.
                    
                    Khi người dùng yêu cầu tư vấn hoặc bạn thấy cần thay đổi, hãy sử dụng công cụ 'updatePotteryConfig' để cập nhật mô hình 3D.`,
                    tools: [{ functionDeclarations: [updatePotteryTool] }],
                },
            });
            setChat(newChat);
            setMessages([
                { role: 'model', text: 'Chào bạn! Tôi là Nghệ nhân AI của Làng gốm Mỹ Thiện. Tôi vừa cập nhật thêm họa tiết Trúc Quân Tử và Cúc Đại Đóa vào xưởng, bạn có muốn thử phối chúng lên bình gốm không?' }
            ]);
        } catch (error) {
            console.error("Lỗi khởi tạo Chat:", error);
            setHasApiKey(false);
        }
    }, []);

    // Lắng nghe sự kiện từ nút "Nhận tư vấn" ở PotteryStudio
    useEffect(() => {
        const handleArtisanConsult = async (e: any) => {
            const config = e.detail;
            setIsOpen(true);
            
            const contextMsg = `Tôi đang chọn: Dáng ${config.shape.name}, Men ${config.glaze.name}, Họa tiết ${config.pattern.name} màu ${config.patternColor}. Bạn thấy thế nào? Hãy tư vấn cho tôi một bộ phối đẹp nhất theo phong cách của bạn.`;
            
            // Tự động gửi tin nhắn ẩn để AI bắt đầu tư vấn
            handleSendMessageInternal(contextMsg);
        };

        window.addEventListener('artisan-consult', handleArtisanConsult);
        return () => window.removeEventListener('artisan-consult', handleArtisanConsult);
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessageInternal = async (text: string) => {
        if (!text.trim() || isLoading || !chat) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: text });
            
            // Xử lý gọi hàm nếu AI yêu cầu
            if (response.functionCalls) {
                for (const fc of response.functionCalls) {
                    if (fc.name === 'updatePotteryConfig') {
                        // Gửi sự kiện cập nhật sang PotteryStudio
                        window.dispatchEvent(new CustomEvent('apply-pottery-config', { detail: fc.args }));
                        
                        // Phản hồi lại cho AI để xác nhận
                        await chat.sendMessage({ 
                            message: `Đã cập nhật cấu hình gốm theo gợi ý của bạn: ${JSON.stringify(fc.args)}` 
                        });
                    }
                }
            }

            setMessages(prev => [...prev, { role: 'model', text: response.text || 'Tôi đã cập nhật mô hình theo ý bạn rồi nhé!' }]);
        } catch (error: any) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, lò nung đang quá nhiệt, tôi chưa thể tư vấn ngay được.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = userInput;
        setUserInput('');
        handleSendMessageInternal(text);
    };

    return (
        <>
            <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-center p-5 bg-brand-terracotta text-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-glaze rounded-full flex items-center justify-center text-xl">🏺</div>
                        <div>
                            <h3 className="font-bold">Nghệ nhân Mỹ Thiện (AI)</h3>
                            <p className="text-xs opacity-80">Đang trực tuyến</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-zinc-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-brand-clay text-white rounded-tr-none' : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-100'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-2 rounded-full bg-white border border-zinc-100 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-150"></span>
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
                        placeholder="Hỏi nghệ nhân cách phối dáng gốm..."
                        className="flex-1 px-4 py-2 border border-zinc-200 rounded-full focus:ring-2 focus:ring-brand-clay outline-none"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-brand-terracotta text-white p-2 rounded-full hover:scale-105 transition-transform disabled:bg-zinc-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-terracotta text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
            </button>
        </>
    );
};

export default Chatbot;
