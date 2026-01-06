import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";

// Temporary workaround for Excalidraw type export issues
type ExcalidrawElement = any;
type AppState = any;
type ExcalidrawImperativeAPI = { updateScene: (data: { elements: any }) => void };

interface WhiteboardProps {
    initialData?: readonly ExcalidrawElement[];
    onChange?: (elements: readonly ExcalidrawElement[]) => void;
    incomingElements?: readonly ExcalidrawElement[];
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ onChange, incomingElements }) => {
    const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null);
    const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);

    // Handle incoming updates
    useEffect(() => {
        if (incomingElements && excalidrawAPI.current) {
            // We should ideally merge or replace. For this MVP, we replace the scene.
            // Check if we are interacting to avoid jitter? 
            // In a real app we'd use CRDTs or versioning. 
            // Here we just update if the incoming count or version sum differs significantly
            // or just blindly update.
            excalidrawAPI.current.updateScene({ elements: incomingElements });
        }
    }, [incomingElements]);

    const handleChange = (els: readonly ExcalidrawElement[], appState: AppState) => {
        if (appState.draggingElement || appState.resizingElement || appState.editingElement) {
            // Maybe throttle updates or wait until interaction ends?
            // For real-time feel we want frequent updates.
        }
        setElements(els);
        if (onChange) {
            onChange(els);
        }
    };

    return (
        <div className="h-full w-full">
            <Excalidraw
                excalidrawAPI={(api) => excalidrawAPI.current = api}
                onChange={handleChange}
                initialData={{ elements: incomingElements || [] }}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveToActiveFile: false,
                        toggleTheme: true,
                        saveAsImage: true,
                    }
                }}
            />
        </div>
    );
};
