
import { GoogleGenAI, Chat, Type, Modality } from "@google/genai";
import React, { useEffect, useRef, useState } from 'react';

interface Message {
    role: 'user' | 'model';
    text: string;
    id: string;
}

// Các hàm hỗ trợ mã hóa và giải mã âm thanh
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const recognitionRef = useRef<any>(null);

    const updatePotteryTool = {
        name: 'updatePotteryConfig',
        parameters: {
            type: Type.OBJECT,
            description: 'Cập nhật cấu hình của bình gốm 3D để phù hợp với sở thích của người dùng.',
            properties: {
                shapeId: { type: Type.STRING },
                glazeId: { type: Type.STRING },
                patternId: { type: Type.STRING },
                patternColor: { type: Type.STRING },
            },
        },
    };

    useEffect(() => {
        if (!process.env.API_KEY) return;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const newChat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `Bạn là 'Nghệ nhân AI' của Làng gốm Mỹ Thiện. 
                1. VĂN HOÁ & LỊCH SỬ: Trả lời CHI TIẾT, GIÀU CẢM XÚC. 
                2. KỸ THUẬT: Trả lời CỰC KỲ NGẮN GỌN (tối đa 2 câu).
                Bạn luôn trả lời một cách ấm áp và truyền cảm.`,
                tools: [{ functionDeclarations: [updatePotteryTool] }],
            },
        });
        setChat(newChat);
        setMessages([
            { 
                id: 'welcome',
                role: 'model', 
                text: 'Chào khách quý! Tôi là Nghệ nhân AI của xưởng gốm Mỹ Thiện. Bạn muốn nghe tôi kể chuyện hay muốn tôi giúp nặn gốm?' 
            }
        ]);

        // Khởi tạo nhận diện giọng nói
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'vi-VN';
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
                setIsListening(false);
                handleSendMessageInternal(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const playVoice = async (text: string, messageId: string) => {
        if (isSpeakingId === messageId) {
            audioSourceRef.current?.stop();
            setIsSpeakingId(null);
            return;
        }

        setIsSpeakingId(messageId);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: `Đọc với giọng nghệ nhân truyền cảm, tốc độ nhanh vừa phải, rõ ràng: ${text}` }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const ctx = audioContextRef.current;
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                
                audioSourceRef.current?.stop();
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.onended = () => setIsSpeakingId(null);
                source.start();
                audioSourceRef.current = source;
            }
        } catch (error) {
            console.error("Lỗi phát giọng nói:", error);
            setIsSpeakingId(null);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const handleSendMessageInternal = async (text: string) => {
        if (!text.trim() || isLoading || !chat) return;

        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, role: 'user', text }]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: text });
            
            if (response.functionCalls) {
                for (const fc of response.functionCalls) {
                    if (fc.name === 'updatePotteryConfig') {
                        window.dispatchEvent(new CustomEvent('apply-pottery-config', { detail: fc.args }));
                    }
                }
            }

            const modelText = response.text || 'Tôi đã sẵn sàng!';
            const modelMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { 
                id: modelMsgId, 
                role: 'model', 
                text: modelText 
            }]);
            
            // Tự động phát giọng nói cho câu trả lời của model
            playVoice(modelText, modelMsgId);

        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'Xin lỗi, tôi chưa nghe rõ, bạn nói lại được không?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessageInternal(userInput);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] h-[70vh] max-h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col transition-all duration-300 z-50 overflow-hidden border border-zinc-100 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none translate-y-4'}`}>
                <div className="flex justify-between items-center p-6 bg-brand-terracotta text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-glaze rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/20">🏺</div>
                        <div>
                            <h3 className="font-serif font-bold text-lg">Nghệ nhân Mỹ Thiện</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Đang trực tuyến</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1 opacity-70 hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-zinc-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`group relative max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm transition-all ${msg.role === 'user' ? 'bg-brand-clay text-white rounded-tr-none' : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-100'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                
                                {msg.role === 'model' && (
                                    <button 
                                        onClick={() => playVoice(msg.text, msg.id)}
                                        className={`absolute -right-12 top-0 p-2.5 rounded-full transition-all shadow-md ${isSpeakingId === msg.id ? 'bg-orange-500 text-white animate-pulse' : 'bg-white text-zinc-400 hover:text-orange-500'}`}
                                    >
                                        {isSpeakingId === msg.id ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-5 py-2.5 rounded-full bg-white border border-zinc-100 flex gap-1.5 items-center shadow-sm">
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-brand-clay rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-5 bg-white border-t flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={toggleListening}
                        className={`p-3 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                        title="Nói với Nghệ nhân"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isListening ? "Đang nghe bạn nói..." : "Hỏi về Mỹ Thiện..."}
                        className="flex-1 px-5 py-3 bg-zinc-100 border-none rounded-xl focus:ring-2 focus:ring-brand-clay outline-none font-medium text-sm transition-all"
                        disabled={isLoading}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || !userInput.trim()}
                        className="bg-brand-terracotta text-white p-3.5 rounded-xl hover:scale-105 transition-all disabled:bg-zinc-300 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-terracotta text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50 ring-4 ring-white"
            >
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    {isSpeakingId && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-ping"></span>}
                </div>
            </button>
        </>
    );
};

export default Chatbot;
