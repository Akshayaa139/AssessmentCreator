"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Bell, ChevronLeft, ChevronDown, Menu, Home, FileText, Library, Brain, Plus } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, currentView, setView } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                {children}
            </div>
        );
    }

    const getBreadcrumb = () => {
        switch (currentView) {
            case 'create': return 'AI Teacher\'s Toolkit';
            case 'history': return 'Assignments';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Navigation / Header */}
                <header className="h-[72px] bg-white border-b border-[#F1F3F5] flex items-center justify-between px-4 md:px-10 no-print flex-shrink-0">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setView('dashboard')}
                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors md:hidden"
                        >
                            <Menu size={22} className="text-[#1E1E1E]" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors hidden md:flex border border-[#F1F3F5]"
                            >
                                <ChevronLeft size={18} className="text-[#1E1E1E]" />
                            </button>
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 4H20V10H14V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 14H20V20H14V14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-[#1E1E1E] font-black tracking-tight uppercase text-[12px] opacity-60">{getBreadcrumb()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="relative">
                            <button className="w-10 h-10 flex items-center justify-center text-[#1E1E1E] hover:bg-gray-50 rounded-xl transition-all relative border border-[#F1F3F5]">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FB7A58] border-2 border-white rounded-full shadow-sm shadow-[#FB7A58]/30"></span>
                            </button>
                        </div>

                        <div className="flex items-center space-x-3 px-3 py-1.5 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-[#F1F3F5]">
                            <div className="w-9 h-9 rounded-xl border border-[#F1F3F5] overflow-hidden shadow-sm p-0.5 bg-white">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Jane'}`}
                                    alt="User profile"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="hidden sm:flex items-center space-x-2">
                                <span className="text-sm font-black text-[#1E1E1E]">{user.name}</span>
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-white md:p-8 p-4 relative print:overflow-visible print:h-auto print:static">
                    <div className="mx-auto max-w-7xl border-[10px] border-[#F9FAFB] rounded-[40px] bg-white shadow-inner print:border-0 print:shadow-none print:max-w-none">
                        <div className="w-full bg-[#F9FAFB]/30 p-8 print:p-0 print:bg-transparent">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden h-20 bg-white border-t border-[#F1F3F5] flex items-center justify-around px-6 no-print rounded-t-3xl shadow-2xl shadow-black/10">
                    {[
                        { id: 'dashboard', icon: Home, label: 'Home' },
                        { id: 'history', icon: FileText, label: 'Assignments' },
                        { id: 'library', icon: Library, label: 'Library' },
                        { id: 'create', icon: Brain, label: 'Al Toolkit' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className={`flex flex-col items-center justify-center space-y-1.5 transition-all ${currentView === item.id ? 'text-[#1E1E1E] scale-110' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Floating Action Button (Mobile) */}
                <button
                    onClick={() => setView('create')}
                    className="md:hidden absolute bottom-20 right-6 w-14 h-14 bg-white border border-gray-100 shadow-2xl rounded-2xl flex items-center justify-center text-[#FB7A58] animate-bounce-subtle"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </main>
        </div>
    );
}
