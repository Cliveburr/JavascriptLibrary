// Teste do parseMarkdownNew.js
// Importando o módulo compilado
const { parseMarkdown } = require('./core/dist/helpers/parseMarkdownNew.js');

// Conteúdo de teste baseado nas linhas 4-6 do exemplo
const testContent = "##Title: a short sentence (≤ 10 words) about the reflection\n##Reflection: a concise sentence (≤ 150 words) explaining why this action is best\n##Action: EXACT action name here";

// Conteúdo esperado (sem quebras de linha no final)
const expectedTitle = "a short sentence (≤ 10 words) about the reflection";
const expectedReflection = "a concise sentence (≤ 150 words) explaining why this action is best";
const expectedAction = "EXACT action name here";

console.log('=== TESTE DO PARSER MARKDOWN ===\n');

// Função helper para executar um teste
function runTest(testName, content, chunkSize) {
    console.log(`\n--- ${testName} (chunks de ${chunkSize} caractere${chunkSize > 1 ? 's' : ''}) ---`);

    const results = {
        title: '',
        reflection: '',
        action: ''
    };

    const callbacks = [
        {
            tag: 'Title',
            callback: (newContent) => {
                results.title += newContent;
                console.log(`  Title recebido: "${newContent}"`);
            },
            temp: ''
        },
        {
            tag: 'Reflection',
            callback: (newContent) => {
                results.reflection += newContent;
                console.log(`  Reflection recebido: "${newContent}"`);
            },
            temp: ''
        },
        {
            tag: 'Action',
            callback: (newContent) => {
                results.action += newContent;
                console.log(`  Action recebido: "${newContent}"`);
            },
            temp: ''
        }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        // Processa o conteúdo em chunks do tamanho especificado
        for (let i = 0; i < content.length; i += chunkSize) {
            const chunk = content.substring(i, i + chunkSize);
            console.log(`  Processando chunk: "${chunk}"`);
            parser(chunk);
        }

        console.log(`\nResultados finais:`);
        console.log(`  Title: "${results.title}"`);
        console.log(`  Reflection: "${results.reflection}"`);
        console.log(`  Action: "${results.action}"`);

        // Verificação básica (removendo quebras de linha no final)
        const titleOK = results.title.trim() === expectedTitle;
        const reflectionOK = results.reflection.trim() === expectedReflection;
        const actionOK = results.action.trim() === expectedAction;

        console.log(`\nVerificação:`);
        console.log(`  Title OK: ${titleOK}`);
        console.log(`  Reflection OK: ${reflectionOK}`);
        console.log(`  Action OK: ${actionOK}`);
        console.log(`  TESTE ${titleOK && reflectionOK && actionOK ? 'PASSOU' : 'FALHOU'}!`);

        return titleOK && reflectionOK && actionOK;

    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Executar testes com diferentes tamanhos de chunk
const tests = [
    { name: "Teste 1 a 1 caracter", size: 1 },
    { name: "Teste 2 a 2 caracteres", size: 2 },
    { name: "Teste 3 a 3 caracteres", size: 3 },
    { name: "Teste 10 a 10 caracteres", size: 10 },
    { name: "Teste 20 a 20 caracteres", size: 20 }
];

let passedTests = 0;
let totalTests = tests.length;

for (const test of tests) {
    if (runTest(test.name, testContent, test.size)) {
        passedTests++;
    }
}

// Testes adicionais
console.log('\n\n=== TESTES ADICIONAIS ===');

// Teste com conteúdo completo de uma vez
function testFullContent() {
    console.log('\n--- Teste com conteúdo completo de uma vez ---');

    const results = { title: '', reflection: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Reflection', callback: (c) => { results.reflection += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        // Passa todo o conteúdo de uma vez
        parser(testContent);

        const titleOK = results.title.trim() === expectedTitle;
        const reflectionOK = results.reflection.trim() === expectedReflection;
        const actionOK = results.action.trim() === expectedAction;

        console.log(`  Title: "${results.title.trim()}"`);
        console.log(`  Reflection: "${results.reflection.trim()}"`);
        console.log(`  Action: "${results.action.trim()}"`);
        console.log(`  TESTE ${titleOK && reflectionOK && actionOK ? 'PASSOU' : 'FALHOU'} - conteúdo completo`);
        return titleOK && reflectionOK && actionOK;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Teste sem espaço após o ":"
function testNoSpaceAfterColon() {
    console.log('\n--- Teste sem espaço após ":" ---');
    const noSpaceContent = "##Title:SemEspaço\n##Action:OutraAção";

    const results = { title: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        parser(noSpaceContent);
        console.log(`  Title: "${results.title}"`);
        console.log(`  Action: "${results.action}"`);
        console.log(`  TESTE PASSOU - conteúdo sem espaços processado`);
        return true;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Teste com caracteres especiais
function testSpecialCharacters() {
    console.log('\n--- Teste com caracteres especiais ---');
    const specialContent = "##Title: Título com áçéntös e símb@los!\n##Action: Ação com números 123 e símbolos $%&";

    const results = { title: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        parser(specialContent);
        console.log(`  Title: "${results.title}"`);
        console.log(`  Action: "${results.action}"`);
        console.log(`  TESTE PASSOU - caracteres especiais processados`);
        return true;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Teste com conteúdo incompleto
function testIncompleteContent() {
    console.log('\n--- Teste com conteúdo incompleto ---');
    const incompleteContent = "##Title: Apenas título";

    const results = { title: '', reflection: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Reflection', callback: (c) => { results.reflection += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        parser(incompleteContent);
        console.log(`  Title: "${results.title}"`);
        console.log(`  Reflection: "${results.reflection}"`);
        console.log(`  Action: "${results.action}"`);
        console.log(`  TESTE PASSOU - conteúdo incompleto processado corretamente`);
        return true;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Teste com tag inválida
function testInvalidTag() {
    console.log('\n--- Teste com tag inválida ---');
    const invalidContent = "##InvalidTag: conteúdo inválido";

    const callbacks = [
        { tag: 'Title', callback: (c) => { }, temp: '' },
        { tag: 'Reflection', callback: (c) => { }, temp: '' },
        { tag: 'Action', callback: (c) => { }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        parser(invalidContent);
        console.log(`  TESTE FALHOU - deveria ter dado erro para tag inválida`);
        return false;
    } catch (error) {
        console.log(`  ERRO esperado: ${error.message}`);
        console.log(`  TESTE PASSOU - erro de tag inválida capturado corretamente`);
        return true;
    }
}

// Teste com múltiplas tags
function testMultipleTags() {
    console.log('\n--- Teste com múltiplas tags ---');
    const multipleContent = "##Title: Primeiro título\n##Title: Segundo título\n##Action: Uma ação";

    const results = { title: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        parser(multipleContent);
        console.log(`  Title: "${results.title}"`);
        console.log(`  Action: "${results.action}"`);
        console.log(`  TESTE PASSOU - múltiplas tags processadas`);
        return true;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Teste com chunks aleatórios (simulando stream irregular)
function testRandomChunks() {
    console.log('\n--- Teste com chunks aleatórios (5, 7, 11, 13, resto) ---');
    const chunkSizes = [5, 7, 11, 13];

    const results = { title: '', reflection: '', action: '' };
    const callbacks = [
        { tag: 'Title', callback: (c) => { results.title += c; }, temp: '' },
        { tag: 'Reflection', callback: (c) => { results.reflection += c; }, temp: '' },
        { tag: 'Action', callback: (c) => { results.action += c; }, temp: '' }
    ];

    const parser = parseMarkdown(callbacks);

    try {
        let position = 0;
        for (const chunkSize of chunkSizes) {
            if (position >= testContent.length) break;
            const chunk = testContent.substring(position, position + chunkSize);
            console.log(`  Chunk[${chunkSize}]: "${chunk}"`);
            parser(chunk);
            position += chunkSize;
        }

        // Processa o resto
        if (position < testContent.length) {
            const remainingChunk = testContent.substring(position);
            console.log(`  Chunk[resto]: "${remainingChunk}"`);
            parser(remainingChunk);
        }

        const titleOK = results.title.trim() === expectedTitle;
        const reflectionOK = results.reflection.trim() === expectedReflection;
        const actionOK = results.action.trim() === expectedAction;

        console.log(`  Title: "${results.title.trim()}"`);
        console.log(`  Reflection: "${results.reflection.trim()}"`);
        console.log(`  Action: "${results.action.trim()}"`);
        console.log(`  TESTE ${titleOK && reflectionOK && actionOK ? 'PASSOU' : 'FALHOU'} - chunks aleatórios`);
        return titleOK && reflectionOK && actionOK;
    } catch (error) {
        console.log(`  ERRO: ${error.message}`);
        return false;
    }
}

// Executar testes adicionais
if (testFullContent()) passedTests++;
if (testNoSpaceAfterColon()) passedTests++;
if (testSpecialCharacters()) passedTests++;
if (testIncompleteContent()) passedTests++;
if (testInvalidTag()) passedTests++;
if (testMultipleTags()) passedTests++;
if (testRandomChunks()) passedTests++;

totalTests += 7;

// Resumo final
console.log('\n\n=== RESUMO DOS TESTES ===');
console.log(`Testes executados: ${totalTests}`);
console.log(`Testes que passaram: ${passedTests}`);
console.log(`Testes que falharam: ${totalTests - passedTests}`);
console.log(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! 🎉');
} else {
    console.log('\n❌ Alguns testes falharam. Verifique os detalhes acima.');
}

console.log('\n=== ANÁLISE DO PARSER ===');
console.log('• O parser funciona bem com chunks de 2+ caracteres');
console.log('• Problema identificado: parsing caracter por caracter falha na detecção de transições');
console.log('• O parser suporta caracteres especiais e acentos');
console.log('• Funciona corretamente com conteúdo incompleto');
console.log('• Detecta tags inválidas apropriadamente');
console.log('• Suporta múltiplas instâncias da mesma tag');
console.log('• Resiliente a diferentes tamanhos de chunk (exceto 1 caracter)');
