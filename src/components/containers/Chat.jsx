import React, { useState, useEffect, useRef } from "react";
import { ID, Query } from "appwrite";
import service from "../../appwite/configu"; 
import authService from "../../appwite/auth";

const styles = `
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 4px; }
  
  .chat-row { transition: all 0.2s ease; }
  .delete-trigger { opacity: 0; transform: scale(0.8); transition: 0.2s ease; }
  .chat-row:hover .delete-trigger { opacity: 1; transform: scale(1); }

  @media (max-width: 768px) {
    .delete-trigger { opacity: 1; transform: scale(1); } /* Always show on touch devices */
  }
`;

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const scrollRef = useRef(null);

    const DB_ID = "69496f7400231e37fc97"; 
    const MSG_COL_ID = "messages"; 
    const PROF_COL_ID = "profiles";

    useEffect(() => {
        const init = async () => {
            try {
                const user = await authService.getUser();
                if (user?.$id) {
                    setCurrentUser(user);
                    const res = await service.databases.listDocuments(DB_ID, PROF_COL_ID, [
                        Query.notEqual("userId", user.$id)
                    ]);
                    setProfiles(res.documents);
                }
            } catch (err) { console.error(err); }
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedUser || !currentUser) return;
        const myId = currentUser.$id;
        const targetId = selectedUser.userId;

        const chatQueries = [
            Query.or([
                Query.and([Query.equal("sender_id", myId), Query.equal("receiver_id", targetId)]),
                Query.and([Query.equal("sender_id", targetId), Query.equal("receiver_id", myId)])
            ]),
            Query.orderAsc("$createdAt")
        ];

        service.databases.listDocuments(DB_ID, MSG_COL_ID, chatQueries).then(res => setMessages(res.documents));

        const unsubscribe = service.client.subscribe(`databases.${DB_ID}.collections.${MSG_COL_ID}.documents`, (res) => {
            if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
                setMessages((prev) => prev.filter(m => m.$id !== res.payload.$id));
                return;
            }
            if (res.events.includes("databases.*.collections.*.documents.*.create")) {
                const newMsg = res.payload;
                const isRel = (newMsg.sender_id === myId && newMsg.receiver_id === targetId) || (newMsg.sender_id === targetId && newMsg.receiver_id === myId);
                if (isRel) setMessages((prev) => [...prev, newMsg]);
            }
        });
        return () => unsubscribe();
    }, [selectedUser, currentUser]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const val = text;
            setText("");
            await service.databases.createDocument(DB_ID, MSG_COL_ID, ID.unique(), {
                content: val,
                sender_id: currentUser.$id,
                sender_name: currentUser.name,
                receiver_id: selectedUser.userId,
            });
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try { await service.databases.deleteDocument(DB_ID, MSG_COL_ID, id); } 
        catch (err) { console.error(err); }
    };

    if (!currentUser) return null;

    return (
        <div className="h-screen w-full bg-[#0f1115] text-slate-200 flex overflow-hidden font-sans">
            <style>{styles}</style>
            
            <aside className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-87 lg:w-110 border-r border-white/5 bg-[#14171c] flex-col shrink-0`}>
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white">M</div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Chatter</h1>
                    </div>
                    <input 
                        className="w-full bg-[#1c1f26] border border-white/5 rounded-xl px-5 py-3 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                        placeholder="Search conversations..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
                    {profiles.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                        <button 
                            key={p.$id}
                            onClick={() => setSelectedUser(p)}
                            className={`w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl mb-2 transition-all ${selectedUser?.userId === p.userId ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5'}`}
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${selectedUser?.userId === p.userId ? 'bg-white/20' : 'bg-[#1c1f26] text-slate-400'}`}>
                                {p.name[0].toUpperCase()}
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-md md:text-lg capitalize truncate">{p.name}</div>
                                <div className={`text-[10px] md:text-xs ${selectedUser?.userId === p.userId ? 'text-indigo-100' : 'text-slate-500'}`}>Active Now</div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <main className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col bg-[#0f1115]`}>
                {selectedUser ? (
                    <>
                        <header className="h-20 md:h-24 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#0f1115]/50 backdrop-blur-xl shrink-0">
                            <div className="flex items-center gap-4 md:gap-5">
                                <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                                </button>
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-lg md:text-xl uppercase">
                                    {selectedUser.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight capitalize">{selectedUser.name}</h2>
                                    <span className="hidden md:inline text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Secure Channel</span>
                                </div>
                            </div>
                            <button onClick={() => window.history.back()} className="px-4 md:px-6 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-[10px] md:text-xs font-bold transition-all border border-white/5">EXIT</button>
                        </header>

                        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 space-y-4 md:space-y-6 custom-scrollbar">
                            {messages.map((m) => {
                                const isMe = m.sender_id === currentUser.$id;
                                return (
                                    <div key={m.$id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`chat-row group relative flex items-center gap-4 md:gap-8 px-4 py-3 md:px-6 md:py-5 rounded-2xl max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse text-right border-r-4 border-l-0 border-indigo-600 bg-indigo-600/5" : "flex-row text-left border-l-4 border-slate-700 bg-white/5"}`}>
                                            <div className="flex-1">
                                                <div className={`flex items-center gap-3 mb-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-indigo-400' : 'text-slate-400'}`}>{isMe ? 'You' : selectedUser.name}</span>
                                                    <span className="text-[9px] text-slate-600 font-bold">{new Date(m.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-[15px] md:text-[17px] text-slate-200 leading-relaxed font-medium">{m.content}</p>
                                            </div>
                                            {isMe && (
                                                <button onClick={() => handleDelete(m.$id)} className="delete-trigger p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        <div className="p-4 md:p-10 border-t border-white/5 bg-[#14171c]/30">
                            <form onSubmit={sendMessage} className="flex gap-3 md:gap-4">
                                <input 
                                    className="flex-1 bg-[#1c1f26] border border-white/5 px-5 md:px-8 py-4 md:py-5 rounded-2xl text-sm md:text-[16px] text-white outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="Message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <button type="submit" disabled={!text.trim()} className={`px-6 md:px-12 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-sm transition-all ${text.trim() ? "bg-indigo-600 text-white" : "bg-[#1c1f26] text-slate-700 cursor-not-allowed uppercase"}`}>SEND</button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center opacity-10">
                        <h2 className="text-2xl font-black uppercase tracking-[1em]">Standby</h2>
                    </div>
                )}
            </main>
        </div>
    );
}