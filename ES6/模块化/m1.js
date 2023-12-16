TODO://分别暴露
console.log('分别暴露');
export let a = 1;
export function fn(){
    console.log('fn');
}
export class Person{
    constructor(name){
        this.name = name;
    }
    showName(){
        console.log(this.name);
    }
}