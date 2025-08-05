import { create } from 'zustand';
//import type { MessageRole, MessageModal } from '../types/chat-frontend-types';

// interface PreparedForStream {
//     role: MessageRole;
//     modal: MessageModal;
// }

interface StreamingState {
    isStreaming: boolean;
    isPaused: boolean;
    //prepared?: PreparedForStream;
    setStreaming: (isStreaming: boolean) => void;
    setPaused: (isPaused: boolean) => void;
    //setPrepared: (prepared?: PreparedForStream) => void;
    getState: () => StreamingState;
}

export const useStreamingStore = create<StreamingState>((set, get) => ({
    isStreaming: false,
    isPaused: false,
    prepared: undefined,

    setStreaming: (isStreaming: boolean) =>
        set({ isStreaming }),

    setPaused: (isPaused: boolean) =>
        set({ isPaused }),

    // setPrepared: (prepared?: PreparedForStream) =>
    //     set({ prepared }),

    getState: () => {
        return get();
    }
}));
