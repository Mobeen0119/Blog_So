import React, { useState, useEffect } from 'react';
import { Container, Cards } from '../components';
import { useNavigate } from 'react-router-dom';
import service from '../appwite/configu';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    service.listPosts().then((response) => {
      if (response && response.success) {
        setPosts(response.data.documents);
      } else if (response && !response.success) {
        setError(response.error);
      }
    }).catch(() => {
      setError("FAILED TO SYNC DATA");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
      <h1 className="text-black text-6xl md:text-9xl font-black italic tracking-tighter animate-pulse">FETCHING...</h1>
    </div>
  );

  return (
    <div className="py-12 bg-[#f4f4f5] min-h-screen text-[#18181b] selection:bg-black selection:text-white">
      <Container>
        
        <header className="mb-20 border-b-8 border-black pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-4xl">
            <button 
              onClick={() => navigate(-1)} 
              className="text-[10px] font-black tracking-[0.3em] text-zinc-400 hover:text-black mb-6 block uppercase transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter leading-[0.8]">
              Public <br /> Feed<span className="text-orange-500">.</span>
            </h1>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-xl font-bold uppercase flex items-center gap-2">
               <span className="w-3 h-3 bg-green-500 rounded-full inline-block" /> Global
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-l border-t border-black">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.$id} 
                className="group border-r border-b border-black p-8 bg-white hover:bg-[#f9f9fb] transition-all duration-300 relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-mono font-bold text-zinc-300">#{post.$id.slice(-4).toUpperCase()}</span>
                  <div className="w-6 h-6 border-2 border-black flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    +
                  </div>
                </div>

                <Cards {...post} />

              </div>
            ))
          ) : (
            <div className="col-span-full py-40 border-r border-b border-black flex flex-col items-center justify-center bg-white">
              <h2 className="text-4xl font-black uppercase text-zinc-200 mb-8 tracking-tighter">No Active Nodes</h2>
              {error && <p className="text-red-500 font-mono text-xs mb-4">{error}</p>}
            </div>
          )}
        </div>

        <footer className="mt-20 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest gap-4">
          <div className="flex gap-10">
            <span>Total Broadcasts: {posts.length}</span>
            <span>Region: Global</span>
          </div>
          <span className="text-black">© BLOGSO_</span>
        </footer>

      </Container>
    </div>
  );
}