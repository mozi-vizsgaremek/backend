const fs = require('node:fs');
const { argv } = require('node:process');

if (argv.length < 3) {
    console.error('no name specified');
    process.exit(1);
}

function pad(obj = 0, n = 2) {
    const str = obj + '';
    const l = str.length;

    // return early if str is already at least n long
    if (l >= n) return str;
    
    return '0'.repeat(n - l) + str;
}

const d = new Date();
const name = argv.slice(2).join('_');

// there's still no date formatter in the node stdlib :)
const formatted = `${d.getUTCFullYear()}-${pad(d.getUTCMonth())}-${pad(d.getUTCDay())}-${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}-${name}.sql`;
fs.writeFileSync(`${__dirname}/../migrations/${formatted}`, '');

console.log(`Created new migration file: ${formatted}`);