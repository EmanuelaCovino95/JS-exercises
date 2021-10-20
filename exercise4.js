function numSquare() {
	let num = Math.pow(1, 2);
	nEnd = document.getElementById('nEnd').value;
	for (let i=2; i<=nEnd; i++) {
		num = num + '<br>' + Math.pow(i, 2);
	}
	document.getElementById("result").innerHTML = num + '<br><br>' + 'end of processing';
}