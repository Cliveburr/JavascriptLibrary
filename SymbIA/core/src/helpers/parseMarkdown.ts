/*
Example XML structure expected from LLM:
```xml
##Title: a short sentence (≤ 10 words) about the reflection
##Reflection: a concise sentence (≤ 150 words) explaining why this action is best
##Action: EXACT action name here
```

Usage:
```typescript
const parse = parseMarkdown([
    { tag: 'Title', callback: (newContent) => console.log('Title:', newContent) },
    { tag: 'Reflection', callback: (newContent) => console.log('Reflection:', newContent) },
    { tag: 'Action', callback: (newContent) => console.log('Action:', newContent) }
]);

// Process streaming content
parse('##Title: Hello'); // Calls title callback with "Hello"
parse(' World</title>'); // Calls title callback with " World"
parse('<action>Question</action>'); // Calls action callback with "Question"
```
*/

export interface ParseMarkdownCallback {
    tag: string;
    callback: (newContent: string) => void;
    temp?: string;
}

enum ParseState {
    None,
    OnTag,
    AvoidSpace,
    Content
}

export function parseMarkdown(tagCallbacks: ParseMarkdownCallback[]): (content: string) => void {
    let buffer = '';
    let state = ParseState.None;
    let actualTag: ParseMarkdownCallback | undefined;
    let temp = '';

    return function process(content: string): void {
        buffer += content;
        let p = 0;

        for (let i = 0; i < buffer.length; i++) {
            const char = buffer[i];

            switch (state) {
                case ParseState.None:
                    if (char === '#') {
                        // Check if next character is also '#', but only if it exists
                        if (i + 1 < buffer.length && buffer[i + 1] === '#') {
                            state = ParseState.OnTag;
                            temp = '';
                            i++;
                            p += 2;
                        } else if (i + 1 >= buffer.length) {
                            // Don't process this '#' yet, wait for more content
                            break;
                        } else {
                            // Single '#', skip it
                            p++;
                        }
                    } else {
                        p++;
                    }
                    break;
                case ParseState.OnTag:
                    if (char === ':') {
                        const findTag = tagCallbacks.find(tc => tc.tag.toLowerCase() === temp.toLowerCase());
                        if (!findTag) {
                            throw new Error(`Unrecognized tag: ${temp}`);
                        }
                        actualTag = findTag;
                        state = ParseState.AvoidSpace;
                        p++;
                    } else {
                        temp += char;
                        p++;
                    }
                    break;
                case ParseState.AvoidSpace:
                    if (char === ' ') {
                        p++;
                    }
                    else {
                        state = ParseState.Content;
                        if (!actualTag) {
                            throw new Error(`Invalid format on char: ${i}`);
                        }
                        actualTag.temp += char;
                        p++;
                    }
                    break;
                case ParseState.Content:
                    if (char === '#') {
                        // Check if next character is also '#', but only if it exists
                        if (i + 1 < buffer.length && buffer[i + 1] === '#') {
                            // Flush current tag content before switching
                            if (actualTag && actualTag.temp && actualTag.temp.length > 0) {
                                actualTag.callback(actualTag.temp);
                                actualTag.temp = '';
                            }
                            actualTag = undefined;
                            state = ParseState.OnTag;
                            temp = '';
                            i++;
                            p += 2;
                        } else if (i + 1 >= buffer.length) {
                            // Don't process this '#' yet, wait for more content
                            break;
                        } else {
                            // Single '#', add to content
                            if (!actualTag) {
                                throw new Error(`Invalid format on char: ${i}`);
                            }
                            actualTag.temp += char;
                            p++;
                        }
                    }
                    else {
                        if (!actualTag) {
                            throw new Error(`Invalid format on char: ${i}`);
                        }
                        actualTag.temp += char;
                        p++;
                    }
                    break;
            }
        }

        if (p > 0) {
            buffer = buffer.substring(p);
        }

        // Only flush content at the end of processing, not during tag transitions
        tagCallbacks.forEach(m => {
            if (m.temp && m.temp.length > 0) {
                m.callback(m.temp);
                m.temp = '';
            }
        });
    };
}