import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContextPanel } from '../components/huddle/ContextPanel';
import { VideoGrid } from '../components/huddle/VideoGrid';
import { Whiteboard } from '../components/huddle/Whiteboard';
import { HuddleChat } from '../components/huddle/HuddleChat';
import { useHuddleAI } from '../hooks/useHuddleAI';
import {
    Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,
    MessageSquare, Info, LayoutGrid, Users, PenTool, Brain
} from 'lucide-react';

// import type { ExcalidrawElement } from "@excalidraw/excalidraw";
type ExcalidrawElement = any;

interface Peer {
    id: string;
    pc: RTCPeerConnection;
    stream?: MediaStream;
}

interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

const HuddlePage = () => {
    const { incidentId } = useParams<{ incidentId: string }>();
    const navigate = useNavigate();

    // State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream }[]>([]);
    const [wbElements, setWbElements] = useState<readonly ExcalidrawElement[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // UI State
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
    const [showContextPanel, setShowContextPanel] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const peersRef = useRef<Map<string, Peer>>(new Map());
    const userIdRef = useRef<string>(Math.random().toString(36).substring(7)); // Random ID

    // Keep track of the original camera stream to revert back after screen share
    const cameraStreamRef = useRef<MediaStream | null>(null);

    // AI Hook
    const { isListening, toggleListening, error: aiError } = useHuddleAI({
        enabled: aiEnabled,
        onTranscript: (text) => sendJson(wsRef.current, { type: 'TRANSCRIPT', text: text })
    });

    // ICE Config
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ],
    };

    // 1. Initialize - Get Media & Connect WS
    useEffect(() => {
        const init = async () => {
            try {
                // Get User Media (Camera)
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                cameraStreamRef.current = stream;

                // Connect WS
                const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsHost = 'localhost:8080'; // HARDCODED for MVP local dev
                const wsUrl = `${wsProtocol}//${wsHost}/huddle-ws`;

                const socket = new WebSocket(wsUrl);
                wsRef.current = socket;

                socket.onopen = () => {
                    console.log('WS Connected');
                    sendJson(socket, { type: 'JOIN', incidentId, userId: userIdRef.current });
                };

                socket.onmessage = async (event) => {
                    const msg = JSON.parse(event.data);
                    handleWsMessage(msg, stream);
                };

                socket.onerror = (err) => console.error("WS Error", err);

            } catch (err) {
                console.error("Failed to init huddle", err);
            }
        };

        if (incidentId) init();

        return () => {
            // Cleanup props
            localStream?.getTracks().forEach(track => track.stop());
            wsRef.current?.close();
            peersRef.current.forEach(p => p.pc.close());
        };
    }, [incidentId]);

    // WebSocket Message Handler
    const handleWsMessage = async (msg: any, currentLocalStream: MediaStream) => {
        if (msg.senderId === userIdRef.current) return; // Ignore own messages

        switch (msg.type) {
            case 'JOIN':
                // New user joined. We send an OFFER.
                // Note: We use the *current* active stream (which might be screen share)
                const activeStream = localStream || currentLocalStream;
                createPeerConnection(msg.senderId, activeStream, true);
                break;

            case 'SIGNAL':
                const { targetId, senderId, signal } = msg;
                if (targetId && targetId !== userIdRef.current) return;

                let peer = peersRef.current.get(senderId);
                // If peer doesn't exist, create it. Use active stream.
                if (!peer) {
                    const activeStream = localStream || currentLocalStream;
                    peer = createPeerConnection(senderId, activeStream, false);
                }

                if (signal.type === 'offer') {
                    await peer.pc.setRemoteDescription(new RTCSessionDescription(signal));
                    const answer = await peer.pc.createAnswer();
                    await peer.pc.setLocalDescription(answer);
                    sendSignal(senderId, peer.pc.localDescription);
                } else if (signal.type === 'answer') {
                    await peer.pc.setRemoteDescription(new RTCSessionDescription(signal));
                } else if (signal.candidate) {
                    await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
                break;

            case 'WHITEBOARD_UPDATE':
                setWbElements(msg.payload);
                break;

            case 'CHAT':
                setMessages(prev => [...prev, msg.payload]);
                break;

            case 'AI_INSIGHT':
                // Identify AI messages (risks, hypotheses) - For now just log, 
                // we will likely want to show a toast or populate the Copilot panel
                console.log("AI Insight:", msg);
                if (msg.insightType === 'RISK') {
                    // Simple alert for prototype
                    alert(`Sentinel AI Risk Alert: ${msg.message}`);
                }
                break;
        }
    };

    const createPeerConnection = (remoteUserId: string, stream: MediaStream, isInitiator: boolean) => {
        if (peersRef.current.has(remoteUserId)) return peersRef.current.get(remoteUserId)!;

        const pc = new RTCPeerConnection(rtcConfig);

        // Add local tracks
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Handle ICE
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal(remoteUserId, { candidate: event.candidate });
            }
        };

        // Handle Remote Stream
        pc.ontrack = (event) => {
            setRemoteStreams(prev => {
                if (prev.find(p => p.id === remoteUserId)) return prev;
                return [...prev, { id: remoteUserId, stream: event.streams[0] }];
            });
        };

        const peer: Peer = { id: remoteUserId, pc };
        peersRef.current.set(remoteUserId, peer);

        if (isInitiator) {
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer);
                sendSignal(remoteUserId, offer);
            });
        }

        return peer;
    };

    const sendJson = (socket: WebSocket | null, data: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ ...data, incidentId, senderId: userIdRef.current }));
        }
    };

    const sendSignal = (targetId: string, signal: any) => {
        sendJson(wsRef.current, { type: 'SIGNAL', targetId, signal });
    };

    const handleWhiteboardChange = (elements: readonly ExcalidrawElement[]) => {
        if (wsRef.current) {
            sendJson(wsRef.current, { type: 'WHITEBOARD_UPDATE', payload: elements });
        }
    };

    const handleSendMessage = (text: string) => {
        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: userIdRef.current,
            text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, msg]);
        sendJson(wsRef.current, { type: 'CHAT', payload: msg });
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
            setMuted(!muted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
            setVideoEnabled(!videoEnabled);
        }
    };

    const handleShareScreen = async () => {
        if (isScreenSharing) {
            // Stop sharing - Revert to camera
            stopScreenSharing();
            return;
        }

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            setScreenShareStream(screenStream);

            // Handle user clicking "Stop sharing" in browser UI
            screenTrack.onended = () => {
                stopScreenSharing();
            };

            // Replace video track in all active peer connections using replaceTrack
            peersRef.current.forEach(peer => {
                const senders = peer.pc.getSenders();
                const videoSender = senders.find(s => s.track?.kind === 'video');
                if (videoSender) {
                    videoSender.replaceTrack(screenTrack);
                }
            });

            setIsScreenSharing(true);
            setIsWhiteboardOpen(false); // Close whiteboard if open

        } catch (e) {
            console.error("Error sharing screen", e);
        }
    };

    const stopScreenSharing = () => {
        if (!cameraStreamRef.current) return;

        // Revert peer connections to camera track
        const cameraTrack = cameraStreamRef.current.getVideoTracks()[0];
        peersRef.current.forEach(peer => {
            const senders = peer.pc.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(cameraTrack);
            }
        });

        // Cleanup screen stream locally if it exists in state
        if (screenShareStream) {
            screenShareStream.getTracks().forEach(t => t.stop());
            setScreenShareStream(null);
        }

        setIsScreenSharing(false);
    };

    const handleLeave = () => {
        localStream?.getTracks().forEach(t => t.stop());
        navigate(`/incidents/${incidentId}`);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-950 text-white overflow-hidden">

            {/* AI Active Indicator */}
            {isListening && (
                <div className="absolute top-4 left-4 z-50 flex items-center gap-2 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 bg-indigo-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-indigo-100 tracking-wide">Sentinel AI Active</span>
                    </div>
                </div>
            )}

            {/* Top Bar for REC and Info (Right side now to prevent overlap) */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
                <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-semibold tracking-wide">REC</span>
                    <div className="w-px h-4 bg-slate-700 mx-1" />
                    <span className="text-xs text-slate-400 font-mono">INC-{incidentId}</span>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Left Panel: Context */}
                {showContextPanel && (
                    <div className="w-80 h-full bg-white text-slate-900 border-r border-slate-200 z-30 animate-in slide-in-from-left duration-300 shadow-xl">
                        <ContextPanel incidentId={incidentId!} />
                    </div>
                )}

                {/* Center Content */}
                <div className="flex-1 relative bg-black flex items-center justify-center">

                    {/* Video Grid Layer */}
                    <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${isWhiteboardOpen ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10 p-6'}`}>
                        <div className="h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
                            <VideoGrid
                                localStream={localStream}
                                remoteStreams={remoteStreams}
                                muted={muted}
                                isScreenSharing={isScreenSharing}
                                screenShareStream={screenShareStream}
                            />
                        </div>
                    </div>

                    {/* Whiteboard Layer */}
                    <div className={`absolute inset-0 bg-white transition-all duration-300 ${!isWhiteboardOpen ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-20'}`}>
                        <div className="h-full w-full">
                            <Whiteboard
                                onChange={handleWhiteboardChange}
                                incomingElements={wbElements}
                            />
                        </div>
                    </div>

                </div>

                {/* Right Panel: Chat */}
                {showChatPanel && (
                    <div className="w-80 h-full bg-white text-slate-900 border-l border-slate-200 z-30 animate-in slide-in-from-right duration-300 shadow-xl">
                        <HuddleChat
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            currentUserId={userIdRef.current}
                        />
                    </div>
                )}
            </div>

            {/* Bottom Control Bar */}
            <div className="h-20 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between z-40 shadow-2xl">

                {/* Left: Info */}
                <div className="flex items-center gap-4 w-1/3">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-100">Sentinel Huddle</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {1 + remoteStreams.length} Participants
                        </span>
                    </div>
                </div>

                {/* Center: Main Controls */}
                <div className="flex items-center gap-3 justify-center w-1/3">
                    <button
                        onClick={toggleMute}
                        className={`p-3.5 rounded-full transition-all duration-200 ${muted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-3.5 rounded-full transition-all duration-200 ${!videoEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                        title={videoEnabled ? "Stop Video" : "Start Video"}
                    >
                        {!videoEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    <div className="w-px h-8 bg-slate-700 mx-2" />

                    <button
                        onClick={() => setAiEnabled(!aiEnabled)}
                        className={`p-3.5 rounded-full transition-all duration-200 ${aiEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                        title="Toggle AI Copilot"
                    >
                        <Brain className={`w-5 h-5 ${aiEnabled ? 'animate-pulse' : ''}`} />
                    </button>

                    <button
                        onClick={handleShareScreen}
                        className={`p-3.5 rounded-full transition-all duration-200 ${isScreenSharing ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                        title="Share Screen"
                    >
                        <MonitorUp className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
                        className={`p-3.5 rounded-full transition-all duration-200 ${isWhiteboardOpen ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                        title="Toggle Whiteboard"
                    >
                        <PenTool className="w-5 h-5" />
                    </button>

                    <button className="p-3.5 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors">
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                </div>

                {/* Right: Panels & Leave */}
                <div className="flex items-center gap-3 justify-end w-1/3">
                    <button
                        onClick={() => setShowContextPanel(!showContextPanel)}
                        className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${showContextPanel ? 'bg-slate-800 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
                        title="Incident Context"
                    >
                        <Info className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowChatPanel(!showChatPanel)}
                        className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors relative ${showChatPanel ? 'bg-slate-800 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
                        title="Huddle Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {messages.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>}
                    </button>

                    <div className="w-px h-8 bg-slate-800 mx-2" />

                    <button
                        onClick={handleLeave}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20"
                    >
                        <PhoneOff className="w-4 h-4" />
                        End
                    </button>
                </div>

            </div>
        </div>
    );
};

export default HuddlePage;
