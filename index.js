console.log('Hello World');
const name = process.argv[2];

console.log(`Hi ${name}!`);
const args = process.argv.slice(2);
args.forEach((val,index)=>{
        console.log(val);
    })