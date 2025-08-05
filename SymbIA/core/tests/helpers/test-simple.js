// Teste rápido em JavaScript
function testSimple() {
    // Simulação simplificada da função
    const sections = [
        { text: '### Title: ', name: 'title' },
        { text: '### Reflection: ', name: 'reflection' },
        { text: '### Action: ', name: 'action' }
    ];

    let buffer = '';
    let currentSection = null;
    let result = { title: '', reflection: '', action: '' };

    function parse(content) {
        buffer += content;

        // Exemplo simples do comportamento esperado
        console.log(`Input: "${content}"`);
        console.log(`Buffer: "${buffer}"`);

        // Procura por seções
        for (const section of sections) {
            const index = buffer.indexOf(section.text);
            if (index !== -1) {
                currentSection = section.name;
                const afterMarker = buffer.substring(index + section.text.length);

                // Procura próxima seção
                let nextIndex = afterMarker.length;
                for (const nextSection of sections) {
                    const nextPos = afterMarker.indexOf(nextSection.text);
                    if (nextPos !== -1 && nextPos < nextIndex) {
                        nextIndex = nextPos;
                    }
                }

                result[section.name] = afterMarker.substring(0, nextIndex);

                // Se há próxima seção, processa ela também
                if (nextIndex < afterMarker.length) {
                    // Recursivamente processa o resto
                    const remaining = afterMarker.substring(nextIndex);
                    buffer = remaining;
                    return parse('');
                }

                break;
            }
        }

        // Se não encontrou seção mas tem seção atual, adiciona à seção atual
        if (currentSection && !sections.some(s => buffer.includes(s.text))) {
            if (result[currentSection]) {
                result[currentSection] += content;
            } else {
                result[currentSection] = content;
            }
        }

        return { ...result };
    }

    console.log('=== Teste 1 ===');
    console.log(JSON.stringify(parse('### '), null, 2));

    console.log('\n=== Teste 2 ===');
    console.log(JSON.stringify(parse('Title: E o começo'), null, 2));

    console.log('\n=== Teste 3 ===');
    console.log(JSON.stringify(parse(' de um novo mundo'), null, 2));

    console.log('\n=== Teste 4 ===');
    console.log(JSON.stringify(parse('\n### Reflection: '), null, 2));

    console.log('\n=== Teste 5 ===');
    console.log(JSON.stringify(parse('Toda a reflexão\n### Action: Question'), null, 2));
}

testSimple();
