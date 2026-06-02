var createCounter = function(init) {
    let current = init;
    return {
        increment(){
            current++;
            return(current);

        },
        decrement(){
            current--;
            return(current);
        },
        reset(){
            current=init;
            return(current);

        }
    };
    
};


const counter = createCounter(5)
console.log(counter.increment()); // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4
 





