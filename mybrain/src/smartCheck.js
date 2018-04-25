
let subject = ['teste', 'tsete', 'tste', 'tette', 'testte'];
let search = 'teste';


function preComputeWord(word) {
    let letters = [];
    for (let i = 0; i < word.length; i++) {
        letters.push({
            letter: word[i],
            position: i,
            used: false
        });
    }

    return {
        text: word,
        letters: letters
    };
}

function getClosestOccur(pre, index, letter) {
    let ex = 0;
    let back = true, foward = true;

    while (back || foward) {

    };

    return null;
}

function computeWord(pre, word) {
    if (pre.text == word) {
        return {
            text: word,
            match: 100
        };
    }

    let letterMap = [];
    for (let i = 0; i < word.length; i++) {
        // checa se a letra ta na posição certa
        if (word[i] == pre.text[i]) {
            letterMap.push({
                position: i,
                letter: word[i],
                isCorrect: true
            });
            continue;
        }

        let firstOccurFoward = pre.text.indexOf(word[i], i);
        let firstOccurBack = pre.text.lastIndexOf(word[i], i);
        let closestOccur = firstOccurFoward < firstOccurBack ? firstOccurFoward :firstOccurBack;


    }
} 



let preSearch = preComputeWord(search);
let result = subject
    .map(s => computeWord(preSearch, s));


var stop = 1;