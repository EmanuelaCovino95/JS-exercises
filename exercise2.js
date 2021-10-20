let resArray = [];
function squareNum() {
	for (let i=1; i<=16; i++) {
		if(i<16) {
			resArray.push(i*i);
		} else {
			resArray.push('end of processing');
		}
	}
	document.getElementById("result").innerHTML = resArray;
}
squareNum();

function numSquare() {
	let num = Math.pow(1, 2);
	for (let i=2; i<=15; i++) {
		num = num + '<br>' + Math.pow(i, 2);
	}
	document.getElementById("pippo").innerHTML = num + '<br>' + 'end of processing';
}
numSquare();