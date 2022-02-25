var Person = function() {}

Person.prototype.getName = function() {
    return "혁진"
}


var hyukjin = new Person()

var chaerin = new Person()

chaerin.getName = () => {
    return "채린"
}

console.log(hyukjin.getName())
console.log(chaerin.getName())