const  Mustache  =  require ( 'mustache' );

function renderizzazione(richiesta) {
    //mustache renderizza blocchetto 1
    var template = document.getElementById("templateUtenti").innerHTML;
    var rendered = Mustache.render(template, richiesta);
    document.querySelector('div.utenteMemorizzato').innerHTML = rendered;
    bindEvents();
}

function settingIniziale () {
    document.querySelector('.prezzoArticoli').innerHTML = '&euro; 399,00';
    document.querySelector('.prezzoConsegna').innerHTML = '&euro; 0,00';
    document.querySelector('.prezzoTotale').innerHTML = '&euro; 399,00';
    document.querySelector('.stepDue .radioButton input').checked = true;
    document.querySelector('.stepDue .radioButton label span').classList.add('scelto');
    document.querySelector('.stepDue .inserireDatiPersonali').classList.add('segnaposto');
}

function bindEvents () {

    settingIniziale();

    document.querySelector('.colonnaDeiProdotti > span').addEventListener("click", () =>{
        document.querySelector('.divProdotto').style.display = 'block';
    })
    document.querySelector('.divProdotto span.logo').addEventListener("click", () =>{
        document.querySelector('.divProdotto').style.display = 'none';
    })
    
    for (let i=0; i < document.querySelectorAll('.stepUno .radioButton input').length; i++) {
        document.querySelectorAll('.stepUno .radioButton input')[i].addEventListener("click", ()=> {
            if (document.querySelectorAll('.stepUno .radioButton input')[i].checked) {
                document.querySelectorAll('.radioButton label span:first-child')[i].classList.add('scelto');
                for (let j=0; j<document.querySelectorAll('.stepUno .radioButton input').length; j++) {
                    if (j!==i) {
                        document.querySelectorAll('.radioButton label span:first-child')[j].classList.remove('scelto');
                    }
                }
            } 
        })
    }
    document.querySelector('.stepUno .continua').addEventListener("click", () => {
        document.querySelector('div.stepUno').classList.add('completato');
        document.querySelector('div.stepUno').style.display='none';

        if (document.querySelectorAll('.stepUno .radioButton input')[0].checked === true) {
            if(!(document.querySelector('div.stepDue').classList.contains('completato'))) {
                document.querySelector('div.stepDue').style.display='block';
                document.querySelector('div.stepN.due').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[2].classList.add('ricomparsa');
            } else if (!document.querySelector('div.stepTre').classList.contains('completato')) {
                document.querySelector('div.stepTre').style.display='block';
                document.querySelector('div.stepN.tre').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[3].classList.add('ricomparsa');
            }else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
                document.querySelector('div.stepQuattro').style.display='block';
                document.querySelector('div.stepN.quattro').classList.add('indicatore');
                document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
            }else {
                document.querySelector('div.stepCinque').style.display='block';
                document.querySelector('div.stepN.cinque').classList.add('indicatore');
                document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
            }
            document.querySelector('.stepColumn:first-child').classList.remove('deselezionato');
            document.querySelector('.stepColumn:first-child').classList.add('selezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.remove('selezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.add('deselezionato');
            document.querySelector('div.stepN.uno').classList.remove('indicatore');
            document.querySelector('div.stepN.uno .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[0].classList.add('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[1].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[6].classList.remove('ricomparsa');
            document.querySelector('div.stepN.uno').style.opacity = '1';
        } else {
            document.querySelector('.stepColumn:first-child').classList.remove('selezionato');
            document.querySelector('.stepColumn:first-child').classList.add('deselezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.remove('deselezionato');
            document.querySelector('.stepColumn:nth-child(2)').classList.add('selezionato');
            document.querySelectorAll('div.stepN.uno')[1].style.opacity = '1';
            document.querySelectorAll('div.stepN.uno')[1].classList.remove('indicatore');
            document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
            if(!(document.querySelectorAll('div.stepDue')[1].classList.contains('completato'))) {
                document.querySelectorAll('.stepDue')[1].classList.remove('deselezionato');
                document.querySelectorAll('.stepDue')[1].classList.add('selezionato'); 
                document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
            } else {
                document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
                document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
                document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
                document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'none';
            }
            document.querySelectorAll('.matitaModificaMobile')[0].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[1].classList.add('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[2].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[3].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[4].classList.remove('ricomparsa');
            document.querySelectorAll('.matitaModificaMobile')[5].classList.remove('ricomparsa');
        }
    })

    document.querySelector('div.stepN.uno .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.uno').classList.add('indicatore');
        document.querySelector('div.stepUno').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'none';
        if(document.querySelector('div.stepDue').classList.contains('completato')) {
            document.querySelector('div.stepN.due .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepTre').classList.contains('completato')) {
            document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })

    document.querySelectorAll('div.stepN.uno .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.uno')[1].classList.add('indicatore');
        document.querySelector('div.stepUno').style.display='block';
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'none';
        if(document.querySelectorAll('div.stepDue')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
        }
        if(document.querySelectorAll('div.stepTre')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        }
    })

    document.querySelectorAll('.matitaModificaMobile').forEach((step)=> {
        step.addEventListener("click", () => {
            document.querySelectorAll('div.step').forEach((item) => {
                if ((item.style.display === 'block')||(item.classList.contains('selezionato'))) {
                    item.style.display = 'none';
                    item.classList.remove('selezionato');
                }
            })
            document.querySelectorAll('div.stepN').forEach((item) => {
                if (item.classList.contains('indicatore')) {
                    item.classList.remove('indicatore');
                }
            })
            if ((step == document.querySelectorAll('.matitaModificaMobile')[0])||(step == document.querySelectorAll('.matitaModificaMobile')[1])) {
                document.querySelector('div.stepN.uno').classList.add('indicatore');
                document.querySelector('div.stepUno').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[2]) {
                document.querySelector('div.stepN.due').classList.add('indicatore');
                document.querySelector('div.stepDue').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[3]) {
                document.querySelector('div.stepN.tre').classList.add('indicatore');
                document.querySelector('div.stepTre').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[4]) {
                document.querySelector('div.stepN.quattro').classList.add('indicatore');
                document.querySelector('div.stepQuattro').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[5]) {
                document.querySelector('div.stepN.cinque').classList.add('indicatore');
                document.querySelector('div.stepCinque').style.display='block';
            } else if (step == document.querySelectorAll('.matitaModificaMobile')[6]) {
                document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
                document.querySelectorAll('div.stepDue')[1].style.display='block';
            }
        })
    })
    
    let nome;
    let cognome;
    let telefono;
    let citta;
    let indirizzo;
    let nCivico;
    let provincia;
    let cap;

    for (let i= 0; i < document.querySelectorAll('.stepDue:nth-child(9) .radioButton input').length; i++) {
        document.querySelectorAll('.stepDue:nth-child(9) .radioButton input')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].classList.add('segnaposto');
            for (let j= 0; j < document.querySelectorAll('.stepDue:nth-child(9) .radioButton input').length; j++) {
                if (document.querySelectorAll('.stepDue:nth-child(9) .radioButton input')[j].checked === false) {
                    document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].classList.remove('segnaposto');
                    document.querySelectorAll('.stepDue:nth-child(9) .radioButton label > span')[j].classList.remove('scelto');
                    document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].style.display = 'none';
                }
            }
            if (document.querySelectorAll('.stepDue .radioButton input')[i].checked === true) {
                document.querySelectorAll('.stepDue .radioButton  label > span')[i].classList.add('scelto');
            }
            if (document.querySelector('.stepDue input#nuovoIndirizzo').checked === true) {
                document.querySelector('.stepDue .radioButton + form').style.display = 'block';
                document.querySelectorAll('.stepDue .datiUtente + form').forEach(item => item.style.display = 'none');
                document.querySelector('label[for="nuovoIndirizzo"] span').style.color = '#3c4043';
                document.querySelector('#nuovoIndirizzo + span').style.border = 'none';
            }
            nome = document.querySelector('.segnaposto input[name="nome"]').value;
            cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
            telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
            citta = document.querySelector('.segnaposto input[name="citta"]').value;
            indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
            nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
            provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
            cap = document.querySelector('.segnaposto input[name="cap"]').value;
        })
    }

    for (let i=0; i < document.querySelectorAll('.bi-pencil').length; i++) {
        document.querySelectorAll('.bi-pencil')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].style.display = 'block';
        })
    }
    for (let i=0; i < document.querySelectorAll('.bi-trash').length; i++) {
        document.querySelectorAll('.bi-trash')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepDue .datiUtente')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .datiUtente + form')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .inserireDatiPersonali')[i].classList.remove('segnaposto');
            document.querySelectorAll('.stepDue .radioButton label > span')[i].classList.remove('scelto');
        })
    }

    document.querySelector('.stepDue .continua').addEventListener("click", () => {
        for (j=0; j < document.querySelectorAll('.stepDue .inserireDatiPersonali').length; j++) {
            if (document.querySelectorAll('.stepDue .inserireDatiPersonali')[j].classList.contains('segnaposto')) {
                for (i = 0; i < document.querySelectorAll('.segnaposto *[required]').length; i++) {
                    if (!document.querySelectorAll('.segnaposto *[required]')[i].value) {
                        document.querySelectorAll('.segnaposto .errore')[i].style.display = 'block';
                        document.querySelectorAll('.segnaposto *[required]')[i].style.border = '1px solid #DD2727';
                    }
                }
                if (document.querySelector('.segnaposto input[name="nome"]').value !== '') {
                    if (document.querySelector('.segnaposto input[name="cognome"]').value !== '') {
                        if (document.querySelector('.segnaposto input[name="telefono"]').value !== '') {
                            if (document.querySelector('.segnaposto input[name="citta"]').value !== '') {
                                if (document.querySelector('.segnaposto input[name="indirizzo"]').value !== '') {
                                    if (document.querySelector('.segnaposto input[name="nCivico"]').value !== '') {
                                        if (document.querySelector('.segnaposto select[name="provincia"]').value !== '') {
                                            if (document.querySelector('.segnaposto input[name="cap"]').value !== '') {
                                                nome = document.querySelector('.segnaposto input[name="nome"]').value;
                                                cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
                                                telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
                                                citta = document.querySelector('.segnaposto input[name="citta"]').value;
                                                indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
                                                nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
                                                provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
                                                cap = document.querySelector('.segnaposto input[name="cap"]').value;
                                                /* document.querySelector('.segnaposto').submit(); */
                                                /* document.querySelector('.segnaposto input[type="submit"]').dispatchEvent(new Event("click")); */
                                                document.querySelector('div.stepDue').classList.add('completato');
                                                document.querySelector('div.stepDue').style.display = 'none';
                                                if (!document.querySelector('div.stepTre').classList.contains('completato')) {
                                                    document.querySelector('div.stepTre').style.display = 'block';
                                                    document.querySelector('div.stepN.tre').classList.add('indicatore');
                                                } else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
                                                    document.querySelector('div.stepQuattro').style.display = 'block';
                                                    document.querySelector('div.stepN.quattro').classList.add('indicatore');
                                                } else {
                                                    document.querySelector('div.stepCinque').style.display = 'block';
                                                    document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                                    document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                                }
                                                document.querySelector('div.stepN.due').classList.remove('indicatore');
                                                document.querySelector('div.stepN.due .modifica').style.display = 'block';
                                                document.querySelectorAll('.matitaModificaMobile')[2].classList.add('ricomparsa');
                                                document.querySelector('div.stepN.due').style.opacity = '1';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        document.querySelector('.nomeEcognome').innerHTML = nome + ' ' + cognome;
        document.querySelector('.indirizzo').innerHTML = indirizzo + ', ' + nCivico;
        document.querySelector('.citta').innerHTML = cap + ' ' + citta + ' (' + provincia + ')';
        document.querySelector('#nomeEcognome-0').value = nome + ' ' + cognome;
        document.querySelector('#ragioneSociale-0').value = nome + ' ' + cognome;
        document.querySelector('#cittadina-0').value = citta;
        document.querySelector('#via-0').value = indirizzo;
        document.querySelector('#civico-0').value = nCivico;
        document.querySelector('#prov-0').value = provincia;
        document.querySelector('#CAP-0').value = cap;
    })

    for (let i=0; i < document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]').length; i++) {
        document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]')[i].addEventListener("change", () => {
            document.querySelectorAll('.stepDue .inserireDatiPersonali .errore')[i].style.display = 'none';
            document.querySelectorAll('.stepDue .inserireDatiPersonali *[required]')[i].style.border = '1px solid #e0e1e5';
        })
    }

    document.querySelector('div.stepN.due .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.due').classList.add('indicatore');
        document.querySelector('div.stepDue').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'none';
        if(document.querySelector('div.stepTre').classList.contains('completato')) {
            document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })
    
    document.querySelector('#selezionareUnaProvincia').addEventListener("change", () => {
        for(i=0; i<document.querySelectorAll('#selezionareUnaProvincia option').length-1; i++) {
            if (document.querySelectorAll('#selezionareUnaProvincia option')[i+1].selected) {
                document.querySelectorAll('.itemContainer')[i].classList.remove('deselezionato');
                document.querySelectorAll('.itemContainer')[i].classList.add('selezionato');
            } else {
                document.querySelectorAll('.itemContainer')[i].classList.remove('selezionato');
                document.querySelectorAll('.itemContainer')[i].classList.add('deselezionato');
            }
        }
        document.querySelectorAll('.itemContainer input').forEach(input => input.checked = false);
    })
    
    document.querySelectorAll('.stepDue .continua')[1].addEventListener("click", () => {
        if (document.querySelector('#selezionareUnaProvincia').value !== '') {
            document.querySelectorAll('.itemContainer.selezionato input').forEach(input => {
                if (input.checked) {
                    document.querySelectorAll('div.stepDue')[1].classList.add('completato');
                    document.querySelectorAll('div.stepDue')[1].classList.remove('selezionato');
                    document.querySelectorAll('div.stepDue')[1].classList.add('deselezionato')
                    document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
                    document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
                    document.querySelectorAll('div.stepN.due')[1].classList.remove('indicatore');
                    document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
                    document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
                    document.querySelectorAll('.matitaModificaMobile')[6].classList.add('ricomparsa');
                    document.querySelectorAll('div.stepN.due')[1].style.opacity = '1';
                    document.querySelector('.riepilogoInfo').innerHTML = document.querySelector('.segnaposto input[name="nome"]').value + ' ' + document.querySelector('.segnaposto input[name="cognome"]').value + ' - ' + document.querySelector('.segnaposto input[name="email"]').value;
                    document.querySelector('#recapito').placeholder = document.querySelector('.segnaposto input[name="telefono"]').value;
                }
            }) 
            
        }
    })

    document.querySelectorAll('div.stepN.due .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
        document.querySelectorAll('div.stepDue')[1].classList.remove('deselezionato');
        document.querySelectorAll('div.stepDue')[1].classList.add('selezionato');
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'none';
        if(document.querySelectorAll('div.stepTre')[1].classList.contains('completato')) {
            document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        }
    })

    for (let i=0; i<document.querySelectorAll('.stepTre .radioButton').length; i++) { 
        document.querySelectorAll('.stepTre .radioButton')[i].addEventListener("click", () => {
            document.querySelectorAll('.stepTre .flexBox p')[i].classList.add('scelto');
            document.querySelectorAll('.stepTre .flexBox span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.stepTre .radioButton').length; j++) { 
                if(document.querySelectorAll('.stepTre .radioButton input')[j].checked === false) {
                    document.querySelectorAll('.stepTre .flexBox p')[j].classList.remove('scelto');
                    document.querySelectorAll('.stepTre .flexBox span')[j].classList.remove('scelto');
                }
            }
            if (document.querySelectorAll('.stepTre .radioButton input')[1].checked === true) {
                document.querySelector('.prezzoConsegna').innerHTML = '&euro; 19,99';
                document.querySelector('.prezzoTotale').innerHTML = '&euro; 418,99';
            }
            if (document.querySelectorAll('.stepTre .radioButton input')[0].checked === true) {
                document.querySelector('.prezzoConsegna').innerHTML = '&euro; 0,00';
                document.querySelector('.prezzoTotale').innerHTML = '&euro; 399,00';
            }
        })
    }

    document.querySelector('.stepTre .continua').addEventListener("click", () => {
        document.querySelector('div.stepTre').classList.add('completato');
        document.querySelector('div.stepTre').style.display='none';
        if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepQuattro').style.display='block';
            document.querySelector('div.stepN.quattro').classList.add('indicatore');
        }else {
            document.querySelector('div.stepCinque').style.display='block';
            document.querySelector('div.stepN.cinque').classList.add('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
        }
        document.querySelector('div.stepN.tre').classList.remove('indicatore');
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelectorAll('.matitaModificaMobile')[3].classList.add('ricomparsa');
        document.querySelector('div.stepN.tre').style.opacity = '1';
    })

    document.querySelectorAll('.stepTre .continua')[1].addEventListener("click", () => {
        document.querySelectorAll('div.stepN.tre')[1].classList.remove('indicatore');
        document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepTre')[1].classList.add('completato');
        document.querySelectorAll('.matitaModificaMobile')[6].classList.add('ricomparsa');
        document.querySelectorAll('div.stepN.tre')[1].style.opacity = '1';
    })
    
    document.querySelector('div.stepN.tre .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.tre').classList.add('indicatore');
        document.querySelector('div.stepTre').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'none';
        if(document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        }
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })
    
    document.querySelectorAll('div.stepN.tre .modifica')[1].addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
            if (item.classList.contains('selezionato')) {
                item.classList.remove('selezionato');
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
        document.querySelectorAll('div.stepTre')[1].classList.remove('deselezionato');
        document.querySelectorAll('div.stepTre')[1].classList.add('selezionato');
        document.querySelectorAll('div.stepN.uno .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.due .modifica')[1].style.display = 'block';
        document.querySelectorAll('div.stepN.tre .modifica')[1].style.display = 'none';
    })

    document.querySelector('.alert span').addEventListener("click", ()=> {
        document.querySelector('.opzioneDefault').style.display = 'none';
        document.querySelector('.selezionaOpzioniParticolari').style.display = 'block';
    })

    for (let i=0; i<document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input').length; i++) {
        document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[i].addEventListener("click", ()=>{
            document.querySelector('.selezionaOpzioniParticolari > .radioButton  .checkmark').style.border = "none";
            document.querySelector('.selezionaOpzioniParticolari > .radioButton  label span').classList.remove('segnalazione');
            document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  label span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input').length; j++) {
                if(document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[j].checked === false) {
                    document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  label span')[j].classList.remove('scelto');
                }
            }
            if (document.querySelector('.selezionaOpzioniParticolari > .radioButton  input').checked === true) {
                document.querySelectorAll('.datiFatturazione')[1].style.display='none';
                document.querySelector('.datiFatturazione').style.display='block';
            }
            if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[1].checked === true) {
                document.querySelector('.datiFatturazione').style.display='none';
                document.querySelectorAll('.datiFatturazione')[1].style.display='block';
            }
        })
    }

    for (let i=0; i<document.querySelectorAll('.tipoDiCliente input').length;i++) {
        document.querySelectorAll('.tipoDiCliente input')[i].addEventListener('click', ()=>{
            if (document.querySelector('.tipoDiCliente input').checked===true) {
                document.querySelector('.pIva').style.display='none';
                document.querySelector('.ragioneSociale').style.display='none';
                document.querySelector('.codiceFiscale').style.display='block';
                document.querySelector('.nomeCognome').style.display='block';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            } else  {
                document.querySelector('.pIva').style.display='block';
                document.querySelector('.ragioneSociale').style.display='block';
                document.querySelector('.codiceFiscale').style.display='none';
                document.querySelector('.nomeCognome').style.display='none';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            }
            if (document.querySelectorAll('.tipoDiCliente input')[2].checked===true) {
                document.querySelectorAll('.pIva')[1].style.display='none';
                document.querySelectorAll('.ragioneSociale')[1].style.display='none';
                document.querySelectorAll('.codiceFiscale')[1].style.display='block';
                document.querySelectorAll('.nomeCognome')[1].style.display='block';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            } else {
                document.querySelectorAll('.pIva')[1].style.display='block';
                document.querySelectorAll('.ragioneSociale')[1].style.display='block';
                document.querySelectorAll('.codiceFiscale')[1].style.display='none';
                document.querySelectorAll('.nomeCognome')[1].style.display='none';
                for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
                }
            }
            document.querySelectorAll('.tipoDiCliente label span')[i].classList.add('scelto');
            for (j=0; j < 2 ; j++) {
                if (document.querySelectorAll('.tipoDiCliente input')[j].checked === false) {
                    document.querySelectorAll('.tipoDiCliente label span')[j].classList.remove('scelto');
                }
            }
            for (j=2; j < 4 ; j++) {
                if (document.querySelectorAll('.tipoDiCliente input')[j].checked === false) {
                    document.querySelectorAll('.tipoDiCliente label span')[j].classList.remove('scelto');
                }
            }
        })
    }

    for (let i=0; i<document.querySelectorAll('.doveInviareLaFattura input[type="radio"]').length; i++) { 
        document.querySelectorAll('.doveInviareLaFattura input[type="radio"]')[i].addEventListener("click", () => {
            document.querySelectorAll('.doveInviareLaFattura label span')[i].classList.add('scelto');
            for (let j=0; j<document.querySelectorAll('.doveInviareLaFattura input[type="radio"]').length; j++) { 
                if(document.querySelectorAll('.doveInviareLaFattura input[type="radio"]')[j].checked === false) {
                    document.querySelectorAll('.doveInviareLaFattura label span')[j].classList.remove('scelto');
                }
            }
        })
    }

    document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[2].addEventListener("click", ()=> {
        document.querySelector('.datiFatturazione').style.display='none';
        document.querySelectorAll('.datiFatturazione')[1].style.display='none';
    })

    document.querySelector('.stepQuattro .continua').addEventListener("click", () => {
        if (document.querySelector('.selezionaOpzioniParticolari').style.display === 'block') {
            if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[0].checked === false) {
                if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[1].checked === false) {
                    if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton  input')[2].checked === false) {
                        document.querySelector('.selezionaOpzioniParticolari > .radioButton  label span').classList.add('segnalazione');
                        document.querySelector('.selezionaOpzioniParticolari > .radioButton  .checkmark').style.border = "1px solid #DD2727";
                    }
                }
            }
            
        }
        if ((document.querySelector('.selezionaOpzioniParticolari').style.display !== 'block')||(document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[2].checked === true)) {
            document.querySelector('div.stepQuattro').classList.add('completato');
            document.querySelector('div.stepQuattro').style.display='none';
            document.querySelector('div.stepCinque').style.display='block';
            document.querySelector('div.stepN.quattro').classList.remove('indicatore');
            document.querySelector('div.stepN.cinque').classList.add('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
            document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
            document.querySelector('div.stepN.quattro').style.opacity = '1';
        }
        if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[0].checked === true) {
            for (i = 0; i < (document.querySelectorAll('.datiFatturazione form input[required]').length /2); i++) {
                if (!document.querySelectorAll('.datiFatturazione form input[required]')[i].value) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'block';
                    document.querySelectorAll('.datiFatturazione form input')[i].style.border = '1px solid #DD2727';
                }
            }
            if (((document.querySelector('#codiceFiscale-0').value !== '')&&(document.querySelectorAll('.pIva')[0].style.display !== 'block'))||((document.querySelector('#pIva-0').value !== '')&&(document.querySelectorAll('.codiceFiscale')[0].style.display !== 'block'))) {
                if (((document.querySelector('#nomeEcognome-0').value !== '')&&(document.querySelectorAll('.ragioneSociale')[0].style.display !== 'block'))||((document.querySelector('#ragioneSociale-0').value !== '')&&(document.querySelectorAll('.nomeCognome')[0].style.display !== 'block'))) {
                    if (document.querySelector('#cittadina-0').value !== '') {
                        if (document.querySelector('#via-0').value !== '') {
                            if (document.querySelector('#civico-0').value !== '') {
                                if (document.querySelector('#prov-0').value !== '') {
                                    if (document.querySelector('#CAP-0').value !== '') {
                                        document.querySelector('div.stepQuattro').classList.add('completato');
                                        document.querySelector('div.stepQuattro').style.display = 'none';
                                        document.querySelector('div.stepCinque').style.display = 'block';
                                        document.querySelector('div.stepN.quattro').classList.remove('indicatore');
                                        document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
                                        document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
                                        document.querySelector('div.stepN.quattro').style.opacity = '1';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (document.querySelectorAll('.selezionaOpzioniParticolari > .radioButton input')[1].checked === true) {
            for (i = document.querySelectorAll('.datiFatturazione form input[required]').length /2; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
                if (!document.querySelectorAll('.datiFatturazione form input[required]')[i].value) {
                    document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'block';
                    document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #DD2727';
                }
            }
            
            if (((document.querySelector('#codiceFiscale-1').value !== '')&&(document.querySelectorAll('.pIva')[1].style.display !== 'block'))||((document.querySelector('#pIva-1').value !== '')&&(document.querySelectorAll('.codiceFiscale')[1].style.display !== 'block'))) {
                if (((document.querySelector('#nomeEcognome-1').value !== '')&&(document.querySelectorAll('.ragioneSociale')[1].style.display !== 'block'))||((document.querySelector('#ragioneSociale-1').value !== '')&&(document.querySelectorAll('.nomeCognome')[1].style.display !== 'block'))) {
                    if (document.querySelector('#cittadina-1').value !== '') {
                        if (document.querySelector('#via-1').value !== '') {
                            if (document.querySelector('#civico-1').value !== '') {
                                if (document.querySelector('#prov-1').value !== '') {
                                    if (document.querySelector('#CAP-1').value !== '') {
                                        document.querySelector('div.stepQuattro').classList.add('completato');
                                        document.querySelector('div.stepQuattro').style.display='none';
                                        document.querySelector('div.stepCinque').style.display='block';
                                        document.querySelector('div.stepN.quattro').classList.remove('indicatore');
                                        document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
                                        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
                                        document.querySelectorAll('.matitaModificaMobile')[4].classList.add('ricomparsa');
                                        document.querySelector('div.stepN.quattro').style.opacity = '1';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    for (let i=0; i < document.querySelectorAll('.datiFatturazione form input[required]').length; i++) {
        document.querySelectorAll('.datiFatturazione form input[required]')[i].addEventListener("change", () => {
            document.querySelectorAll('.datiFatturazione form .errore')[i].style.display = 'none';
            document.querySelectorAll('.datiFatturazione form input[required]')[i].style.border = '1px solid #e0e1e5';
        })
    }
    
    document.querySelector('div.stepN.quattro .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepN.quattro').classList.add('indicatore');
        document.querySelector('div.stepQuattro').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelector('div.stepN.quattro .modifica').style.display = 'none';
        if(document.querySelector('div.stepCinque').classList.contains('completato')) {
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
        }
    })

    for (let i=0; i<document.querySelectorAll('.pagamento > div').length; i++) { 
        document.querySelectorAll('.pagamento > div')[i].addEventListener("click", () => {
            document.querySelectorAll('.pagamento input')[i].checked = true;
            document.querySelectorAll('.pagamento span')[i].classList.add('scelto');
            document.querySelectorAll('.pagamento > div')[i].classList.add('bordoBlu');
            document.querySelector('.pagamento + p').style.visibility='hidden';
            for (let j=0; j<document.querySelectorAll('.pagamento > div').length; j++) { 
                if(document.querySelectorAll('.pagamento input')[j].checked === false) {
                    document.querySelectorAll('.pagamento span')[j].classList.remove('scelto');
                    document.querySelectorAll('.pagamento > div')[j].classList.remove('bordoBlu');
                }
            }
        })
    }
    document.querySelector('.accettaCondizioni input').addEventListener("click", () => {
        if (document.querySelector('.accettaCondizioni input').checked === true) {
            document.querySelector('.accettaCondizioni label span:first-child').classList.add('scelto');
            document.querySelector('.accettaCondizioni label span:last-child').classList.add('grassetto');
            document.querySelector('.accettaCondizioni + p').style.visibility='hidden';
        } else {
            document.querySelector('div.stepCinque label span:first-child').classList.remove('scelto');
            document.querySelector('div.stepCinque label span:last-child').classList.remove('grassetto');
            document.querySelector('.stepCinque .radioButton + p').style.visibility='visible';
        }
    })
    
    document.querySelector('.accettaCondizioni label span:last-child').addEventListener("click", () => {
        document.querySelector('.condizioniGeneraliDiVendita').style.display = 'flex';
    })
    document.querySelector('.close').addEventListener("click", () => {
        document.querySelector('.condizioniGeneraliDiVendita').style.display = 'none';
    })

    document.querySelector('.stepCinque .continua').addEventListener("click", () => {
        if (((document.querySelectorAll('.pagamento input')[0].checked === true)||(document.querySelectorAll('.pagamento input')[1].checked === true))&&(document.querySelector('.stepCinque input[type="checkbox"]').checked)) {
            document.querySelector('div.stepN.cinque').classList.remove('indicatore');
            document.querySelector('div.stepN.cinque .modifica').style.display = 'block';
            document.querySelectorAll('.matitaModificaMobile')[5].classList.add('ricomparsa');
            document.querySelector('div.stepN.cinque').style.opacity = '1';
        }
        if ((document.querySelectorAll('.pagamento input')[0].checked === false)&&(document.querySelectorAll('.pagamento input')[1].checked === false)) {
            document.querySelector('.pagamento + p').style.visibility='visible';
        }
        if (document.querySelector('.accettaCondizioni input').checked === false) {
            document.querySelector('.accettaCondizioni + p').style.visibility='visible';
        }
    })
    
    document.querySelector('div.stepN.cinque .modifica').addEventListener("click", () => {
        document.querySelectorAll('div.step').forEach((item)=> {
            if (item.style.display === 'block') {
                item.style.display = 'none';
            }
        })
        document.querySelectorAll('div.stepN').forEach((item)=> {
            if (item.classList.contains('indicatore')) {
                item.classList.remove('indicatore');
            }
        })
        document.querySelector('div.stepCinque').style.display='block';
        document.querySelector('div.stepN.uno .modifica').style.display = 'block';
        document.querySelector('div.stepN.due .modifica').style.display = 'block';
        document.querySelector('div.stepN.tre .modifica').style.display = 'block';
        document.querySelector('div.stepN.quattro .modifica').style.display = 'block';
        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
        document.querySelector('div.stepN.cinque').classList.add('indicatore');
    })
}


function chiamataAjax() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "src/json/utenti.json", true);
    xhttp.onload = function() {
        var lista = JSON.parse(xhttp.responseText);
        renderizzazione(lista);
    }
    xhttp.send();
}

function inizializzazione() {
    chiamataAjax();
}

inizializzazione();