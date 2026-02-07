import React, { useState, useEffect } from 'react';
import { Container, Cards } from '../components';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import service from '../appwite/configu';
import { FiPlus, FiArrowDown } from 'react-icons/fi';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    service.listPosts([Query.equal("status", "active")]).then((response) => {
      if (response?.success) {
        setPosts(response.data.documents);
      } else {
        setError(response?.error || "CONNECTION ERROR");
      }
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <h1 className="text-white text-7xl md:text-9xl font-black italic tracking-tighter animate-pulse uppercase">Syncing...</h1>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black pb-20">
      
      <section className="pt-20 pb-32 border-b-8 border-white">
        <Container>
          <div className="flex flex-col gap-10">
            <div className="flex  justify-end">
               <Link to="/create-post" className="hidden md:block">
                  <button className="bg-white text-black px-8 py-4 font-black text-sm uppercase hover:bg-zinc-200 transition-all flex items-center gap-2">
                    <FiPlus strokeWidth={3} /> New Entry
                  </button>
               </Link>
            </div>
            
            <h1 className="text-7xl md:text-[180px] font-black uppercase tracking-tighter leading-[0.8] mb-10">
              Blog<span className="text-zinc-800">So</span><br />Digital.
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <p className="max-w-xl text-xl md:text-2xl font-bold text-zinc-400 leading-tight uppercase">
                A  space for personal thoughts and shared intelligence.
              </p>
              <div className="flex items-center gap-4 animate-bounce text-zinc-600">
                <span className="text-[10px] font-black tracking-widest uppercase">Scroll to Explore</span>
                <FiArrowDown />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {error && (
        <div className="bg-red-600 text-white text-center py-4 font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      <section className="py-0">
        <Container>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-zinc-800">
              {posts.map((post, index) => (
                <div 
                  key={post.$id} 
                  className="border-r border-b border-zinc-800 p-8 hover:bg-zinc-950 transition-all duration-300 group relative"
                >
                  <div className="absolute top-4 left-8 text-[9px] font-mono text-zinc-700">
                    CAT_00{index + 1}
                  </div>
                  <Cards {...post} />
                  <div className="mt-8 pt-6 border-t border-zinc-900 group-hover:border-white transition-colors">
                     <Link to={`/post/${post.$id}`} className="text-[10px] font-black tracking-widest uppercase flex items-center justify-between">
                        Read Full Story <span>→</span>
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-x border-b border-zinc-800">
              <h2 className="text-5xl font-black text-zinc-800 uppercase mb-10 tracking-tighter">Zero Data Detected</h2>
              <Link to="/create-post">
                <button className="bg-white text-black px-16 py-8 text-2xl font-black hover:invert transition-all">
                  INITIALIZE
                </button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Link to="/create-post">
          <button className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl border-4 border-black">
            <FiPlus size={24} strokeWidth={3} />
          </button>
        </Link>
      </div>
    </div>
  );
}