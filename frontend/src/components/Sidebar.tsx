"use client";

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import {
    Home,
    Users,
    FileText,
    Brain,
    Library,
    Settings,
    Plus
} from 'lucide-react';



const Sidebar = () => {
    const { currentView, setView, user } = useAppStore();

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'groups', label: 'My Groups', icon: Users },
        { id: 'history', label: 'Assignments', icon: FileText },
        { id: 'create', label: "AI Teacher's Toolkit", icon: Brain },
        { id: 'library', label: 'My Library', icon: Library },
    ];

    return (
        <aside className="w-72 bg-white border-r border-[#E5E7EB] flex flex-col h-full no-print hidden md:flex">
            {/* Logo Section */}
            <div className="p-8 pb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FB7A58] to-[#e0694b] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FB7A58]/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 20H20L12 4Z" fill="white" />
                        <path d="M12 8L7 18H17L12 8Z" fill="white" fillOpacity="0.2" />
                    </svg>
                </div>
                <span className="text-2xl font-black text-[#1E1E1E] tracking-tight">VedaAI</span>
            </div>

            {/* Create Button */}
            <div className="px-6 py-4">
                <Link
                    href="/create"
                    className="w-full bg-[#1E1E1E] text-white rounded-full py-3.5 px-5 flex items-center justify-between hover:bg-black transition-all shadow-xl shadow-black/5 group border border-white/5 active:scale-95"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-[#FB7A58]/20 rounded-lg flex items-center justify-center border border-[#FB7A58]/30">
                            <Plus size={14} className="text-[#FB7A58]" strokeWidth={3} />
                        </div>
                        <span className="font-bold text-sm tracking-wide">Create Assignment</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.id === 'dashboard' ? '/' : `/${item.id}`}
                        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${currentView === item.id
                            ? 'nav-active bg-[#F9FAFB] text-[#FB7A58]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                    >
                        <item.icon
                            size={20}
                            strokeWidth={currentView === item.id ? 2.5 : 2}
                            className={`${currentView === item.id ? 'text-[#FB7A58]' : 'text-gray-400 group-hover:text-gray-600'}`}
                        />
                        <span className={`text-[15px] ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        {item.id === 'history' && (
                            <span className="ml-auto bg-[#FB7A58]/10 text-[#FB7A58] text-[10px] font-black px-2 py-0.5 rounded-full">10</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer Section */}
            <div className="p-4 space-y-4">
                <Link
                    href="/settings"
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:border-[#FB7A58]/20 hover:text-gray-700 font-medium transition-all rounded-2xl"
                >
                    <Settings size={20} className="text-gray-400" />
                    <span className="text-[15px]">Settings</span>
                </Link>

                {/* School Card */}
                <div className="bg-white border border-[#F1F3F5] rounded-3xl p-4 flex items-center space-x-3 shadow-sm hover:border-[#FB7A58]/20 transition-all cursor-pointer">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#F1F3F5] overflow-hidden flex-shrink-0 shadow-sm p-1">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Jane'}`}
                            alt="User Profile"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-[#1E1E1E] leading-tight break-words">{user?.name || 'Dr. Jane Smith'}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 break-words">{user?.email || 'professor@university.edu'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
