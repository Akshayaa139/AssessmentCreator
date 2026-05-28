"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';

const Login = () => {
    const { login } = useAppStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login(name || 'Professor', email);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-[#FB7A58] tracking-tighter">VedaAI</h1>
                    <p className="text-gray-500 font-medium">Academic Assessment Toolkit</p>
                </div>

                <div className="card p-8 shadow-2xl shadow-[#FB7A58]/5">
                    <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Dr. Jane Smith"
                                    className="input-field pl-10 h-12"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="professor@university.edu"
                                    className="input-field pl-10 h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-10 h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-gray-500 cursor-pointer hover:text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300 text-[#FB7A58] focus:ring-[#FB7A58]" />
                                <span>Remember me</span>
                            </label>
                            <button type="button" className="text-[#FB7A58] font-bold hover:underline">Forgot password?</button>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary h-12 flex items-center justify-center space-x-2 shadow-lg shadow-[#FB7A58]/20 group"
                        >
                            <span>Sign In to Portal</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Don't have an account? <button className="text-[#FB7A58] font-bold hover:underline">Request Access</button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400">
                    Trusted by 500+ academic institutions worldwide.
                </p>
            </div>
        </div>
    );
};

export default Login;
