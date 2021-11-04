function checkUsername() {
	userArray = ['AlessandroC', 'RobertoG', 'EmanuelaC', 'GiuseppeD', 'SalvatoreL', 'AndreaF'];
	userID = document.getElementById("username").value;
	for (let i=0; i<userArray.length; i++) {
		if (userArray[i] === userID) {
			window.open("LinkPage.html", "_self");
		} else {
			document.getElementById("notice").style.display='block';
		}
	}
}

