const path = require('path');
const fs = require('fs');

const DirPath = process.argv[2];
let summaryScript_code;
let copyright;

(function (){
        let fl=true;
        fs.access(DirPath,(err)=>
        {
            if(err) {
                console.log(err);

                console.log("Path error");
                fl = false;
            }
        })

        if(fl){
            let filesDir=createFilesDirectory();
            createSummaryScriptCode();
            createSummaryScriptFile();
            setCopyright()
        }
    }
)();

function setCopyright()
{
    fs.readFile("copyright.json", (err, data) => {
        if (err)
        {
            console.error("Copyright file error");
        }
        else
        {
            copyright = JSON.parse(data);
        }
    })
}
function createFilesDirectory()
{
    let dirPath = `${DirPath}\\${path.basename(DirPath)}`;
    fs.mkdir(dirPath,(err)=>{
        if(err) {
            console.log("Make dir error");
        }
    });
    return path;
}


function createSummaryScriptFile() {

    fs.appendFile(`${DirPath}\\summary.js`, summaryScript_code, (err) => {
        console.log('The data was added to file!');
    });
}

function createSummaryScriptCode(){
    summaryScript_code =
        'const fs = require(\'fs\');\n' +
        'const path = require(\'path\');\n' +
        '\n' +
        'function getFiles (dir){\n' +
        '\n' +
        '    let files = fs.readdirSync(dir);\n' +
        '    for (let i in files){\n' +
        '        let name = dir + path.sep + files[i];\n' +
        '        if (fs.statSync(name).isDirectory()){\n' +
        '            getFiles(name);\n' +
        '        } else {\n' +
        '            console.log(files[i]);\n' +
        '        }\n' +
        '    }\n' +
        '}'
}