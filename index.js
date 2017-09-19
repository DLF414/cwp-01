const DirPath = process.argv[2];
const path = require('path');
const fs = require('fs');
let summaryScript_code = null;
fs.access(DirPath,(err) => {
    console.log(err ? 'no access!' : 'can read/write');
});
function createSummaryScript() {
    let FinallyScriptPath = DirPath + path.sep + 'summary.js';
    fs.appendFile(FinallyScriptPath, summaryScript_code, (err) => {
        if(err) throw err;
        console.log('data was added to file!');
    });
}
function createSummaryScriptCode(){
    return ;
}
createSummaryScript()