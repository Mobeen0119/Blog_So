import React, { useState, useEffect } from "react";
import { Container, PostForm } from "../components";
import service from "../appwite/configu";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";

export default function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      service.getPost(slug).then((post) => {
        if (post) {
          setPosts(post);
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (!post) return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
       <span className="text-sm font-black tracking-[0.5em] animate-pulse">SYNCHRONIZING...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#18181b] pb-20 selection:bg-black selection:text-white">
      <nav className="border-b-2 border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Container>
          <div className="flex justify-between items-center py-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-black tracking-widest uppercase hover:opacity-50 transition-opacity"
            >
              <FiArrowLeft /> Back to Archive
            </button>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-zinc-400">EDIT_MODE / ACTIVE</span>
            </div>
          </div>
        </Container>
      </nav>

      <Container>
        <div className="mt-16 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-8 border-black pb-8">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-2">Revision System</p>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                Modify <br /> <span className="text-zinc-300 italic">Entry.</span>
              </h1>
            </div>
            <div className="text-right md:max-w-xs">
              <p className="text-xs font-bold leading-relaxed">
                You are currently editing <span className="bg-black text-white px-1 italic">"{post.title}"</span>. Changes will reflect immediately across the global feed.
              </p>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-4 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="mb-10 flex items-center gap-3 pb-4 border-b-2 border-zinc-100">
              <FiEdit3 className="text-2xl" />
              <h2 className="text-xl font-black uppercase tracking-tight">Configuration</h2>
            </div>
            
            <PostForm post={post} />
          </div>
          
          <div className="mt-16 flex justify-between items-center text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
            <span>Server: Appwrite_Cloud</span>
            <span>Ref: {post.$id}</span>
          </div>
        </div>
      </Container>
    </div>
  );
}