TODO://统一暴露
console.log('统一暴露');
let a = 1;
function fn(){
    console.log('fn');
}
class Person{
    constructor(name){
        this.name = name;
    }
    showName(){
        console.log(this.name);
    }
}
export {a,fn,Person};