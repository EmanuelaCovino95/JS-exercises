function addTo() {
	num1 = document.getElementById("firstNumber").value;
	num2 = document.getElementById("secondNumber").value;
	document.getElementById("result").innerHTML = num1*1+num2*1;
}

function subtractFrom() {
	num1 = document.getElementById("firstNumber").value;
	num2 = document.getElementById("secondNumber").value;
	document.getElementById("result").innerHTML = num1 - num2;
}

function multiplyBy() {
	num1 = document.getElementById("firstNumber").value;
	num2 = document.getElementById("secondNumber").value;
	document.getElementById("result").innerHTML = num1 * num2;
}

function divideBy() { 
	var num1 = document.getElementById("firstNumber").value;
	var num2 = document.getElementById("secondNumber").value;
	document.getElementById("result").innerHTML = num1 / num2;
}

function myCalculator() {
	var res2;
	var firNum = document.getElementById("numberOne").value;
	var secNum = document.getElementById('numberTwo').value;
	if (document.getElementById('mathOp').value === '+') {
		res2 = firNum*1+secNum*1;
	} else if (document.getElementById('mathOp').value === '-') {
		res2 = firNum - secNum;
	} else if (document.getElementById('mathOp').value === '*') {
		res2 = firNum * secNum;
	}  else if (document.getElementById('mathOp').value === '/') {
		res2 = firNum / secNum;
	} 
	document.getElementById('result2').innerHTML = res2;
}