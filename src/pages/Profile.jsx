import React, { useState, useEffect } from 'react';
import { Container, Button } from '../components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import service from '../appwite/configu';
import { FiPlus, FiLogOut, FiFileText } from 'react-icons/fi';

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    if (userData) {
      service.listPosts([Query.equal("userid", userData.$id)]).then((res) => {
        if (res?.success) {
          setPosts(res.data.documents);
          setStats({ total: res.data.documents.length });
        }
      });
    }
  }, [userData]);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-blue-500">
      <Container>
        
        <nav className="flex justify-between items-center py-8 mb-10">
          <button 
            onClick={() => window.history.back()} 
            className="text-xs font-black tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
          >
            ← Back to Feed
          </button>
          <div className="flex items-center gap-2 text-zinc-500">
             <span className="text-xs font-mono uppercase">{userData.name}</span>
             <FiLogOut className="w-4 h-4 cursor-pointer hover:text-red-500" />
          </div>
        </nav>

        <header className="mb-20">
          <p className="text-blue-500 font-black text-xs tracking-[.4em] mb-4 uppercase">Identity Profile</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter italic">
              {userData.name.split(' ')[0]}<span className="text-zinc-800">.</span>
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light">{stats.total}</span>
              <span className="text-zinc-500 uppercase font-black text-[10px] tracking-widest">Total Posts</span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
            <Link to="/create-post">
              <button className="group w-full bg-blue-600 hover:bg-blue-500 text-white p-10 rounded-3xl flex flex-col justify-between h-[300px] transition-all duration-500 shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
                <FiPlus className="text-4xl group-hover:rotate-90 transition-transform duration-500" />
                <div className="text-left">
                  <p className="text-xl font-bold leading-tight">Create<br />New Post</p>
                  <p className="text-blue-200 text-xs mt-2 font-medium">Share your thoughts with the world</p>
                </div>
              </button>
            </Link>
          </div>

          <div className="lg:col-span-8">
            <h3 className="text-zinc-600 font-black text-[10px] tracking-[.3em] uppercase mb-8">Recent Archives</h3>
            
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <Link 
                    key={post.$id} 
                    to={`/post/${post.$id}`} 
                    className="flex items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <FiFileText className="text-zinc-500 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{post.title}</h4>
                        <p className="text-xs text-zinc-600 mt-1">{new Date(post.$createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-zinc-700 font-black group-hover:text-white transition-colors">→</span>
                  </Link>
                ))}
              </div>
            ) : (
             
              <div className="h-75 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-700">
                <FiFileText className="text-4xl mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">No posts detected in database</p>
              </div>
            )}
          </div>
        </section>

      </Container>
    </div>
  );
}