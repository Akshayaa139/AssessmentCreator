"use client";

import React, { useMemo, useState } from 'react';
import { Check, Edit3, MoreVertical, Plus, Search, Trash2, Users, X } from 'lucide-react';

type Group = {
    id: number;
    name: string;
    students: number;
    sub: string;
};

const defaultGroups: Group[] = [
    { id: 1, name: 'Grade 10 - Mathematics', students: 32, sub: 'Advanced Geometry' },
    { id: 2, name: 'Grade 11 - Physics', students: 28, sub: 'Quantum Mechanics' },
    { id: 3, name: 'Grade 12 - Chemistry', students: 30, sub: 'Organic Chemistry' },
];

const MyGroups = () => {
    const [groups, setGroups] = useState<Group[]>(defaultGroups);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState({ name: '', sub: '', students: '0' });

    const filteredGroups = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return groups;

        return groups.filter((group) =>
            group.name.toLowerCase().includes(query) ||
            group.sub.toLowerCase().includes(query)
        );
    }, [groups, search]);

    const resetDraft = () => {
        setDraft({ name: '', sub: '', students: '0' });
        setEditingId(null);
    };

    const openCreate = () => {
        resetDraft();
        setIsCreating(true);
        setOpenMenuId(null);
    };

    const closeModal = () => {
        setIsCreating(false);
        resetDraft();
    };

    const saveGroup = () => {
        const name = draft.name.trim();
        const sub = draft.sub.trim();
        const students = Number.parseInt(draft.students, 10);

        if (!name || !sub || Number.isNaN(students) || students < 0) {
            alert('Please enter a group name, subject, and valid student count.');
            return;
        }

        if (editingId) {
            setGroups((current) =>
                current.map((group) =>
                    group.id === editingId ? { ...group, name, sub, students } : group
                )
            );
        } else {
            setGroups((current) => [
                { id: Date.now(), name, sub, students },
                ...current,
            ]);
        }

        closeModal();
    };

    const startEdit = (group: Group) => {
        setDraft({
            name: group.name,
            sub: group.sub,
            students: String(group.students),
        });
        setEditingId(group.id);
        setIsCreating(true);
        setOpenMenuId(null);
    };

    const deleteGroup = (id: number) => {
        setGroups((current) => current.filter((group) => group.id !== id));
        setOpenMenuId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#1E1E1E]">My Groups</h2>
                    <p className="text-gray-500 font-medium mt-1">Manage your classes and student groups.</p>
                </div>
                <button onClick={openCreate} className="btn-primary px-6 py-3 flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Create Group</span>
                </button>
            </div>

            <div className="bg-white border border-[#F1F3F5] rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#F1F3F5] flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full bg-white border border-[#F1F3F5] rounded-2xl pl-12 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-[#FB7A58]/20 outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-[#F1F3F5]">
                                <th className="px-8 py-4">Group Name</th>
                                <th className="px-8 py-4">Subject</th>
                                <th className="px-8 py-4">Students</th>
                                <th className="px-8 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroups.map((group) => (
                                <tr key={group.id} className="border-b border-[#F1F3F5] hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-[#FB7A58]/10 text-[#FB7A58] rounded-xl flex items-center justify-center">
                                                <Users size={20} />
                                            </div>
                                            <span className="font-bold text-[#1E1E1E]">{group.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{group.sub}</td>
                                    <td className="px-8 py-5">
                                        <span className="bg-gray-100 text-[#1E1E1E] text-xs font-black px-2.5 py-1 rounded-lg">
                                            {group.students} Students
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 relative">
                                        <button
                                            onClick={() => setOpenMenuId((current) => current === group.id ? null : group.id)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1E1E1E] rounded-full hover:bg-gray-100 transition-all"
                                            aria-label={`Actions for ${group.name}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {openMenuId === group.id && (
                                            <div className="absolute right-8 top-14 z-20 w-40 bg-white border border-[#F1F3F5] rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
                                                <button
                                                    onClick={() => startEdit(group)}
                                                    className="w-full px-4 py-3 text-left text-sm font-bold text-[#1E1E1E] hover:bg-gray-50 flex items-center space-x-2"
                                                >
                                                    <Edit3 size={15} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => deleteGroup(group.id)}
                                                    className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center space-x-2"
                                                >
                                                    <Trash2 size={15} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredGroups.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-sm font-bold text-gray-400">
                                        No groups found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreating && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-[32px] border border-[#F1F3F5] shadow-2xl shadow-black/20 p-8 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#1E1E1E]">
                                    {editingId ? 'Edit Group' : 'Create Group'}
                                </h3>
                                <p className="text-sm text-gray-400 font-bold mt-1">Add the class details students will be grouped under.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-9 h-9 rounded-full bg-gray-50 text-gray-400 hover:text-[#1E1E1E] flex items-center justify-center transition-colors"
                                aria-label="Close group form"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="block space-y-2">
                                <span className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest">Group Name</span>
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                                    placeholder="e.g. Grade 9 - Biology"
                                    className="input-field"
                                    autoFocus
                                />
                            </label>
                            <label className="block space-y-2">
                                <span className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest">Subject</span>
                                <input
                                    type="text"
                                    value={draft.sub}
                                    onChange={(event) => setDraft((current) => ({ ...current, sub: event.target.value }))}
                                    placeholder="e.g. Cell Structure"
                                    className="input-field"
                                />
                            </label>
                            <label className="block space-y-2">
                                <span className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest">Students</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={draft.students}
                                    onChange={(event) => setDraft((current) => ({ ...current, students: event.target.value }))}
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-2">
                            <button
                                onClick={closeModal}
                                className="px-5 py-3 bg-white border border-[#F1F3F5] rounded-2xl text-sm font-black text-[#1E1E1E] hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveGroup}
                                className="btn-primary px-5 py-3 flex items-center space-x-2"
                            >
                                <Check size={17} />
                                <span>{editingId ? 'Save Group' : 'Create Group'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyGroups;
