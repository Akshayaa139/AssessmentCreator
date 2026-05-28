"use client";

import React from 'react';
import { Plus } from 'lucide-react';

interface NoAssignmentsProps {
    onCreate: () => void;
}

const NoAssignments: React.FC<NoAssignmentsProps> = ({ onCreate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FB7A58]/5 rounded-full blur-2xl"></div>

                <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* The Document */}
                    <div className="absolute w-48 h-64 bg-white rounded-[32px] shadow-2xl shadow-black/5 border border-[#F1F3F5] -rotate-6 flex flex-col p-8 space-y-4">
                        <div className="h-2.5 w-1/2 bg-gray-100 rounded-full"></div>
                        <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                        <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                        <div className="h-2 w-3/4 bg-gray-50 rounded-full"></div>
                        <div className="mt-auto h-2 w-1/3 bg-gray-100 rounded-full"></div>
                    </div>

                    {/* The Magnifying Glass & Red X */}
                    <div className="relative z-10 translate-x-8 translate-y-4">
                        <div className="w-36 h-36 rounded-full bg-white/80 backdrop-blur-md border border-white p-4 shadow-2xl flex items-center justify-center relative">
                            <div className="w-28 h-28 rounded-full bg-red-50 flex items-center justify-center border-8 border-white">
                                <span className="text-red-500 font-black text-6xl leading-none">×</span>
                            </div>
                            {/* Handle of magnifying glass */}
                            <div className="absolute -bottom-6 -right-6 w-4 h-16 bg-[#F1F3F5] rounded-full rotate-[-45deg] origin-top border border-white"></div>
                        </div>
                    </div>

                    {/* Dots and sparkles */}
                    <div className="absolute top-1/4 right-0 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-[#FB7A58] rounded-full"></div>
                    <div className="absolute top-10 left-10 text-blue-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-3xl font-black text-[#1E1E1E] tracking-tight">No assignments yet</h3>
                <p className="text-gray-400 font-bold leading-relaxed max-w-md mx-auto text-[15px]">
                    Create your first assignment to start collecting and grading student submissions.
                    You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
            </div>

            <button
                onClick={onCreate}
                className="btn-dark py-4.5 px-12 flex items-center space-x-3 group"
            >
                <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-bold text-lg">Create Your First Assignment</span>
            </button>
        </div>
    );
};

export default NoAssignments;
