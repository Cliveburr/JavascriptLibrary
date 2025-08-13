import React, { useState } from 'react';
import { Button } from '../ui/buttons/Button';
import { Card } from '../ui/card/Card';

interface CodeExampleProps {
    title: string;
    description?: string;
    code: string;
    children: React.ReactNode;
    className?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({
    title,
    description,
    code,
    children,
    className = ''
}) => {
    const [showCode, setShowCode] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            // Aqui você poderia adicionar uma notificação de sucesso
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <Card variant="outlined" padding="lg" className={className}>
            <div className="space-y-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {description && (
                            <p className="text-secondary text-sm mt-xs">{description}</p>
                        )}
                    </div>
                    <div className="flex gap-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCode(!showCode)}
                        >
                            {showCode ? '👁️ Hide' : '👁️ Code'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                        >
                            📋 Copy
                        </Button>
                    </div>
                </div>

                {/* Preview */}
                <div className="border rounded-md p-md bg-surface">
                    <div className="mb-sm">
                        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                            Preview
                        </span>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>

                {/* Code */}
                {showCode && (
                    <div className="border rounded-md bg-dark">
                        <div className="px-md py-sm border-b border-gray-600">
                            <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                                Code
                            </span>
                        </div>
                        <pre className="p-md overflow-x-auto">
                            <code className="text-sm text-gray-100 font-mono">
                                {code}
                            </code>
                        </pre>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CodeExample;
