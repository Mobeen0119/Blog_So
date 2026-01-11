import React, { useState, useEffect } from 'react';
import { Container, Cards, Button } from '../components';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import service from '../appwite/configu';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    service.listPosts([Query.equal("status", "active")]).then((response) => {
      if (response && response.success) {
        setPosts(response.data.documents);
      } else if (response && !response.success) {
        setError(response.error);
      }
    }).catch((error) => {
      console.error("Error fetching posts:", error);
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-8 w-full text-center mt-5 animate-fadeIn">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="font-bold text-3xl text-white animate-pulse">
                Loading posts...
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fadeInUp">
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-full mb-8">
            <h1 className="font-bold text-4xl text-white mb-4 animate-textGlow">
              Welcome to BlogSo
            </h1>
            <p className="text-xl text-white/80 mb-6 animate-fadeInUp animation-delay-300">
              Discover amazing posts from our community.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 rounded-lg border border-red-400 animate-shake">
                <p className="text-red-300">{error}</p>
              </div>
            )}
            <Link to="/create-post">
              <Button className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                ✨ Create New Post
              </Button>
            </Link>
          </div>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: `slideInUp 0.5s ease-out ${index * 100}ms both`
                }}
              >
                <Cards {...post} />
              </div>
            ))
          ) : (
            <div className="p-2 w-full text-center py-12 animate-fadeIn">
              <div className="bg-linear-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">No Posts Yet</h3>
                <p className="text-white/70 mb-6">Be the first to create a post!</p>
                <Link to="/create-post">
                  <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full">
                    Create First Post
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}