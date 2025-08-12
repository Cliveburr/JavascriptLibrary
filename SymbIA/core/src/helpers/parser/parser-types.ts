
export interface ParserRequest {
    (chunk: string): void;
}

export interface ParserResponse {
    process(chunk: string): void;
    end(content: string): { body: string, JSON: string; } | undefined;
}

