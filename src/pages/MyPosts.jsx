import React, { useState, useEffect } from 'react';
import { Container, Cards } from '../components';
import { useSelector } from 'react-redux';
import service from '../appwite/configu';
import { Query } from 'appwrite';

export default function MyPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      service.listPosts([Query.equal("userid", userData.$id)])
        .then((response) => {
          if (response && response.success) {
            setPosts(response.data.documents);
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
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="font-bold text-3xl text-white animate-pulse">
                Loading your posts...
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 animate-fadeIn">
        <Container>
          <div className="p-2 w-full text-center">
            <p className="text-red-400 text-xl">{error}</p>
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
              My Posts
            </h1>
            <p className="text-xl text-white/80 animate-fadeInUp animation-delay-300">
              Manage and view all your created posts.
            </p>
          </div>
          
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post.$id}
                className={`p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 animate-slideInUp`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Cards {...post} />
              </div>
            ))
          ) : (
            <div className="p-2 w-full text-center py-12">
              <p className="text-white/60 text-xl">You haven't created any posts yet.</p>
              <p className="text-white/40 mt-2">Create your first post to see it here!</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}