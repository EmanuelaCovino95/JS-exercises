var i = 0;
var tOC;
var switchOn = true;


function changeColor() {
	const colorArray = ['pink', 'plum', 'darksalmon', 'RosyBrown', 'goldenrod'];
	document.bgColor = colorArray[i];
	
	if (i < 4) {
		tOC = setTimeout(changeColor, 15000);
		i = i + 1;
	} else {
		i = 0;
		tOC = setTimeout(changeColor, 15000);
	}
}


function startChange() {
  if (!switchOn) {
    switchOn = true;
    changeColor();
  }
}

function stopChange() {
  clearTimeout(tOC);
  switchOn = false;
}