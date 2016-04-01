import fs = require('fs');
import token = require('./Tokenizer');

var content = fs.readFileSync('./Code.txt', 'utf8').toString().substr(1);

var tokens = token.Tokenizer.Process(content);

token.Tokenizer.TestContent(tokens, content);

var a = 1;