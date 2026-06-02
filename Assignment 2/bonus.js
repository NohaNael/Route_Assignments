var findKthPositive = function(arr, k) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        let missing = arr[mid] - (mid + 1);

        if (missing < k) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left + k;

    
};

let arr = [2,3,4,7,11];
console.log(findKthPositive(arr, 5));