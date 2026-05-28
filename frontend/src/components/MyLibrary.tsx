"use client";

import React from 'react';
import { Library, Folder, FileText, Search, Grid, List, Download } from 'lucide-react';

const MyLibrary = () => {
    const resources = [
        { id: 1, name: 'Algebra Fundamentals', type: 'Worksheet', size: '2.4 MB', date: 'Oct 12, 2025' },
        { id: 2, name: 'Quantum Physics Intro', type: 'Reading', size: '1.2 MB', date: 'Oct 15, 2025' },
        { id: 3, name: 'Periodic Table Guide', type: 'Poster', size: '5.8 MB', date: 'Oct 18, 2025' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#1E1E1E]">My Library</h2>
                    <p className="text-gray-500 font-medium mt-1">Access your saved materials and teaching resources.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2.5 bg-white border border-[#F1F3F5] rounded-xl text-gray-400 hover:text-[#1E1E1E] transition-all shadow-sm">
                        <Grid size={20} />
                    </button>
                    <button className="p-2.5 bg-gray-50 border border-[#F1F3F5] rounded-xl text-[#FB7A58] transition-all shadow-sm">
                        <List size={20} />
                    </button>
                    <button className="btn-primary px-6 py-3 flex items-center space-x-2 ml-2">
                        <Folder size={18} />
                        <span>Add Folder</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['Documents', 'Images', 'Videos', 'Templates'].map((folder) => (
                    <div key={folder} className="card p-6 flex flex-col space-y-4 hover:border-[#FB7A58]/20 cursor-pointer group transition-all">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-[#FB7A58]/10 group-hover:text-[#FB7A58] rounded-2xl flex items-center justify-center transition-colors">
                            <Folder size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1E1E1E]">{folder}</h4>
                            <p className="text-xs text-gray-400 font-medium">12 Files • 450 MB</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-[#F1F3F5] rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#F1F3F5] flex items-center justify-between">
                    <h3 className="font-bold text-[#1E1E1E]">Recent Files</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="w-full bg-gray-50/50 border border-[#F1F3F5] rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#FB7A58]/20 outline-none"
                        />
                    </div>
                </div>
                <div className="p-2">
                    {resources.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-[#1E1E1E]">{file.name}</h5>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{file.type} • {file.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-[11px] font-bold text-gray-400">{file.date}</span>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#FB7A58] transition-colors rounded-full hover:bg-[#FB7A58]/10">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyLibrary;
