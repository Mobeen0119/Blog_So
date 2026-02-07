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
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError("POST NOT FOUND");
                }
                setLoading(false);
            }).catch(() => {
                setError("CONNECTION ERROR");
                setLoading(false);
            });
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <h1 className="text-white text-8xl font-black italic">LOADING...</h1>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
                <h1 className="text-red-600 text-7xl font-black mb-12">{error}</h1>
                <Button 
                    onClick={() => navigate("/")} 
                    className="bg-white text-black text-3xl font-black px-16 py-8 border-8 border-white hover:invert transition-all"
                >
                    BACK TO HOME
                </Button>
            </div>
        );
    }

    const imageSource = Array.isArray(post.images) ? post.images[0] : (post.images || post.image);

    return (
        <div className="py-16 bg-zinc-950 min-h-screen text-white">
            <Container>
                <div className="mb-12">
                    <Button 
                        onClick={() => navigate("/")} 
                        className="bg-white text-black text-2xl font-black px-12 py-5 border-4 border-white hover:bg-transparent hover:text-white transition-all"
                    >
                        ← GO BACK
                    </Button>
                </div>

                <div className="w-full bg-zinc-900 border-[10px] border-white rounded-[50px] overflow-hidden">
                    
                    {imageSource && (
                        <div className="w-full bg-black border-b-[10px] border-white flex justify-center">
                            <img
                                src={service.getfilePreview(imageSource)}
                                alt={post.title}
                                className="w-full h-auto max-h-[800px] object-contain"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}

                    <div className="p-12 md:p-24">
                        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-16">
                            {post.title}
                        </h1>

                        <div className="flex gap-6 mb-16">
                            <span className="bg-white text-black font-black px-8 py-3 text-2xl">
                                {post.status?.toUpperCase()}
                            </span>
                            <span className="border-4 border-white text-white font-black px-8 py-3 text-2xl">
                                {new Date(post.$createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl leading-[1.4] font-bold text-zinc-200 browser-css">
                            {parse(post.content || "")}
                        </div>

                        <div className="mt-32 text-center">
                             <Button 
                                onClick={() => navigate("/")} 
                                className="bg-zinc-800 text-white text-2xl font-black px-12 py-6 border-4 border-white hover:bg-white hover:text-black transition-all"
                            >
                                FINISHED READING
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}