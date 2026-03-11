import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, HelpCircle, Search, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAuthStore } from '../store/useAuthStore';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { setView } = useNavigationStore();
    const { user, signOut } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex">

            {/* Mobile overlay */}
            {isMobileNavOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setIsMobileNavOpen(false)}
                />
            )}

            {/* Sidebar — always visible on lg+, slide-in on mobile */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:block`}>
                <Sidebar onNavClick={() => setIsMobileNavOpen(false)} />
            </div>

            <main className="flex-1 lg:ml-64 min-w-0 flex flex-col h-screen overflow-hidden">

                {/* Top Bar */}
                <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-sm">

                    {/* Left: hamburger (mobile) + breadcrumb */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger button — only on mobile */}
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileNavOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="flex items-center text-sm text-slate-400 font-medium hidden sm:flex">
                            <span className="hover:text-slate-100 cursor-pointer transition-colors">Campaigns</span>
                            <span className="mx-2 text-slate-700">/</span>
                            <span className="text-blue-100 bg-blue-500/10 px-2 py-0.5 rounded text-xs border border-blue-500/20">Q1 Product Launch</span>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search — hidden on small screens */}
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all w-48 lg:w-64 text-slate-200 placeholder:text-slate-600"
                            />
                        </div>

                        <div className="h-6 w-px bg-slate-800 hidden md:block" />

                        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                        </button>

                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors hidden sm:flex">
                            <HelpCircle size={20} />
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-800 ml-1 relative">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-100">{user?.email?.split('@')[0] || 'User'}</div>
                                <div className="text-xs text-slate-500">Marketing Director</div>
                            </div>

                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border-2 border-slate-800 cursor-pointer hover:shadow-indigo-500/40 transition-all"
                            >
                                <span className="text-sm font-bold">{user?.email?.[0].toUpperCase() || 'U'}</span>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-slate-900 rounded-xl shadow-xl border border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-800 mb-1">
                                        <p className="text-sm font-bold text-white">{user?.email?.split('@')[0] || 'User'}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <button onClick={() => { setView('settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors flex items-center gap-2">
                                        <User size={14} /> Profile
                                    </button>
                                    <button onClick={() => { setView('settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors flex items-center gap-2">
                                        <Settings size={14} /> Settings
                                    </button>
                                    <div className="border-t border-slate-800 my-1" />
                                    <button onClick={() => { signOut(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Mobile close button inside sidebar overlay area */}
                {isMobileNavOpen && (
                    <button
                        className="fixed top-4 right-4 z-[60] lg:hidden p-2 bg-slate-800 rounded-full text-white shadow-lg"
                        onClick={() => setIsMobileNavOpen(false)}
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
