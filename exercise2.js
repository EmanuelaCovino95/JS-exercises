let resArray = [];
function squareNum() {
	for (let i=0; i<15; i++) {
		resArray.push(i*i);
	}
	resArray.push('end of processing');
	document.getElementById("result").innerHTML = resArray;
	
}
squareNum();

function numSquare() {
	let num = Math.pow(0, 2);
	for (let i=1; i<15; i++) {
		num = num + '<br>' + Math.pow(i, 2);
	}
	document.getElementById("pippo").innerHTML = num + '<br>' + 'end of processing';
}
numSquare();