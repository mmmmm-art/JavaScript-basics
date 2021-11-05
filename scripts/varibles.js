
let age = 16;
let fullName = "Robert Hardy";

let isActive = true;

age = "16";
age = false;

const MAX_AGE = 200;
var foo = 16;
let bar = 10;

console.log(foo, bar);
{
	let bar = 20;
	var foo = 40;

	console.log(foo, bar);
}
console.log(foo, bar);
var foo = 200;
let names = ["Austin", "Andrew", "Priya"];
console.log(names[1]);
let ages = [16, 15, 15];
console.log("%s is %d years old", names[1], ages[1]);
let game = {
	score: 0,
	isOver: false,
	displayScore: function () {
		return "Current Score is " + this.score;
	},
};
console.log(game);
console.log(game.displayScore());
game.isOver = true;
console.log(game);
let add = function (num1, num2) {
	return num1 + num2;
};
let sum = add(3, 10);
console.log(sum);
