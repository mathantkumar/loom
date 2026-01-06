import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
    Sparkles,
    Zap,
    Activity,
    CheckCircle2,
    History,
    ArrowRight,
    Database,
    Search,
    AlertCircle,
    Loader2,
    User,
    Menu,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { ChatSidebar } from '../components/incident/ChatSidebar';

// --- Types ---

interface InsightSection {
    key: string;
    title: string;
    content: string;
    confidence?: number;
}

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    sections: Record<string, InsightSection>;
    status?: string; // For assistant: "Analyzing...", "Complete", etc.
    confidence?: number;
}

interface BackendChatSession {
    id: string;
    title: string;
    createdAt: string;
}

interface BackendChatMessage {
    id: string;
    sessionId: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

// --- Constants ---

const SUGGESTIONS = [
    { label: "Why did payment-service fail yesterday?", icon: <Activity className="w-4 h-4 text-red-500" /> },
    { label: "Incidents caused by recent deployments", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: "Auth-service latency root cause", icon: <History className="w-4 h-4 text-blue-500" /> },
    { label: "Show related runbooks", icon: <Database className="w-4 h-4 text-emerald-500" /> },
];

const SECTION_CONFIG: Record<string, { title: string, icon: any }> = {
    root_cause: { title: "Root Cause Analysis", icon: AlertCircle },
    evidence: { title: "Supporting Evidence", icon: Search },
    action: { title: "Recommended Actions", icon: CheckCircle2 },
    query: { title: "Query", icon: User } // Added for completeness if needed
};

const SECTION_KEYS = Object.keys(SECTION_CONFIG);

// --- Components ---

const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <div className="bg-white border border-gray-200 text-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm font-medium leading-relaxed">
                    {message.sections['query']?.content || message.sections['root_cause']?.content || "..."}
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 ml-3 flex-shrink-0 flex items-center justify-center border border-purple-200">
                    <User className="w-4 h-4 text-purple-600" />
                </div>
            </div>
        );
    }

    // Assistant Message
    const isLoading = message.status && message.status !== "Complete";
    const hasContent = Object.keys(message.sections).length > 0;

    return (
        <div className="flex justify-start mb-8 animate-in slide-in-from-bottom-2 fade-in duration-500 w-full group">
            <div className="w-8 h-8 rounded-lg bg-gray-100 mr-4 flex-shrink-0 flex items-center justify-center border border-gray-200 group-hover:border-purple-200 transition-colors">
                <Sparkles className="w-4 h-4 text-purple-600" />
            </div>

            <div className="flex-1 max-w-3xl">
                {/* Status / Meta */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sentinel</span>
                    {isLoading && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {message.status}
                        </div>
                    )}
                    {(!isLoading && message.confidence && message.confidence > 0) ? (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {message.confidence.toFixed(0)}% Confidence
                        </span>
                    ) : null}
                </div>

                {/* Content Sections */}
                <div className="space-y-4">
                    {/* Empty Skeleton if loading and no content */}
                    {isLoading && !hasContent && (
                        <div className="space-y-3 opacity-60">
                            <div className="h-4 bg-gray-100 rounded w-1/3" />
                            <div className="h-20 bg-gray-50 rounded-lg w-full" />
                        </div>
                    )}

                    {SECTION_KEYS.map(key => {
                        const section = message.sections[key];
                        if (!section) return null;

                        const config = SECTION_CONFIG[key] || { title: "Analysis", icon: Sparkles };
                        const Icon = config.icon;

                        return (
                            <div key={key} className="animate-in fade-in slide-in-from-bottom-1 duration-500">
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                    <Icon className="w-3 h-3" />
                                    {config.title}
                                </h4>

                                {key === 'root_cause' && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-800 leading-relaxed shadow-sm whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                )}

                                {key === 'evidence' && (
                                    <div className="space-y-1">
                                        {section.content.split('\n').filter(Boolean).map((line, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 font-mono">
                                                <Database className="w-3 h-3 text-gray-400" />
                                                {line.replace(/^[•-]\s*/, '')}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {key === 'action' && (
                                    <div className="space-y-2 pt-1">
                                        {section.content.split('\n').filter(Boolean).map((line, i) => (
                                            <div key={i} className="flex gap-3 text-sm text-gray-700">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[10px] font-bold border border-purple-100 mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <span className="leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const AskSentinelPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessions, setSessions] = useState<BackendChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial Load: Fetch Sessions
    useEffect(() => {
        fetchSessions();
    }, []);

    // Load Session Messages when ID changes
    useEffect(() => {
        if (currentSessionId) {
            loadSessionMessages(currentSessionId);
        } else {
            setMessages([]);
        }
    }, [currentSessionId]);

    useEffect(() => {
        // Auto-scroll to bottom on new messages
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => inputRef.current?.focus(), []);

    const fetchSessions = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/chat/history');
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (e) {
            console.error("Failed to fetch sessions", e);
        }
    };

    const loadSessionMessages = async (sessionId: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/${sessionId}`);
            if (res.ok) {
                const data: BackendChatMessage[] = await res.json();

                // Map backend messages to frontend format
                const mappedMessages: ChatMessage[] = data.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    // Parse content into sections or default to root_cause
                    sections: (msg.role === 'user'
                        ? { 'query': { key: 'query', title: 'Query', content: msg.content } }
                        : { 'root_cause': { key: 'root_cause', title: 'Analysis', content: msg.content } }) as Record<string, InsightSection>,
                    status: "Complete",
                    confidence: 0 // Confidence not persisted mostly, or could be stored in future
                }));
                setMessages(mappedMessages);
            }
        } catch (e) {
            console.error("Failed to load messages", e);
        }
    };

    const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this chat?")) return;

        try {
            await fetch(`http://localhost:8080/api/v1/chat/${id}`, { method: 'DELETE' });
            setSessions(prev => prev.filter(s => s.id !== id));
            if (currentSessionId === id) {
                setCurrentSessionId(null);
                setMessages([]);
            }
        } catch (e) {
            console.error("Failed to delete session", e);
        }
    };

    const handleSearch = async (overrideQuery?: string) => {
        const searchQuery = overrideQuery || query;
        if (!searchQuery.trim() || isStreaming) return;

        // 1. Append User Message Locally
        const userMsgId = Date.now().toString();
        const userMsg: ChatMessage = {
            id: userMsgId,
            role: 'user',
            sections: { 'query': { key: 'query', title: 'Query', content: searchQuery } }
        };

        // 2. Append Empty Assistant Message Locally
        const assistantMsgId = (Date.now() + 1).toString();
        const assistantMsg: ChatMessage = {
            id: assistantMsgId,
            role: 'assistant',
            sections: {},
            status: "Connecting...",
            confidence: 0
        };

        setMessages(prev => [...prev, userMsg, assistantMsg]);
        setQuery('');
        setIsStreaming(true);

        // 3. Start Stream
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('http://localhost:8080/api/v1/incident/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: searchQuery,
                    sessionId: currentSessionId // Send current session ID if exists
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error(response.statusText);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        const jsonStr = line.replace("data:", "").trim();
                        if (!jsonStr) continue;

                        try {
                            const event = JSON.parse(jsonStr);

                            // Handle New Client-side Logic
                            if (event.type === 'session_init') {
                                // New session created on backend
                                const newSessionId = event.sessionId;
                                if (currentSessionId !== newSessionId) {
                                    // Update ID without reloading (we are streaming already)
                                    // But we should refresh list to show it in sidebar
                                    fetchSessions();
                                    // Set state but don't clear messages!
                                    // Use a ref or simple state update that doesn't trigger effect loop?
                                    // Actually, setting currentSessionId triggers loadSessionMessages. 
                                    // We should prevent that reload if we are actively streaming.
                                    // For now, let's just set the ID. 
                                    // The useEffect[currentSessionId] dependency might be tricky.
                                    // Let's rely on standard state update.
                                }
                            }

                            flushSync(() => {
                                setMessages(prev => {
                                    return prev.map(msg => {
                                        if (msg.id !== assistantMsgId) return msg;

                                        // Update Logic for the active message
                                        if (event.type === 'status') {
                                            return { ...msg, status: event.message };
                                        }

                                        if (event.type === 'section') {
                                            const existing = msg.sections[event.key];
                                            const newContent = existing ? existing.content + event.content : event.content;

                                            // Confidence logic
                                            const newConf = event.confidence > 0 ? Math.max(msg.confidence || 0, event.confidence * 100) : msg.confidence;

                                            return {
                                                ...msg,
                                                confidence: newConf,
                                                sections: {
                                                    ...msg.sections,
                                                    [event.key]: {
                                                        key: event.key,
                                                        title: event.title,
                                                        content: newContent,
                                                        confidence: event.confidence
                                                    }
                                                }
                                            };
                                        }
                                        return msg;
                                    });
                                });
                            });
                        } catch (e) {
                            console.warn("JSON parse error", e);
                        }
                    }
                }
            }

            // Mark complete
            setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, status: "Complete" } : m));
            // Refresh sessions list one last time to ensure title/order is correct
            fetchSessions();

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setMessages(prev => prev.map(m => m.id === assistantMsgId ? {
                    ...m,
                    status: "Error",
                    sections: { ...m.sections, root_cause: { key: 'error', title: 'Error', content: "Failed to connect to Sentinel." } }
                } : m));
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="flex h-full bg-[#FAFAFA] font-sans selection:bg-purple-100 overflow-hidden">

            {/* Sidebar */}
            <div
                className={`
                hidden md:block h-full border-r border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out relative
                ${isSidebarOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10 p-0 border-none overflow-hidden'}
            `}
            >
                <div className="w-64 h-full">
                    <ChatSidebar
                        sessions={sessions}
                        currentSessionId={currentSessionId}
                        onSelectSession={setCurrentSessionId}
                        onNewChat={() => setCurrentSessionId(null)}
                        onDeleteSession={handleDeleteSession}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative bg-white">
                {/* Header */}
                <header className="sticky top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 z-30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>

                        <div className="h-5 w-px bg-gray-200" />

                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center shadow-sm shadow-purple-200">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-bold text-gray-900 tracking-tight">Sentinel</span>
                        </div>
                    </div>
                </header>

                {/* Chat Timeline */}
                <main className="flex-1 overflow-y-auto px-4 w-full">
                    <div className="max-w-3xl mx-auto py-8">

                        {/* Welcome Empty State */}
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in zoom-in-95 duration-700">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask anything.</h2>
                                <p className="text-gray-500 mb-10 text-center max-w-sm text-sm">
                                    Context-aware SRE analysis for incidents, logs, and deployments.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                                    {SUGGESTIONS.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch(s.label)}
                                            className="flex items-center gap-3 p-4 bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 rounded-xl transition-all shadow-sm group text-left"
                                        >
                                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                                {s.icon}
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="space-y-2">
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                </main>

                {/* Input Area */}
                <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent pt-4 pb-6 mt-auto">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/10 transition-all">
                            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Describe an incident or ask a question..."
                                    className="w-full py-4 pl-5 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none focus:ring-0 outline-none"
                                    disabled={isStreaming}
                                />
                                <div className="pr-2">
                                    <button
                                        type="submit"
                                        disabled={!query.trim() || isStreaming}
                                        className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                            {isStreaming && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                                    <div className="h-full bg-purple-500 animate-loading-bar" />
                                </div>
                            )}
                        </div>
                        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                            Sentinel Generated Intelligence. Verify critical alerts manually.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes loading-bar {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 40%; transform: translateX(0%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.2s infinite linear;
                }
            `}</style>
        </div>
    );
};
