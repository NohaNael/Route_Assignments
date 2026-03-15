// global variable for path module
const x = require("node:path"); 
const y =require("node:fs")
const EM = require('node:events');
const os = require('node:os');

// Question(1):
function logFileInfo() {
    console.log({File: __filename, Dir: __dirname});
}
logFileInfo();


// Question(2):
function fileInfo(path) {
    return  x.basename(path);
}
console.log(fileInfo("/user/files/report.pdf")); 


// Question(3):
function path_build(obj){
    return x.join(obj.dir, obj.name)+obj.ext;
}
console.log(path_build({ dir: "/folder", name: "app", ext: ".js" }));


// Question(4):
function ext_name(path){
    return x.extname(path);
 }
v=ext_name("/docs/readme.md");
console.log(v);


// Question(5):
function path_parse(path){
    const res= x.parse(path);
    return {Name:res.name, Ext:res.ext};
}
console.log(path_parse("/home/app/main.js"));


// Question(6):
function abs_check(path){
    return x.isAbsolute(path);
}
console.log(abs_check("/home/user/file.txt"));


// Question(7):
function path_join(...args){
    return x.join(...args);
}
console.log(path_join("src","components", "App.js"));


// Question(8):
function path_resolve(...args){
    return x.resolve(...args);
}
console.log(path_resolve("./index.js"));


// Question(9):
function joining(p1, p2){
    return x.join(p1, p2);
}
console.log(joining("/folder1","folder2/file.txt"));     


// Question(10):
function delete_file(path){
    y.unlink(path, (error)=>{
        if (error){
            console.log(error);
             return ;
        }
        console.log("The file.txt is deleted.");
        });
}
//delete_file("/path/to/file.txt");

// Question(11):
function mkdir(name){
    try{
        y.mkdirSync(name);
        console.log("Success");
    } catch (error) {
        console.log(error);
    }
}
//mkdir("newFolder");

// Question(12):
function event_emitter(){
    const emitter = new EM();
     emitter.on('start', () => {
        console.log("Welcome event triggered!");
    });

    emitter.emit('start');
}
event_emitter();


// Question(13):
function loginEvent(username) {
    const emitter = new EM();

    emitter.on('login', (user) => {
        console.log(`User logged in: ${user}`);
    });

    emitter.emit('login', username);
}

loginEvent("Ahmed");


// Question(14):
function read_Sync(path){
    try{
        const r=y.readFileSync(path,"utf8");
        console.log("the file content=>" ,r); }
    catch (error){
        console.log(error);
    }
}
read_Sync("./notes.txt");

//question(15):
function write_file(path, content){
    y.writeFile(path,content,(error)=>{
        if (error){
            console.log(error);
            return ;}
        console.log("File is written successfully.");
  })}
//write_file("./async.txt","async save.");


//  Question(16):
function existing(path){
    if (y.existsSync(path)){
        return true;
    }else {
        return false;
    }
}
console.log(existing("./notes.txt"));


// Question(17):
function SystemInfo() {
    return {
        Platform: os.platform(),
        Arch: os.arch()
    };
}

console.log(SystemInfo());