const fs = require('node:fs');
const path = require('node:path');

const INPUTS = fs.readFileSync(path.join(__dirname, '..', 'input.txt'), { encoding: 'utf-8' }).split('\n');

const isNumber = (/** @type {string} */ str) => /\d/g.test(str);

let output = 0;

function getValue(input) {
    let start = void 0;
    let end = void 0;
    for(let i = 0; i < input.length; i++) {
        const isValid = isNumber(input[i]);
        if(!isValid) continue;

        if(!start) start = input[i];
        end = input[i];
    }

    output += Number(`${start}${end}`);
}

INPUTS.forEach((str) => getValue(str));
console.log(output);