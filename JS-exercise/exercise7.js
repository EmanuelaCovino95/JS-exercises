document.moduloIscrizione.CAP.addEventListener("change",  checkCAP);
document.getElementById("surnameAndName").addEventListener("change", checkSurName);
document.getElementById('bottInvio').addEventListener("click", funzioneInvio);

function checkCAP() {
	var CAP = document.moduloIscrizione.CAP.value;  // = document.getElementById("CAP").value;
	if (CAP.length < 5) {
		alert("Attenzione:\n \"CAP\" deve essere un numero di 5 cifre");
		document.moduloIscrizione.CAP.focus();
		return false;
	} else {
		for (i=0; i<5 ; i++) {
			if (isNaN(CAP.substring(i,i+1))) {
				alert("Attenzione:\n inserire il \"CAP\" correttamente");
				document.moduloIscrizione.CAP.focus();
				break;
			}
		}
	}
}

function checkSurName() {
	var name = document.moduloIscrizione.name.value;
	if (!isNaN(name)) {
		alert("Attenzione:\n il campo \"Cognome e Nome\" non deve essere un numero!");
		document.moduloIscrizione.name.focus();
		return false;
	}
}

function funzioneInvio() {
	var nOmE = document.moduloIscrizione.name.value;
	var sex = document.moduloIscrizione.sex.value;
	var university = document.moduloIscrizione.university.value;
	var workDone = document.moduloIscrizione.workDone.value;
	
	if (!nOmE) {
		alert("Devi inserire Cognome e Nome");
		document.moduloIscrizione.name.focus();
		return false;
	}
	
	else if (!sex) {
		alert("Devi selezionare il sesso");
		document.moduloIscrizione.sex.focus();
		return false;
	}
	
	else if (!university) {
		alert("Devi selezionare un ateneo");
		document.moduloIscrizione.university.focus();
		return false;
	}
	
	else if ((document.moduloIscrizione.workingStudent.checked)&&(!workDone)) {
		alert("Devi specificare il lavoro svolto");
		document.moduloIscrizione.workDone.focus();
		return false;
	} 
	
	else {
		document.moduloIscrizione.action = "elabora_dati.asp";
		document.moduloIscrizione.submit();
	}
}