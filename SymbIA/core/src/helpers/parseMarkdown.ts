// /*

// const parse = parseMarkedown([
//     { text: '### Title: ', name: 'title' },
//     { text: '### Reflection: ', name: 'reflection' },
//     { text: '### Action: ', name: 'action' }
// ]);

// const content0 = '### ';
// const parse0 = parse(content0);
// // conteudo do parse0
// {
//     "title": "",
//     "reflection": "",
//     "action": ""
// }

// const content1 = 'Title: E o começo';
// const parse1 = parse(content1);
// // conteudo do parse1
// {
//     "title": "E o começo",
//     "reflection": "",
//     "action": ""
// }

// const content2 = 'de um novo mundo';
// const parse2 = parse(content2);
// // conteudo do parse2
// {
//     "title": "de um novo mundo",
//     "reflection": "",
//     "action": ""
// }

// const content3 = '### Reflection: ';
// const parse3 = parse(content3);
// // conteudo do parse3
// {
//     "title": "",
//     "reflection": "",
//     "action": ""
// }

// const content4 = 'Tota a reflexão\n### Action: Question';
// const parse4 = parse(content4);
// // conteudo do parse4
// {
//     "title": "",
//     "reflection": "Tota a reflexão",
//     "action": "Question"
// }

// pesquise como a resposta da função parse proposta consegue ter o tipo forte baseado apenas na chamada do parseMarkdown


// */

// export interface SectionDef {
//     text: string;
//     name: string;
// }

// // Tipo utilitário para extrair os nomes das seções e criar um tipo objeto
// type ParsedSections<T extends readonly SectionDef[]> = {
//     [K in T[number]['name']]: string;
// };

// export function parseMarkdown<T extends readonly SectionDef[]>(
//     sections: T
// ): (content: string) => ParsedSections<T> {
//     // Estado interno do parser
//     let buffer = '';
//     let result: Record<string, string> = {};

//     // Inicializa o resultado com todas as seções vazias
//     sections.forEach(section => {
//         result[section.name] = '';
//     });

//     return function parse(content: string): ParsedSections<T> {
//         // Adiciona o novo conteúdo ao buffer
//         buffer += content;

//         // Reprocessa todo o buffer a cada chamada
//         const tempResult: Record<string, string> = {};
//         sections.forEach(section => {
//             tempResult[section.name] = '';
//         });

//         // Divide o buffer pelas seções definidas
//         let remainingText = buffer;
//         let currentSectionIndex = -1;

//         // Procura pela primeira seção no texto
//         for (let i = 0; i < sections.length; i++) {
//             const sectionMarker = sections[i].text;
//             const markerIndex = remainingText.indexOf(sectionMarker);

//             if (markerIndex !== -1) {
//                 currentSectionIndex = i;
//                 remainingText = remainingText.substring(markerIndex + sectionMarker.length);
//                 break;
//             }
//         }

//         // Se encontrou uma seção inicial, processa a partir dela
//         if (currentSectionIndex !== -1) {
//             let currentSection = sections[currentSectionIndex];
//             let sectionContent = '';

//             // Processa o texto restante
//             while (remainingText.length > 0) {
//                 let nextSectionIndex = -1;
//                 let nextMarkerPos = remainingText.length;

//                 // Procura pela próxima seção
//                 for (let i = 0; i < sections.length; i++) {
//                     const markerPos = remainingText.indexOf(sections[i].text);
//                     if (markerPos !== -1 && markerPos < nextMarkerPos) {
//                         nextMarkerPos = markerPos;
//                         nextSectionIndex = i;
//                     }
//                 }

//                 // Extrai o conteúdo da seção atual
//                 sectionContent = remainingText.substring(0, nextMarkerPos);
//                 tempResult[currentSection.name] = sectionContent;

//                 // Se há próxima seção, move para ela
//                 if (nextSectionIndex !== -1) {
//                     currentSection = sections[nextSectionIndex];
//                     remainingText = remainingText.substring(nextMarkerPos + currentSection.text.length);
//                     currentSectionIndex = nextSectionIndex;
//                 } else {
//                     break;
//                 }
//             }
//         }

//         // Atualiza o resultado global
//         result = tempResult;

//         // Limpa e formata o resultado final
//         const cleanedResult: Record<string, string> = {};
//         sections.forEach(section => {
//             let content = result[section.name] || '';
//             // Remove quebras de linha extras no início e fim
//             content = content.replace(/^\n+/, '').replace(/\n+$/, '');
//             cleanedResult[section.name] = content;
//         });

//         return cleanedResult as ParsedSections<T>;
//     };
// }