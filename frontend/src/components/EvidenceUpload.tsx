import React, { useState, useCallback } from 'react';
import { api } from '../api/client';

interface EvidenceUploadProps {
    incidentId: string;
    onUploadComplete?: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ incidentId, onUploadComplete }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const uploadFile = async (file: File) => {
        // Add to uploading list
        setUploadingFiles(prev => [...prev, { file, progress: 0 }]);

        try {
            // Simulate progress (since fetch doesn't easily give upload progress without XHR)
            const interval = setInterval(() => {
                setUploadingFiles(prev => prev.map(f =>
                    f.file === file ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
                ));
            }, 200);

            await api.uploadEvidence(incidentId, file);

            clearInterval(interval);
            setUploadingFiles(prev => prev.filter(f => f.file !== file));
            if (onUploadComplete) onUploadComplete();

        } catch (error) {
            console.error(error);
            setUploadingFiles(prev => prev.map(f =>
                f.file === file ? { ...f, progress: 100, error: 'Upload failed' } : f
            ));
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            files.forEach(uploadFile);
        }
    }, [incidentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const files = Array.from(e.target.files);
            files.forEach(uploadFile);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                />

                <div className="pointer-events-none">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Images, Logs, Videos (Max 50MB)</p>
                </div>
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {uploadingFiles.map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-md p-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900 truncate">{item.file.name}</span>
                                    {item.error ? (
                                        <span className="text-xs text-red-600">{item.error}</span>
                                    ) : (
                                        <span className="text-xs text-gray-500">{item.progress}%</span>
                                    )}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${item.error ? 'bg-red-500' : 'bg-blue-600'}`}
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
