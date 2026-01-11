import React, { useState, useEffect } from "react";
import { Button, Container } from "../components";
import service from "../appwite/configu";
import { Link, useParams, useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import { useSelector } from "react-redux";

export default function Post() { 
    const [post, setPost] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false; // Changed from Author to isAuthor, and userId to userid

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                try {
                    setLoading(true);
                    const fetchedPost = await service.getPost(slug);
                    if (fetchedPost) {
                        setPost(fetchedPost);
                    } else {
                        setError('Post not found');
                        setTimeout(() => navigate("/"), 2000);
                    }
                } catch (err) {
                    console.error('Error fetching post:', err);
                    setError('Failed to load post. Please try again.');
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/");
            }
        };

        fetchPost();
    }, [slug, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await service.deletePost(post.$id);
                navigate('/');
            } catch (err) {
                console.error('Error deleting post:', err);
                setError('Failed to delete post. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="py-8 w-full text-center mt-5 animate-fadeIn">
                <Container>
                    <div className="flex flex-wrap justify-center">
                        <div className="p-2 w-full">
                            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <h1 className="font-bold text-3xl text-white animate-pulse">
                                Loading post...
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="py-8 animate-fadeIn">
                <Container>
                    <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-700/50 backdrop-blur-sm">
                        <h1 className="text-2xl font-bold text-red-300 mb-4">Post Not Found</h1>
                        <p className="text-white/80 mb-6">{error || 'The post you are looking for does not exist.'}</p>
                        <Button 
                            onClick={() => navigate('/')}
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            ← Back to Home
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-8 animate-fadeInUp">
            <Container>
                <div className="w-full p-6 md:p-8 bg-linear-to-br from-white/5 to-transparent rounded-3xl shadow-2xl border border-white/20 backdrop-blur-lg">
                    <div className="mb-8 animate-slideInDown">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Link to="/" className="text-blue-300 hover:text-blue-200 hover:underline text-sm transition-all duration-300">
                                    ← Back to all posts
                                </Link>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 text-xs rounded-full ${post.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                    {post.status}
                                </span>
                                <span className="text-white/50 text-sm">
                                    {new Date(post.$createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        
                        <h1 className="font-bold text-4xl md:text-5xl text-white mb-4 animate-textGlow">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {post.userName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-white font-medium">{post.userName || 'Unknown Author'}</p>
                                <p className="text-white/60 text-sm">@{post.username || 'user'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.image && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl animate-fadeInUp animation-delay-100">
                            <img 
                                src={service.getfileview(post.image)} 
                                alt={post.title} 
                                className="w-full h-auto max-h-125 object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none mb-8 animate-fadeInUp animation-delay-200">
                        <div className="text-white/90 leading-relaxed text-lg">
                            {parse(post.content || '')}
                        </div>
                    </div>

                    {isAuthor && (
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10 animate-fadeInUp animation-delay-300">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full">
                                    ✏️ Edit Post
                                </Button>
                            </Link>
                            <Button 
                                onClick={handleDelete}
                                className="bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-3 rounded-full"
                            >
                                🗑️ Delete Post
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/50 rounded-xl border border-red-400 animate-shake">
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}
// In your Post.jsx component
<img 
    src={post.images ? service.getfileview(post.images) : 'placeholder.jpg'} 
    alt={post.title} 
/>
                    <div className="mt-8 text-center">
                        <Button 
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="border-white/30 hover:bg-white/10 text-white"
                        >
                            ← View All Posts
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}