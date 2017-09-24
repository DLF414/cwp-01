const path = require('path');
const fs = require('fs');

const DIR_PATH = process.argv[2];
const EXTNAME_TXT = '.txt';

let copyright;
let summaryScript_code =
    'const fs = require(\'fs\');\n' +
    'const path = require(\'path\');\n' +
    '\n' +
    '(function getFiles(baseDir) {\n' +
    '    fs.readdir(baseDir, function (err, files){\n' +
    '        for (let i in files) {\n' +
    '            let currentDir = baseDir + path.sep + files[i];\n' +
    '            fs.stat(currentDir, (err, stats) => {\n' +
    '                    if (stats.isDirectory()) {\n' +
    '                        getFiles(currentDir);\n' +
    '                    } else {\n' +
    '                        console.log(path.relative(__dirname, currentDir));\n' +
    '                    }\n' +
    '                }\n' +
    '            );\n' +
    '        }\n' +
    '    });\n' +
    '})(__dirname, null);';


(() => {
    let fl = true;
    fs.access(DIR_PATH, (err) => {
            if (err) {
                console.log(err);
                console.log("Ошибка пути");
            }
            else {
                let TxtFilesDir = createTxtFilesDirectory();
                createSummaryScriptFile();
                setCopyright();
                createTxtFilesCopy(DIR_PATH, TxtFilesDir);
                whatchDir(DIR_PATH);
            }
        }
    )
})();

function setCopyright() {
    fs.readFile("copyright.json", (err, data) => {
        if (err) {
            console.error("Ошибка при чтении файла конфигурации");
            copyright = 'undefinded';
        }
        else {
            copyright = JSON.parse(data);
        }
    })
}

function createTxtFilesDirectory() {
    let dirPath = `${DIR_PATH}\\${path.basename(DIR_PATH)}`;
    fs.mkdir(dirPath, (err) => {
        if (err) {
            console.log("Произошла ошибка при создании директория");
            throw err;
        }
    });
    return dirPath;
}

function createSummaryScriptFile() {

    fs.appendFile(`${DIR_PATH}\\summary.js`, summaryScript_code, (err) => {
        if (err) {
            console.log(err);
            console.log('Не удалось создать скрипт summary.js');
        }
    });
}

function createTxtFilesCopy(dir, TxtFilesDir) {
    fs.readdir(dir, function (err, files) {
        if (err)
            console.log(err);
        else {
            for (let file in files) {
                let CurrentDirOrFile = `${dir}\\${files[file]}`;                              //путь для просмотра
                if (fs.statSync(CurrentDirOrFile).isDirectory()) {
                    createTxtFilesCopy(CurrentDirOrFile, TxtFilesDir);
                } else {
                    if (path.extname(CurrentDirOrFile) === EXTNAME_TXT) {
                        fs.readFile(CurrentDirOrFile, 'utf8', (err, data) => {
                            if (err) {
                                console.log(`Невозможно прочитать файл: ${CurrentDirOrFile}`);
                            }
                            else {
                                writeDataToTxt(TxtFilesDir + path.sep + files[file], data);
                            }
                        });
                    }
                }
            }

        }
    });

}

function writeDataToTxt(filePath, data) {

    let TextToAppend = copyright["copyright"] + data + copyright["copyright"];
    fs.appendFile(filePath, TextToAppend, 'utf8', (err) => {
        if (err) {
            console.log(err);
            console.log("Не удалось записать в файл");
        }
    });
}

function whatchDir(TxtFilesDir) {
    fs.watch(TxtFilesDir +"\\"+ path.basename(DIR_PATH), (eventType, filename) => {
        console.log(`event type is: ${eventType}`);
        if (filename) {
            console.log(`filename provided: ${filename}`);
        } else {
            console.log('filename not provided');
        }
    });
}