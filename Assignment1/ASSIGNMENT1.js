//Question(1)
console.log(Number("123")+7);

//Question(2)
let val=0;
if(!val){
    console.log("Invalid");
}


//Question(3)
for (let i=1;i<=10;i++){
    if(i%2==0){
        continue;         
    }
    console.log(i);    
}

//Question(4)
const arr=[1,2,3,4,5];
let x=arr.filter(item => item %2==0);
console.log(x);


//Question(5)
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let mergedArray = [...arr1, ...arr2];

console.log(mergedArray);


//Question(6)
let day=2;
switch(day){
    case 1:
        console.log("Sunday");
        break;
    case 2:
        console.log("Monday");
        break;
    case 3:
        console.log("Tuesday");
        break;
    case 4:
        console.log("Wednesday");
        break;
    case 5:
        console.log("Thursday");
        break;
    case 6:
        console.log("Friday");
        break;
    case 7:
        console.log("Saturday");
        break;
    default:
        console.log("Invalid day");
}


//Question(7)
let string_array=["a", "ab", "abc"];
let mapped_array=string_array.map(element => element.length);
console.log(mapped_array);



//Question(8)
function divisible(num){
    if (num%5==0 && num%3==0){
        console.log("Divisible by both");
    }
    else{
        console.log("Not divisible");
    }
}
divisible(15)


//Question(9)
let square_num =num => num*num;
let y =square_num (5)
console.log(y)


//Question(10)
function PersonInfo(personobj) {
    const {name, age} = personobj;
    console.log(`${name} is ${age} years old`);
}
const person = {name: 'John', age: 25};
PersonInfo(person);

//Question(11)
function sum(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sum(1, 2, 3,4,5));           


//Question(12)
function resolveAfter3Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Success');
    }, 3000);
  });
}

resolveAfter3Seconds().then((message) => {
  console.log(message); // Output: "Success"
});


//Question(13)
function max_num(num){
    let x=num[0];
    for(i=0; i<num.length;i++){
        if (num[i] >x) {
            x=num[i];
        }
    }
    return x;
}          
console.log(max_num([1,3,7,2,4]))


//question(14)
function find_keys(obj){
    return Object.keys(obj);
}
console.log(find_keys( {name: "John", age: 30} ))


//Question(15)
function spliting(s){
    return s.split(" ");   
}
console.log(spliting("The quick brown fox"));