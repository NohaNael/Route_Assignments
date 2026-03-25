Essay Questions:
Question(1):
What is the difference between forEach and for...of? When would you use each?

forEach is an array method that executes a provided function once for each array element. It cannot be broken out of early (no break). 

for...of is a loop that allows you to iterate over iterable objects like arrays, strings, maps, and sets. It supports breaking out of the loop.

You would use forEach when you need to perform an operation on each element of an array and do not need to break out of the loop. You would use for...of when you need more control over the iteration, such as breaking out of the loop.

Question(2):
What is hoisting and what is the Temporal Dead Zone (TDZ)? Explain with examples.

Hoisting is where variables declarations are moved to the top of their containing scope during the compilation phase.

//Example of hoisting:
console.log(hoistedVar); // undefined
var hoistedVar = 5;

The Temporal Dead Zone (TDZ) is the period between the entering of a scope and being declared, where the variable cannot be accessed.
//Example of TDZ:
{
    console.log(Var); // ReferenceError: Cannot access 'Var' before initialization
    let Var = 10;
}


Question(3):

The "==" operator is used for loose equality comparison, it checks only the value after performing type coercion.
The "===" operator is used for strict equality comparison, which checks for both value and type without performing type coercion.

Question(4):
Explain how try-catch works and why it is important in async operations.

A try-catch block is used to handle errors in JavaScript. Code inside the try block is executed, and if an error occurs, control jumps to the catch block, where you can handle the error.
In async operations, especially with async/await, try-catch is important because it allows you to catch errors from asynchronous code, preventing the program from crashing and enabling proper error handling.

Question(5):
What’s the difference between type conversion and coercion? provide examples of each.
Type conversion is the process of manually converting a value from one type to another using functions like Number(), String(), or Boolean().

//Example of type conversion:
let num = "123";
let convertedNum = Number(num);
console.log(convertedNum); // 123

Type coercion, is the automatic conversion of values when performing operations involving different types.

//Example of type coercion:
let result = "The answer is " + 42;
console.log(result); // "The answer is 42"
