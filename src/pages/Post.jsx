import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import service from "../appwite/configu";
import { Button, Container } from "../components";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            service.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) setPost(fetchedPost);
                else setError("404: POST NOT FOUND");
                setLoading(false);
            }).catch(() => {
                setError("SYSTEM ERROR: OFFLINE");
                setLoading(false);
            });
        }
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <h1 className="text-white text-6xl md:text-9xl font-black italic tracking-tighter animate-pulse">LOADING...</h1>
        </div>
    );

    if (error || !post) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
            <h1 className="text-white text-5xl md:text-8xl font-black mb-10 border-b-8 border-red-600 pb-4">{error}</h1>
            <button 
                onClick={() => navigate("/")} 
                className="bg-white text-black text-2xl font-black px-12 py-6 hover:bg-red-600 hover:text-white transition-all duration-300"
            >
                RETURN 
            </button>
        </div>
    );

    const imageSource = Array.isArray(post.images) ? post.images[0] : (post.images || post.image);

    return (
        <div className="bg- min-h-screen text-white pb-20 selection:bg-white selection:text-black">
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b-4 border-zinc-800">
                <Container>
                    <div className="flex justify-between items-center py-6">
                        <button 
                            onClick={() => navigate("/")} 
                            className="text-sm font-black tracking-widest uppercase hover:text-zinc-400 transition-colors"
                        >
                            ← BACK 
                        </button>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase hidden md:block">
                            ENTRY ID: {post.$id.slice(0, 12)}
                        </span>
                    </div>
                </Container>
            </div>

            <Container>
                <article className="mt-12 max-w-5xl mx-auto">
                    <div className="mb-16">
                        <div className="flex gap-4 mb-8">
                            <span className="bg-white text-black font-black px-4 py-1 text-xs tracking-tighter uppercase">
                                {post.status || "Active"}
                            </span>
                            <span className="text-zinc-500 font-mono text-xs uppercase pt-1">
                                {new Date(post.$createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.85] break-words">
                            {post.title}
                        </h1>
                    </div>

                    {imageSource && (
                        <div className="w-full bg-zinc-900 border-[6px] border-zinc-800 mb-20">
                            <img
                                src={service.getfilePreview(imageSource)}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-2">
                             <div className="h-1 bg-zinc-800 w-full hidden lg:block mb-4" />
                             <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                                Original Content <br /> No AI generated text.
                             </p>
                        </div>
                        
                        <div className="lg:col-span-10 prose prose-invert prose-2xl max-w-none">
                            <div className="text-2xl md:text-4xl leading-[1.3] font-medium text-zinc-100 antialiased first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
                                {parse(post.content || "")}
                            </div>
                        </div>
                    </div>

                    <div className="mt-32 pt-16 border-t-8 border-zinc-900 flex justify-center">
                        <button 
                            onClick={() => navigate("/")} 
                            className="bg-white text-black text-3xl font-black px-16 py-8 hover:scale-95 transition-transform duration-200"
                        >
                            Finished Reading
                        </button>
                    </div>
                </article>
            </Container>
        </div>
    );
}