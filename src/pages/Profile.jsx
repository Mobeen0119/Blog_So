import React, { useState, useEffect } from 'react';
import { Container, Button } from '../components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import service from '../appwite/configu';
import { FiUser, FiEdit, FiFileText, FiTrendingUp } from 'react-icons/fi';

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalPosts: 0, activePosts: 0 });

  useEffect(() => {
    if (userData) {
      service.listPosts([Query.equal("userid", userData.$id)])
        .then((response) => {
          if (response && response.success) {
            setPosts(response.data.documents);
            // Calculate stats
            const totalPosts = response.data.documents.length;
            const activePosts = response.data.documents.filter(post => post.status === 'active').length;
            setStats({ totalPosts, activePosts });
          } else if (response && !response.success) {
            setError(response.error);
          }
        })
        .catch((error) => {
          console.error("Error fetching user posts:", error);
          setError("Failed to load your posts. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="py-8 w-full text-center mt-5 animate-fadeIn">
        <Container>
          <div className="flex flex-wrap justify-center">
            <div className="p-2 w-full">
              <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 mx-auto mb-4 animate-pulse"></div>
              <h1 className="font-bold text-3xl text-white animate-pulse">
                Loading profile...
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="py-8 animate-fadeIn">
        <Container>
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Please login to view profile</h1>
            <Link to="/login">
              <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Go to Login
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fadeInUp">
      <Container>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 p-6 bg-linear-to-r from-purple-900/30 to-pink-900/30 rounded-2xl backdrop-blur-sm border border-white/10 animate-slideInDown">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg animate-pulseHover">
              {userData?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-bold text-3xl text-white animate-textGlow">
                Welcome back, <span className="bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{userData?.name || 'User'}</span>!
              </h1>
              <p className="text-white/80 mt-1">@{userData?.username || 'user'}</p>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <div className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 animate-fadeInUp animation-delay-100">
              <FiFileText className="w-6 h-6 text-blue-300 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-white/60 text-sm">Total Posts</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 animate-fadeInUp animation-delay-200">
              <FiTrendingUp className="w-6 h-6 text-green-300 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{stats.activePosts}</div>
              <div className="text-white/60 text-sm">Active</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 rounded-xl border border-red-400 backdrop-blur-sm animate-shake">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="mb-8 animate-fadeInUp animation-delay-300">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/create-post">
              <Button className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                <FiEdit className="inline mr-2" /> Create New Post
              </Button>
            </Link>
            <Link to="/my-posts">
              <Button variant="outline" className="border-white/30 hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <FiFileText className="inline mr-2" /> View My Posts
              </Button>
            </Link>
          </div>
        </div>

        <div className="animate-fadeInUp animation-delay-500">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FiFileText className="mr-3 text-blue-300" /> Your Recent Posts
          </h2>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post, index) => (
                <div 
                  key={post.$id} 
                  className="bg-linear-to-br from-white/5 to-transparent p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `slideInUp 0.5s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-lg truncate">{post.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-white/70 mb-4 line-clamp-2">
                    {post.content?.replace(/<[^>]*>/g, '').substring(0, 120) || 'No content available'}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">
                      {new Date(post.$createdAt).toLocaleDateString()}
                    </span>
                    <Link 
                      to={`/post/${post.$id}`} 
                      className="text-yellow-300 hover:text-yellow-200 font-medium text-sm transition-all duration-300 hover:scale-105"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-linear-to-br from-white/5 to-transparent rounded-2xl backdrop-blur-sm border border-white/10 animate-fadeIn">
              <FiFileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
              <p className="text-white/60 mb-6">Start sharing your thoughts with the community!</p>
              <Link to="/create-post">
                <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Your First Post
                </Button>
              </Link>
            </div>
          )}
          
          {posts.length > 6 && (
            <div className="text-center mt-8">
              <Link to="/my-posts">
                <Button variant="outline" className="border-white/30 hover:bg-white/10">
                  View All Posts ({posts.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}