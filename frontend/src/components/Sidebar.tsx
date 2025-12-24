import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Activity,
    BookOpen,
    BarChart2,
    Bell,
    Users,
    FilePlus,
    HelpCircle,
    Menu,
    ChevronLeft,
    Heart
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import logo from '../assets/logo.png';
import { BRAND_NAME } from '../config/branding';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    // Persist collapsed state
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem('sidebar_collapsed');
        return stored ? JSON.parse(stored) : false;
    });

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', JSON.stringify(collapsed));
    }, [collapsed]);



    const menuItems = [
        {
            section: 'Primary Menu', items: [
                { icon: Home, label: 'Home', path: '/' },
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: Heart, label: 'Pulse', path: '/pulse' },
                { icon: Activity, label: 'Analysis', path: '/analysis' },
                { icon: BookOpen, label: 'Documentation', path: '/documentation' },
                { icon: BarChart2, label: 'Stats & History', path: '/stats' },
                { icon: Bell, label: 'Alerts', path: '/alerts' },
            ]
        },
        {
            section: 'Support', items: [
                { icon: Users, label: 'Teams', path: '/teams' },
                { icon: FilePlus, label: 'Report Incident', path: '/report' },
                { icon: HelpCircle, label: 'Help & Support', path: '/help' },
            ]
        }
    ];

    return (
        <div
            className={twMerge(
                "h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 relative border-r border-gray-800",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Header / Logo Area */}
            <div className="h-16 flex items-center px-4 border-b border-gray-800 justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        <img src={logo} alt={`${BRAND_NAME} Logo`} className="h-8 w-auto object-contain" />
                        <span>{BRAND_NAME}</span>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto">
                        <img src={logo} alt={BRAND_NAME} className="h-8 w-8 object-contain" />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={clsx(
                        "text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800",
                        !collapsed && "absolute right-3"
                    )}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <Menu size={20} className="mx-auto" /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="px-3">
                        {!collapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                                {group.section}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-indigo-600/10 text-indigo-400 font-medium"
                                            : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/50"
                                    )}
                                >
                                    <item.icon
                                        size={20}
                                        className={clsx(
                                            "flex-shrink-0 transition-colors",
                                        )}
                                    />
                                    {!collapsed && (
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {collapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-gray-700 shadow-xl">
                                            {item.label}
                                        </div>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / User Profile Stub */}
            <div className="p-4 border-t border-gray-800">
                <div className={clsx("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0" />
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Mathan Kumar</p>
                            <p className="text-xs text-gray-500 truncate">SRE Lead</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
