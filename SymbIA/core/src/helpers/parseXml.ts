/*
Example XML structure expected from LLM:
```xml
<title>a short sentence (≤ 10 words) about the reflection</title>
<reflection>a concise sentence (≤ 150 words) explaining why this action is best</reflection>
<action>EXACT action name here</action>
```

Usage:
```typescript
const parse = parseXml([
    { tag: 'title', callback: (newContent) => console.log('Title:', newContent) },
    { tag: 'reflection', callback: (newContent) => console.log('Reflection:', newContent) },
    { tag: 'action', callback: (newContent) => console.log('Action:', newContent) }
]);

// Process streaming content
parse('<title>Hello'); // Calls title callback with "Hello"
parse(' World</title>'); // Calls title callback with " World"
parse('<action>Question</action>'); // Calls action callback with "Question"
```
*/

export interface TagCallback {
    tag: string;
    callback: (newContent: string) => void;
    temp?: string;
}

export interface OpenTagCallback {
    tag: string;
    callback: () => void;
}

enum ParseState {
    None,
    OpenTag,
    Content,
    CloseTag
}

export function parseXml(tagCallbacks: TagCallback[], onOpenTagCallbacks?: OpenTagCallback[]): (content: string) => void {
    // Estado interno do parser
    let buffer = '';
    let openedTags: Array<string> = [];
    let temp = '';
    let state = ParseState.None;

    return function process(content: string): void {
        // Clear temps
        tagCallbacks.forEach(t => t.temp = '');

        // Adiciona o novo conteúdo ao buffer
        buffer += content;

        let i = 0;
        while (i < buffer.length) {
            const char = buffer[i];

            switch (state) {
                case ParseState.None:
                    // Se for None, verifica por <
                    if (char === '<') {
                        // Se detectar muda o state para OpenTag, temp = ''
                        state = ParseState.OpenTag;
                        temp = '';
                    }
                    i++;
                    break;

                case ParseState.OpenTag:
                    // Se for OpenTag
                    if (char === '>') {
                        // Se for > passa o conteudo do temp para actualTag e muda o state para Content
                        const thisTag = temp;
                        openedTags.push(thisTag);
                        state = ParseState.Content;
                        i++;
                        const openTagCallback = onOpenTagCallbacks?.find(tc => tc.tag === thisTag);
                        if (openTagCallback) {
                            openTagCallback.callback();
                        }
                    } else {
                        // Se não vai concatenando no temp
                        temp += char;
                        i++;
                    }
                    break;

                case ParseState.Content:
                    // Se for Content
                    if (char === '<') {
                        // Se for < verifica se é início de tag de fechamento
                        if (i + 1 < buffer.length && buffer[i + 1] === '/') {
                            // Se tiver mais no buffer e for '</' 
                            // muda o state para CloseTag, temp = '' e avança o i
                            state = ParseState.CloseTag;
                            temp = '';
                            i += 2; // pula o '</'
                        } else if (i + 1 >= buffer.length) {
                            // Se for < e for final do buffer, para de processar (aguarda mais conteúdo)
                            // Não incrementa i para ficar no mesmo lugar
                            return;
                        } else {
                            // Se for < mas não for '</', abre tag filha
                            state = ParseState.OpenTag;
                            temp = '';
                            i++;
                        }
                    } else {
                        // Else, envia o content pelo callBack do actualTag
                        const tagCallback = tagCallbacks.find(tc => tc.tag === openedTags[openedTags.length - 1]);
                        if (tagCallback) {
                            tagCallback.temp += char;
                        }
                        i++;
                    }
                    break;

                case ParseState.CloseTag:
                    // Se for CloseTag
                    if (char === '>') {
                        const lastTag = openedTags.pop();
                        // Se for > verifica se o temp == lastTag, se não for vai dar throw
                        if (temp !== lastTag) {
                            throw new Error(`Mismatched closing tag: expected '</${lastTag}>' but found '</${temp}>'`);
                        }
                        // Muda o state para None
                        state = ParseState.None;
                        temp = '';
                        i++;
                    } else {
                        // Se não vai concatenando no temp
                        temp += char;
                        i++;
                    }
                    break;
            }
        }

        // Remove caracteres processados do buffer para evitar crescimento ilimitado
        if (i > 0) {
            buffer = buffer.substring(i);
        }

        tagCallbacks.forEach(m => {
            if (m.temp && m.temp.length > 0) {
                m.callback(m.temp);
            }
        });
    };
}