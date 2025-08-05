import { parseMarkdown, SectionDef } from '../../src/helpers/parseMarkdown';

// Simulação simples baseada no exemplo do comentário
function testParseMarkdown() {
    const sections: SectionDef[] = [
        { text: '### Title: ', name: 'title' },
        { text: '### Reflection: ', name: 'reflection' },
        { text: '### Action: ', name: 'action' }
    ];

    const parse = parseMarkdown(sections);

    console.log('=== Teste 1: "### " ===');
    const result1 = parse('### ');
    console.log(JSON.stringify(result1, null, 2));
    console.log('Expected: title="", reflection="", action=""');

    console.log('\n=== Teste 2: "Title: E o começo" ===');
    const result2 = parse('Title: E o começo');
    console.log(JSON.stringify(result2, null, 2));
    console.log('Expected: title="E o começo", reflection="", action=""');

    console.log('\n=== Teste 3: " de um novo mundo" ===');
    const result3 = parse(' de um novo mundo');
    console.log(JSON.stringify(result3, null, 2));
    console.log('Expected: title="E o começo de um novo mundo", reflection="", action=""');

    console.log('\n=== Teste 4: "\\n### Reflection: " ===');
    const result4 = parse('\n### Reflection: ');
    console.log(JSON.stringify(result4, null, 2));
    console.log('Expected: title="E o começo de um novo mundo", reflection="", action=""');

    console.log('\n=== Teste 5: "Toda a reflexão\\n### Action: Question" ===');
    const result5 = parse('Toda a reflexão\n### Action: Question');
    console.log(JSON.stringify(result5, null, 2));
    console.log('Expected: title="E o começo de um novo mundo", reflection="Toda a reflexão", action="Question"');
}

testParseMarkdown();
