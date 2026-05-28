"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FileText, ChevronRight, Search, Filter, Plus } from 'lucide-react';
import NoAssignments from './NoAssignments';

const ExamHistory = () => {
    const { exams, setExam, setView } = useAppStore();

    const handleCreate = () => {
        setView('create');
    };

    if (exams.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <NoAssignments onCreate={handleCreate} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-[#FB7A58] mb-2">
                        <div className="w-2 h-2 bg-[#FB7A58] rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Live View</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#1E1E1E] tracking-tight">Assignments</h2>
                    <p className="text-gray-400 font-bold mt-1">Manage and create assignments for your classes.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#F1F3F5] rounded-xl text-gray-400 hover:text-[#1E1E1E] transition-all font-bold text-sm shadow-sm">
                        <Filter size={18} />
                        <span>Filter By</span>
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search Assignment"
                            className="bg-white border border-[#F1F3F5] rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none w-80 shadow-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        onClick={() => setExam(exam)}
                        className="bg-white border border-[#F1F3F5] rounded-[32px] p-8 space-y-6 hover:shadow-2xl hover:shadow-black/5 cursor-pointer transition-all duration-500 group relative"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-[#1E1E1E] leading-tight group-hover:text-[#FB7A58] transition-colors">{exam.title}</h3>
                            <button type="button" aria-label="More options" title="More options" className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-[#1E1E1E] hover:bg-gray-50 rounded-full transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="5" r="2" fill="currentColor" />
                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    <circle cx="12" cy="19" r="2" fill="currentColor" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center space-x-12 pt-2">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Assigned on</p>
                                <p className="text-sm font-bold text-[#1E1E1E]">20-06-2025</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Due</p>
                                <p className="text-sm font-bold text-[#1E1E1E]">21-06-2025</p>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-[#FB7A58]/10 text-[#FB7A58] rounded-full flex items-center justify-center">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Skeleton Card */}
                <button
                    onClick={handleCreate}
                    className="border-2 border-dashed border-[#F1F3F5] rounded-[32px] p-8 flex flex-col items-center justify-center space-y-4 hover:border-[#FB7A58]/30 hover:bg-gray-50/50 transition-all group min-h-[220px]"
                >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#FB7A58] group-hover:bg-[#FB7A58]/10 transition-all">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-gray-400 group-hover:text-[#FB7A58] transition-colors">Create New Assignment</span>
                </button>
            </div>
        </div>
    );
};

export default ExamHistory;
