import { parseMarkdown, SectionDef } from '../../src/helpers/parseMarkdown';

// Exemplo de uso prático da função parseMarkdown
export function createMarkdownStreamParser() {
    // Define as seções que queremos extrair
    const sections: SectionDef[] = [
        { text: '### Title: ', name: 'title' },
        { text: '### Reflection: ', name: 'reflection' },
        { text: '### Action: ', name: 'action' }
    ];

    // Cria o parser
    const parse = parseMarkdown(sections);

    // Retorna a função de parsing
    return parse;
}

// Exemplo de uso com streaming
export function exampleUsage() {
    const parser = createMarkdownStreamParser();

    console.log('=== Simulando streaming de conteúdo markdown ===\n');

    // Simula chunks de conteúdo chegando aos poucos
    const chunks = [
        '### ',
        'Title: Análise de',
        ' código\n\nEste é um exemplo de análise.\n\n### ',
        'Reflection: A análise mostrou que',
        ' o código precisa de melhorias\n',
        'na estrutura.\n\n### Action: ',
        'Refatorar as funções principais'
    ];

    chunks.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1}: "${chunk}"`);
        const result = parser(chunk);
        console.log('Resultado atual:', JSON.stringify(result, null, 2));
        console.log('---\n');
    });
}

// Demonstração de tipagem forte
export function typingExample() {
    const customSections = [
        { text: '## Summary: ', name: 'summary' },
        { text: '## Details: ', name: 'details' },
        { text: '## Conclusion: ', name: 'conclusion' }
    ] as const; // O 'as const' é importante para inferência de tipos

    const customParser = parseMarkdown(customSections);

    // TypeScript infere automaticamente o tipo de retorno:
    // { summary: string, details: string, conclusion: string }
    const result = customParser('## Summary: Teste\n## Details: Detalhes');

    // Acesso com tipagem forte - o editor mostrará as propriedades disponíveis
    console.log('Summary:', result.summary);
    console.log('Details:', result.details);
    console.log('Conclusion:', result.conclusion);

    // result.wrongProperty; // Erro de compilação - propriedade não existe
}

// Se executado diretamente
if (require.main === module) {
    exampleUsage();
    console.log('\n=== Exemplo de tipagem ===');
    typingExample();
}
