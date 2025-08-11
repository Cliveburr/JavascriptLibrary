//
// Streaming parser for the format:
//   BODY (arbitrary text, streamed incrementally)
//   <<END-OF-BODY>>
//   JSON (single line; delivered only once the stream ends)
//
// API:
// const parser = createBodyJsonStreamParser({
//   onBody: (chunk) => { /* append chunk to UI */ },
//   onJson: (jsonText) => { /* parse/use jsonText */ },
// });
// parser.process(chunk); // call for each incoming chunk
// parser.end();          // call once when the stream is finished
//
// Notes:
// - The sentinel can be split across chunks; the parser handles it.
// - Body is emitted incrementally in the order received.
// - JSON is accumulated after the sentinel and only emitted once on `end()`.
// - The JSON is expected to be a single line; we do NOT parse it here.
// - If `end()` is called before the sentinel appears, `onJson` will be
//   invoked with an empty string (""). You can treat this as an error if desired.

export interface BodyJsonParser {
    process(chunk: string): void;
    end(content: string): { body: string, JSON: string; } | undefined;
}

enum State {
    Body = 0,
    InJson = 1,
}

const SENTINEL = '<<END-OF-BODY>>';

export function createBodyJsonStreamParser(onBody: (chunk: string) => void): BodyJsonParser {
    let state: State = State.Body;

    // We keep a small tail buffer while searching for the sentinel across chunk boundaries.
    let bodyTail = '';
    //let jsonBuffer = '';

    function flushBodySafely(force: boolean = false) {
        if (bodyTail.length === 0) return;
        if (force) {
            onBody(bodyTail);
            bodyTail = '';
            return;
        }
        // Emit everything except the last (SENTINEL.length - 1) chars
        // to preserve potential sentinel overlap on chunk boundary.
        const safeLen = Math.max(0, bodyTail.length - (SENTINEL.length - 1));
        if (safeLen > 0) {
            const emit = bodyTail.slice(0, safeLen);
            onBody(emit);
            bodyTail = bodyTail.slice(safeLen);
        }
    }

    function process(chunk: string) {
        if (state === State.Body) {
            bodyTail += chunk;

            // Try to find the sentinel in the accumulated buffer.
            const idx = bodyTail.indexOf(SENTINEL);
            if (idx >= 0) {
                // Emit everything before the sentinel as body.
                const before = bodyTail.slice(0, idx);
                if (before) onBody(before);

                // Advance past the sentinel.
                let after = bodyTail.slice(idx + SENTINEL.length);

                // Swallow a single trailing newline after the sentinel if present.
                if (after.startsWith('\r\n')) after = after.slice(2);
                else if (after.startsWith('\n')) after = after.slice(1);

                // Switch to JSON state; anything after the sentinel belongs to JSON.
                state = State.InJson;
                //jsonBuffer = after;
                bodyTail = '';
                return;
            }

            // No sentinel yet; emit safe prefix of the body to keep latency low.
            flushBodySafely(false);
            return;
        }

        // In JSON state: just accumulate.
        //jsonBuffer += chunk;
    }

    function end(content: string) {
        const idx = content.indexOf(SENTINEL);
        if (idx == -1) {
            return undefined;
        }

        const body = content.slice(0, idx);
        const JSON = content.slice(idx + SENTINEL.length);
        return {
            body,
            JSON
        };

        // if (state === State.Body) {
        //     // No sentinel was ever found; flush remaining body and return empty JSON.
        //     flushBodySafely(true);
        //     return '';
        // }

        // // Trim trailing whitespace from the JSON buffer; the contract expects a single line.
        // const jsonText = jsonBuffer.trim();
        // return jsonText;
    }

    return { process, end };
}

