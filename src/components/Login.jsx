import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as authLogin } from '../store/slicer';
import authService from '../appwite/auth';
import { useForm } from 'react-hook-form';
import { Button, Input, Logo } from './index.jsx';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.auth.status);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
    }, [authStatus]);

const login = async (data) => {
    setError('');
    setLoading(true);
    try {
        const response = await authService.login(data);
        console.log('Login response:', response);
        
        if (response.success) {
            let userData = response.data;
            
            if (!userData) {
                userData = {
                    $id: 'temp-' + Date.now(),
                    email: data.email,
                    name: data.email.split('@')[0]
                };
            }
            
            console.log('Dispatching login with user:', userData);
            dispatch(authLogin({ userData }));
            
            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));
            
            navigate('/');
        } else {
            setError(response.error || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('Login failed. ' + (err.message || ''));
    } finally {
        setLoading(false);
    }
}

    return (
        <div className="w-full min-h-screen flex items-center filter backdrop-blur-3xl justify-center bg-linear-to-br from-black via-purple-900 to-pink-800 p-4 relative overflow-hidden">
            <div className="max-w-md w-full p-8 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-8 ">
                    <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
                    <Logo width='180px' className="mx-auto mb-6" />
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 rounded-lg border border-red-400">
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}
                </div>
                
                <form onSubmit={handleSubmit(login)} className='space-y-6'>
                    <Input
                        label='Email'
                        type='email'
                        placeholder="Enter your email"
                        className='w-full'
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message}
                    />
                    
                    <Input
                        label='Password'
                        type='password'
                        placeholder="Enter your password"
                        className='w-full'
                        {...register('password', { required: 'Password is required' })}
                        error={errors.password?.message}
                    />
                    
                    <Button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    
                    <div className="text-center">
                        <Link to="/signup" className="text-blue-300 hover:text-blue-200">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}