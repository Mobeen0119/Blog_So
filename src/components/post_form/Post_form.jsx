import React, { useCallback, useEffect, useState } from "react";
import { RTE, Button, Input } from "../index";
import { useForm } from "react-hook-form";
import service from "../../appwite/configu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || post?.slug || '',
            content: post?.content || '',
            images: post?.image || ''
        }
    });
    
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [imagePreview, setImagePreview] = useState(post?.image ? service.getfilePreview(post.image) : null);

    const submit = async (data) => {
        setSubmitError('');
        setLoading(true);
        
        console.log('Submitting form data:', data);
        
        try {
            if (!userData?.$id) {
                throw new Error('You must be logged in to create posts');
            }

            let imageId = post?.image || undefined;

            if (data.image && data.image[0]) {
                console.log('Uploading image...');
                const file = await service.uploadfile(data.image[0]);
                if (file) {
                    imageId = file.$id;
                    console.log('Image uploaded with ID:', imageId);
                    
                    if (post?.image) {
                        await service.deletefile(post.image);
                    }
                }
            }

            const postData = {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                content: data.content,
                status: 'active',
                userid: userData.$id,
                images: imageId || undefined 
            };

            console.log('Post data to save:', postData);

            let result;
            if (post) {
           
                console.log('Updating post:', post.$id);
                result = await service.updatePost(post.$id, postData);
            } else {
                console.log('Creating new post');
                result = await service.createPost(postData);
            }

            console.log('Post saved result:', result);
            
            if (result && result.success) {
                console.log('Post saved successfully, navigating...');
                navigate(`/post/${result.data.$id || result.data.slug}`);
            } else {
                throw new Error(result?.error || 'Failed to save post');
            }
        } catch (err) {
            console.error('Error submitting post:', err);
            setSubmitError(err.message || 'Failed to save post. Please try again.');
        } finally {
            setLoading(false);
        }
    };    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 100);
        }
        return '';
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title' && !post) { // Only auto-generate slug for new posts
                setValue('slug', slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue, post]);

    if (!userData) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-gray-700">Please login to create or edit posts.</p>
                <Button onClick={() => navigate('/login')} className="mt-4">
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                {post ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 mb-6">
                {post ? 'Update your post content' : 'Share your thoughts with the community'}
            </p>
            
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <div className="flex">
                        <div className="shrink">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{submitError}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(submit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a catchy title"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        {...register('title', { 
                            required: 'Title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' },
                            maxLength: { value: 200, message: 'Title is too long' }
                        })}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                {!post && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Slug <span className="text-gray-400">(auto-generated)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="url-friendly-name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            {...register('slug')}
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">This will be used in the post URL</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <RTE
                        control={control}
                        name="content"
                        defaultValue={post?.content}
                        error={errors.content}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {post ? "Update Featured Image" : "Featured Image"} 
                        {!post && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        {...register('image', { 
                            required: !post ? 'Image is required' : false 
                        })}
                        onChange={handleImageChange}
                    />
                    {errors.image && (
                        <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                    )}
                    
                    {(imagePreview || post?.image) && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                                src={imagePreview || service.getfilePreview(post.image)}
                                alt="Preview"
                                className="w-full max-w-md h-auto rounded-lg shadow"
                            />
                        </div>
                    )}
                </div>

                <input type="hidden" {...register('status')} value="active" />

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {post ? 'Updating...' : 'Publishing...'}
                            </>
                        ) : (
                            post ? 'Update Post' : 'Publish Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}