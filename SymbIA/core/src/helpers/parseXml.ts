// /*
// Example XML structure expected from LLM:
// ```xml
// <title>a short sentence (≤ 10 words) about the reflection</title>
// <reflection>a concise sentence (≤ 150 words) explaining why this action is best</reflection>
// <action>EXACT action name here</action>
// ```

// Usage:
// ```typescript
// const parse = parseXml([
//     { tag: 'title', callback: (newContent) => console.log('Title:', newContent) },
//     { tag: 'reflection', callback: (newContent) => console.log('Reflection:', newContent) },
//     { tag: 'action', callback: (newContent) => console.log('Action:', newContent) }
// ]);

// // Process streaming content
// parse('<title>Hello'); // Calls title callback with "Hello"
// parse(' World</title>'); // Calls title callback with " World"
// parse('<action>Question</action>'); // Calls action callback with "Question"
// ```
// */

// export interface TagCallback {
//     tag: string;
//     callback: (newContent: string) => void;
// }

// // Tipo utilitário para extrair os nomes das tags e criar um tipo objeto
// type ParsedTags<T extends readonly TagCallback[]> = {
//     [K in T[number]['tag']]: string;
// };

// export function parseXml<T extends readonly TagCallback[]>(
//     tagCallbacks: T
// ): (content: string) => ParsedTags<T> {
//     // Estado interno do parser
//     let buffer = '';
//     let result: Record<string, string> = {};
//     let previousResult: Record<string, string> = {};

//     // Inicializa o resultado com todas as tags vazias
//     tagCallbacks.forEach(tagCallback => {
//         result[tagCallback.tag] = '';
//         previousResult[tagCallback.tag] = '';
//     });

//     return function parse(content: string): ParsedTags<T> {
//         // Adiciona o novo conteúdo ao buffer
//         buffer += content;

//         // Reprocessa todo o buffer a cada chamada
//         const tempResult: Record<string, string> = {};
//         tagCallbacks.forEach(tagCallback => {
//             tempResult[tagCallback.tag] = '';
//         });

//         // Processa cada tag
//         tagCallbacks.forEach(tagCallback => {
//             const openTag = `<${tagCallback.tag}>`;
//             const closeTag = `</${tagCallback.tag}>`;

//             const openIndex = buffer.indexOf(openTag);
//             if (openIndex !== -1) {
//                 const contentStart = openIndex + openTag.length;
//                 const closeIndex = buffer.indexOf(closeTag, contentStart);

//                 if (closeIndex !== -1) {
//                     // Tag completa encontrada
//                     tempResult[tagCallback.tag] = buffer.substring(contentStart, closeIndex);
//                 } else {
//                     // Tag aberta mas não fechada ainda - pega todo o conteúdo após a abertura
//                     // mas remove outros XML tags que podem ter sido iniciados
//                     let content = buffer.substring(contentStart);

//                     // Remove qualquer tag XML que possa ter se misturado
//                     const nextTagStart = content.indexOf('<');
//                     if (nextTagStart !== -1) {
//                         // Verifica se é uma tag de fechamento COMPLETA da tag atual
//                         const remainingContent = content.substring(nextTagStart);
//                         if (remainingContent.startsWith(closeTag)) {
//                             // É a tag de fechamento completa, não inclui no conteúdo
//                             content = content.substring(0, nextTagStart);
//                         } else {
//                             // Verifica se pode ser o INÍCIO de uma tag de fechamento válida
//                             const isPartialCloseTag = closeTag.startsWith(remainingContent);
//                             if (!isPartialCloseTag) {
//                                 // Não é relacionado à tag de fechamento, corta aqui
//                                 content = content.substring(0, nextTagStart);
//                             }
//                             // Se for início de tag de fechamento, mantém o conteúdo completo
//                         }
//                     }

//                     tempResult[tagCallback.tag] = content;
//                 }
//             }
//         });

//         // Chama os callbacks apenas com o novo conteúdo (diferença)
//         tagCallbacks.forEach(tagCallback => {
//             const currentContent = tempResult[tagCallback.tag];
//             const previousContent = previousResult[tagCallback.tag];

//             if (currentContent !== previousContent) {
//                 // Calcula apenas o novo conteúdo adicionado
//                 if (currentContent.startsWith(previousContent)) {
//                     const newContent = currentContent.substring(previousContent.length);
//                     if (newContent) {
//                         // Verifica se o novo conteúdo contém início de tag de fechamento
//                         const closeTag = `</${tagCallback.tag}>`;
//                         const closeTagStart = newContent.indexOf('<');

//                         if (closeTagStart !== -1) {
//                             const potentialCloseTag = newContent.substring(closeTagStart);
//                             const isPartialCloseTag = closeTag.startsWith(potentialCloseTag);

//                             if (isPartialCloseTag) {
//                                 // Se é início de tag de fechamento, envia apenas a parte antes dela
//                                 const contentBeforeCloseTag = newContent.substring(0, closeTagStart);
//                                 if (contentBeforeCloseTag) {
//                                     tagCallback.callback(contentBeforeCloseTag);
//                                 }
//                                 // Não envia a parte da tag de fechamento parcial
//                             } else {
//                                 // Não é tag de fechamento, envia normalmente
//                                 tagCallback.callback(newContent);
//                             }
//                         } else {
//                             // Não tem '<', envia normalmente
//                             tagCallback.callback(newContent);
//                         }
//                     }
//                 } else {
//                     // Se o conteúdo mudou completamente (ex: tag foi fechada), envia tudo
//                     if (currentContent) {
//                         tagCallback.callback(currentContent);
//                     }
//                 }
//             }
//         });        // Atualiza os resultados
//         result = { ...tempResult };
//         previousResult = { ...tempResult };

//         return result as ParsedTags<T>;
//     };
// }