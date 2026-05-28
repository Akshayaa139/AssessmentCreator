"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Plus, Brain, FileText, ChevronRight, Clock } from 'lucide-react';
import NoAssignments from './NoAssignments';

const Dashboard = () => {
    const { user, exams, setView, setExam } = useAppStore();
    const router = useRouter();

    const handleCreate = () => {
        setView('create');
        router.push('/create');
    };

    const handleHistory = () => {
        setView('history');
        router.push('/history');
    };

    if (exams.length === 0) {
        return (
            <div className="h-[calc(100vh-160px)] flex items-center justify-center">
                <NoAssignments onCreate={handleCreate} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#1E1E1E]">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                    <p className="text-gray-500 font-medium mt-1">Here is what's happening with your classes today.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary px-6 py-3 hidden md:flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>New Assessment</span>
                </button>
            </div>

            {/* Stats Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Exams Created', value: exams.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'AI Generates', value: exams.length + 12, icon: Brain, color: 'text-[#FB7A58]', bg: 'bg-[#FB7A58]/10' },
                    { label: 'Active Groups', value: '4', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex items-center space-x-4">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-[#1E1E1E]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Exams */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#1E1E1E]">Recent Assessments</h3>
                        <button onClick={handleHistory} className="text-[#FB7A58] text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {exams.slice(0, 3).map((exam) => (
                            <div
                                key={exam.id}
                                onClick={() => setExam(exam)}
                                className="card p-4 flex items-center justify-between hover:border-[#FB7A58]/30 cursor-pointer transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-[#FB7A58]/10 group-hover:text-[#FB7A58] transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1E1E1E]">{exam.title}</h4>
                                        <p className="text-xs text-gray-400">{exam.grade} • {exam.difficulty}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#FB7A58] group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Templates / Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#1E1E1E]">Quick Templates</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={handleCreate} className="p-6 bg-[#1E1E1E] rounded-3xl border border-transparent hover:border-white/20 cursor-pointer transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Brain size={80} className="text-white" />
                            </div>
                            <p className="text-[#FB7A58] font-black text-xs uppercase tracking-widest mb-1">Standard</p>
                            <h4 className="text-white font-bold text-xl leading-tight">Weekly <br />Quiz</h4>
                            <div className="mt-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-[#FB7A58] transition-colors">
                                <Plus size={16} />
                            </div>
                        </div>
                        <div onClick={handleCreate} className="p-6 bg-white border border-[#E5E7EB] rounded-3xl hover:border-[#FB7A58]/20 cursor-pointer transition-all group">
                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">Comprehensive</p>
                            <h4 className="text-[#1E1E1E] font-bold text-xl leading-tight">Term <br />End Exam</h4>
                            <div className="mt-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#FB7A58]/10 group-hover:text-[#FB7A58] transition-colors">
                                <Plus size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
