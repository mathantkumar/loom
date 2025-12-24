import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DOCS } from './docData';
import type { DocSection } from './docData';

interface DocLayoutProps {
    children: React.ReactNode;
    activeSectionId: string;
    onSectionChange: (id: string) => void;
}

export const DocLayout: React.FC<DocLayoutProps> = ({ children, activeSectionId, onSectionChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Group docs by category
    const categories = DOCS.reduce((acc, doc) => {
        if (!acc[doc.category]) {
            acc[doc.category] = [];
        }
        acc[doc.category].push(doc);
        return acc;
    }, {} as Record<string, DocSection[]>);

    // Search logic
    const searchResults = DOCS.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.content && doc.content.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex h-screen bg-white">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-900 text-lg">Loom Docs</span>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        {searchQuery ? (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search Results</h3>
                                {searchResults.length > 0 ? (
                                    <ul className="space-y-1">
                                        {searchResults.map(doc => (
                                            <li key={doc.id}>
                                                <button
                                                    onClick={() => {
                                                        onSectionChange(doc.id);
                                                        setSearchQuery('');
                                                        setIsSidebarOpen(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                >
                                                    {doc.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 px-3">No results found.</p>
                                )}
                            </div>
                        ) : (
                            Object.entries(categories).map(([category, docs]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                        {category}
                                    </h3>
                                    <ul className="space-y-1">
                                        {docs.map(doc => (
                                            <li key={doc.id}>
                                                <button
                                                    onClick={() => {
                                                        onSectionChange(doc.id);
                                                        setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeSectionId === doc.id
                                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {doc.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}

                        <div className="pt-6 border-t border-gray-200">
                            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to App
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-8 py-12">
                    {children}
                </div>
            </div>
        </div>
    );
};
