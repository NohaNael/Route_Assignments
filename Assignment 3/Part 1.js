const { error } = require("console");
const fs=require("node:fs");

//Question 1

const r=fs.createReadStream("./big.txt",{encoding:"utf8"});

r.on("data",(chunk)=>{
    console.log(chunk);
});

r.on("error",(error)=>{
    console.log(error);
});

//Question 2

const read =fs.createReadStream("./source.txt",{encoding:"utf8"});
const w= fs.createWriteStream("./dest.txt");

read.pipe(w);


//Question 3
const zlib=require("node:zlib");
const gzip=zlib.createGzip();
const readStream =fs.createReadStream("./data.txt",{encoding:"utf8"});
const writeStream = fs.createWriteStream("./data.txt.gz");
readStream.pipe(gzip).pipe(writeStream);