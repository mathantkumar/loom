import React from 'react';

interface VideoGridProps {
    localStream: MediaStream | null;
    remoteStreams: { id: string; stream: MediaStream; userId?: string }[];
    muted: boolean;
    isScreenSharing: boolean;
    screenShareStream: MediaStream | null;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
    localStream,
    remoteStreams,
    muted,
    isScreenSharing,
    screenShareStream
}) => {
    // Layout 1: Screen Share / Presentation Mode
    if (screenShareStream) {
        return (
            <div className="flex flex-col h-full bg-slate-900 gap-4 p-4">
                {/* Main Stage: Screen Share */}
                <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
                    <video
                        ref={(video) => {
                            if (video) video.srcObject = screenShareStream;
                        }}
                        autoPlay
                        playsInline
                        muted // Mute local screen share to prevent loops
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 bg-indigo-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        You're Presenting
                    </div>
                </div>

                {/* Filmstrip: Participants */}
                <div className="h-40 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

                    {/* Local User (Camera) */}
                    <div className="flex-shrink-0 w-60 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md relative group">
                        {localStream ? (
                            <video
                                ref={(video) => {
                                    if (video) video.srcObject = localStream;
                                }}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">No Camera</div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
                            You {muted && '(Muted)'}
                        </div>
                    </div>

                    {/* Remote Users */}
                    {remoteStreams.map((peer) => (
                        <div key={peer.id} className="flex-shrink-0 w-60 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md relative">
                            <video
                                ref={(video) => {
                                    if (video) video.srcObject = peer.stream;
                                }}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
                                User {peer.id.substring(0, 4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Layout 2: Standard Grid
    return (
        <div className="flex flex-col h-full bg-slate-900 p-4">
            {/* Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {/* Local User */}
                <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video border border-slate-700 shadow-xl">
                    {localStream ? (
                        <video
                            ref={(video) => {
                                if (video) video.srcObject = localStream;
                            }}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover transform scale-x-[-1]`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            Loading Camera...
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
                        You {muted && '(Muted)'}
                    </div>
                </div>

                {/* Remote Users */}
                {remoteStreams.map((peer) => (
                    <div key={peer.id} className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video border border-slate-700 shadow-xl">
                        <video
                            ref={(video) => {
                                if (video) video.srcObject = peer.stream;
                            }}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
                            User {peer.id.substring(0, 4)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
