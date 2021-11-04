var prova;
function startChange() {
	prova = setInterval('changeColor()', 2000);
}
startChange();

const colorArray = ['pink', 'plum', 'darksalmon', 'RosyBrown', 'goldenrod'];
let i=0;
function changeColor() {	
	document.bgColor = colorArray[i];
	i=(i+1) % colorArray.length ;
}

document.querySelector('.stopChange').addEventListener("click", stopChange);
document.querySelector('.startChange').addEventListener("click", startChange);


function stopChange() {
	clearInterval(prova);
}