let x = 10;
let y = 15;
let z = 2;
x += 5;
y = (x-9)*x;
z = z/y;
document.getElementById("ex1").innerHTML = `The result is: x = ${x},  y = ${y},  z = ${z}.`;

document.getElementById("ex1-1").innerHTML = (4+6)/10*(5-3);