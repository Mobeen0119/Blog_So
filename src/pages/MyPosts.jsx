import React, { useState, useEffect } from 'react';
import { Container, Cards } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import service from '../appwite/configu';
import { Query } from 'appwrite';

export default function MyPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      service.listPosts([Query.equal("userid", userData.$id)])
        .then((response) => {
          if (response?.success) {
            setPosts(response.data.documents);
          } else {
            setError(response?.error || "ACCESS DENIED");
          }
        })
        .catch(() => setError("CONNECTION_LOST"))
        .finally(() => setLoading(false));
    }
  }, [userData]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <h1 className="text-white text-7xl md:text-9xl font-black italic tracking-tighter animate-pulse">
        SCANNING...
      </h1>
    </div>
  );

  return (
    <div className="py-12 bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Container>
        
        <header className="mb-20 border-b-8 border-white pb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="text-xs font-black tracking-[0.3em] text-zinc-500 hover:text-white mb-6 block uppercase"
            >
              ← Return
            </button>
            <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.8]">
              My <br /> Archives<span className="text-zinc-800">.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold uppercase">{userData?.name}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-l border-t border-zinc-800">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.$id}
                className="group border-r border-b border-zinc-800 p-8 hover:bg-zinc-950 transition-all duration-300 relative overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-[10px] font-mono text-zinc-800 group-hover:text-zinc-500">
                  {post.$id.slice(-4).toUpperCase()}
                </span>
                
                <Cards {...post} />
                
                <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">View Artifact</span>
                   <span className="text-xl">→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 border-r border-b border-zinc-800 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-black uppercase text-zinc-800 mb-8">No Data Found</h2>
              <button 
                onClick={() => navigate("/create-post")}
                className="bg-white text-black px-12 py-5 text-xl font-black hover:invert transition-all"
              >
                FIRST POST
              </button>
            </div>
          )}
        </div>

        {posts.length > 0 && (
          <footer className="mt-20 pt-10 border-t border-zinc-800 flex justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            <span>Total Entries: {posts.length}</span>
            <span>System Status: Online</span>
          </footer>
        )}
        
      </Container>
    </div>
  );
}