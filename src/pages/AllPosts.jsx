import React, { useState, useEffect } from 'react';
import { Container, Cards } from '../components';
import service from '../appwite/configu';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    service.listPosts().then((response) => {
      if (response && response.success) {
        setPosts(response.data.documents);
      } else if (response && !response.success) {
        setError(response.error);
      }
    }).catch((error) => {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
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
                Loading all posts...
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
              All Posts
            </h1>
            <p className="text-xl text-white/80 animate-fadeInUp animation-delay-300">
              Explore all posts from our community.
            </p>
          </div>
          {posts.map((post, index) => (
            <div
              key={post.$id}
              className={`p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 animate-slideInUp animation-delay-${index * 100}`}
            >
              <Cards {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
