"use client";

import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const Settings = () => {
    const { user, logout } = useAppStore();

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-[#1E1E1E]">Settings</h2>
                <p className="text-gray-500 font-medium mt-1">Manage your account and app preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white border border-[#F1F3F5] rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#FB7A58]/10 text-[#FB7A58] flex items-center justify-center">
                                <User size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1E1E1E] leading-tight">Profile Information</h3>
                                <p className="text-sm text-gray-400 font-medium">Update your personal details.</p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 bg-gray-50 text-[#1E1E1E] border border-[#F1F3F5] rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-[#1E1E1E]">{user?.name || 'Dr. Jane Smith'}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold text-[#1E1E1E]">{user?.email || 'professor@university.edu'}</p>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white border border-[#F1F3F5] rounded-[32px] overflow-hidden shadow-sm">
                    <div className="p-8 space-y-2 border-b border-[#F1F3F5]">
                        <h3 className="text-xl font-bold text-[#1E1E1E]">Account</h3>
                        <p className="text-sm text-gray-400 font-medium">Notifications, privacy, and appearance.</p>
                    </div>
                    <div className="p-4 space-y-2">
                        {[
                            { icon: Bell, label: 'Notifications', desc: 'Manage alerts and emails', active: true },
                            { icon: Shield, label: 'Privacy & Security', desc: 'Secure your login and data', active: false },
                            { icon: Moon, label: 'Appearance', desc: 'Dark mode and themes', active: false },
                        ].map((item) => (
                            <div key={item.label} className="p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-[#FB7A58]/10 group-hover:text-[#FB7A58] rounded-xl flex items-center justify-center transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1E1E1E]">{item.label}</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-5 bg-gray-200 rounded-full relative transition-colors group-hover:bg-[#FB7A58]/30">
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'left-6 bg-[#FB7A58]' : 'left-1'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/30 border border-red-100 rounded-[32px] p-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                        <p className="text-sm text-red-400 font-medium mt-1">Sign out of your account or delete data.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-white border border-red-100 text-red-600 rounded-2xl font-bold flex items-center space-x-2 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
