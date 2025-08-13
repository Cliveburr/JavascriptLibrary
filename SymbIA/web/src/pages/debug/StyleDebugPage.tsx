import React from 'react';
import { StyleDebug } from '../../components/debug/StyleDebug';

export const StyleDebugPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface">
            <StyleDebug />
        </div>
    );
};

export default StyleDebugPage;
