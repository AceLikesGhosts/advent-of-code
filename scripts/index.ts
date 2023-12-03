import assert from 'assert';
import fetch from 'node-fetch';
import { load as CheerioLoad } from 'cheerio';
import path from 'path';
import { mkdirSync, writeFileSync } from 'fs';


// #region Validation 
// too bad, i dont care!
const args = process.argv.slice(-2) as unknown as [day: number, year?: number];

const day = args[0] || new Date().getUTCDay();
const year = args[1] || new Date().getUTCFullYear();

assert(!isNaN(+day));
assert(!isNaN(+year));
// #endregion

// #region Setup 
const BASE_ROUTE = 'https://adventofcode.com/';
const QUESTION_ROUTE = BASE_ROUTE + `${ year }/day/${ day }`;
const INPUT_ROUTE = QUESTION_ROUTE + '/input';
const HEADERS = {
    'User-Agent': `Hello! This is a script grabbing the question text and inputs for year ${ year } day ${ day }, (github.com/acelikesghosts/advent-of-code).`
};

interface QuestionResponse {
    description: string;
    input: string;
}

async function getQuestion(): Promise<QuestionResponse> {
    const question = await fetch(QUESTION_ROUTE, { headers: HEADERS });
    const $ = CheerioLoad(await question.text());

    const article = $('article');
    const title = `# ${ article.find('h2').text() }`;
    const body = article.text().replace(title, '');

    const input = await fetch(INPUT_ROUTE, { headers: HEADERS });
    const contents = await input.text();

    return {
        description: `${ title }\n${ body }`,
        input: contents
    };
}

async function main(): Promise<void> {
    const data = await getQuestion();

    const OUT_DIR = path.join(__dirname, '..', String(year), String(day));
    mkdirSync(path.join(OUT_DIR));
    writeFileSync(path.join(OUT_DIR, 'README.md'), data.description);
    writeFileSync(path.join(OUT_DIR, 'input.txt'), data.input);
    mkdirSync(path.join(OUT_DIR, 'src'));
    console.log('! Finished !');
}

// invoke main
void main().catch((e) => { throw e; });
// #endregion