import { create } from 'zustand';
//import type { MessageRole, MessageModal } from '../types/chat-frontend-types';

// interface PreparedForStream {
//     role: MessageRole;
//     modal: MessageModal;
// }

interface StreamingState {
    isStreaming: boolean;
    isPaused: boolean;
    errorMessage?: string;
    //prepared?: PreparedForStream;
    setStreaming: (isStreaming: boolean) => void;
    setPaused: (isPaused: boolean) => void;
    setError: (message?: string) => void;
    clearError: () => void;
    //setPrepared: (prepared?: PreparedForStream) => void;
    getState: () => StreamingState;
}

export const useStreamingStore = create<StreamingState>((set, get) => ({
    isStreaming: false,
    isPaused: false,
    prepared: undefined,
    errorMessage: undefined,

    setStreaming: (isStreaming: boolean) =>
        set({ isStreaming }),

    setPaused: (isPaused: boolean) =>
        set({ isPaused }),

    setError: (message?: string) => set({ errorMessage: message }),

    clearError: () => set({ errorMessage: undefined }),

    // setPrepared: (prepared?: PreparedForStream) =>
    //     set({ prepared }),

    getState: () => {
        return get();
    }
}));
