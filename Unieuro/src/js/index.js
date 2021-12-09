const  Mustache  =  require ( 'mustache' );

function renderizzazione(richiesta) {
    var template = document.getElementById("templateUtenti").innerHTML;
    var rendered = Mustache.render(template, richiesta);
    document.querySelector('div.utenteMemorizzato').innerHTML = rendered;
    chiamataAjaxUno();
}

function renderizzazioneUno(richiesta) {
    var template = document.getElementById("templateNegozi").innerHTML;
    var rendered = Mustache.render(template, richiesta);
    document.querySelector('div.inserireNegozi').innerHTML = rendered;
    bindEvents();
}

function settingIniziale () {
    document.querySelectorAll('.riepilogoDati')[3].style.display = 'none';
    document.querySelectorAll('.bi-pencil')[3].style.display = 'none';
    document.querySelectorAll('.bi-trash')[3].style.display = 'none';
    document.querySelector('.stepDue .radioButton input').checked = true;
    document.querySelector('.stepDue .radioButton label span').classList.add('scelto');
    document.querySelector('.stepDue .inserireDatiPersonali').classList.add('segnaposto');
}

var bannerProdotti = document.querySelector('.divProdotto');
function apreBannerProdotti() {
    bannerProdotti.classList.remove('deselezionato');
    bannerProdotti.classList.add('selezionato');
}
function chiudeBannerProdotti() {
    bannerProdotti.classList.remove('selezionato');
    bannerProdotti.classList.add('deselezionato');
}

function selezionaConsegnaRitiro(input) { 
    var step = input.closest('.stepUno');
    step.querySelectorAll('.js-scelto').forEach(span => span.classList.remove('scelto'))
    if (input.checked) {
        var radioButton = input.closest('.radioButton');
        radioButton.querySelector('.js-scelto').classList.add('scelto');
    }
}

function selezionaUtente(utente) {
    var utenteScelto = utente.closest('.js-cliccabile');
    var form = utente.closest('.js-contenitore').querySelector('.inserireDatiPersonali');
    var contenitore = utente.closest('.utenteMemorizzato');
    contenitore.querySelectorAll('.js-scelto').forEach(span => span.classList.remove('scelto'));
    utenteScelto.querySelector('.js-scelto').classList.add('scelto');
    contenitore.querySelectorAll('.inserireDatiPersonali').forEach(form => {
        form.classList.remove('segnaposto');
        form.style.display = 'none';
    })
    form.classList.add('segnaposto');
    var nuovoIndirizzo = document.querySelector('#indirizzoSalvato-0');
    if (nuovoIndirizzo.checked) {
        nuovoIndirizzo.closest('.js-contenitore').querySelector('.inserireDatiPersonali').style.display = 'block';
        nuovoIndirizzo.closest('.radioButton').querySelector('p').style.color = '#3c4043';
        nuovoIndirizzo.closest('.radioButton').querySelector('.checkmark').style.border = 'none';
    }
    nome = document.querySelector('.segnaposto input[name="nome"]').value;
    cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
    telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
    citta = document.querySelector('.segnaposto input[name="citta"]').value;
    indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
    nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
    provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
    cap = document.querySelector('.segnaposto input[name="cap"]').value;
}

function modificaDatiUtente(matita) {
    matita.closest('.js-contenitore').querySelector('form.inserireDatiPersonali').style.display = 'block';
}

function eliminaDatiUtente(cestino) {
    var datiUtente = cestino.closest('.datiUtente');
    datiUtente.style.display = 'none';
    datiUtente.querySelector('.js-scelto').classList.remove('scelto');
    var contenitore = cestino.closest('.js-contenitore').querySelector('.inserireDatiPersonali');
    contenitore.style.display = 'none';
    contenitore.classList.remove('segnaposto');
}

function rimuoveErrore(required) {
    required.closest('div').querySelector('.errore').style.display = 'none';
    required.style.border = '1px solid #e0e1e5';
}

function selezionaTipoConsegna(radioButton) {
    var step = radioButton.closest('.step');
    var input = step.querySelectorAll('input');
    step.querySelectorAll('.js-scelto').forEach(scelta => scelta.classList.remove('scelto'));
    radioButton.closest('.js-button').querySelectorAll('.js-scelto').forEach(scelta => scelta.classList.add('scelto'));
    if (input[1].checked) {
        document.querySelector('.prezzoConsegna').innerHTML = '&euro; 19,99';
        document.querySelector('.prezzoTotale').innerHTML = '&euro; 418,99';
    }
    if (input[0].checked) {
        document.querySelector('.prezzoConsegna').innerHTML = '&euro; 0,00';
        document.querySelector('.prezzoTotale').innerHTML = '&euro; 399,00';
    }
}

function apriOpzioniFattura() {
    document.querySelector('.opzioneDefault').style.display = 'none';
    document.querySelector('.selezionaOpzioniParticolari').style.display = 'block';
}

function selezionaScontrinoFattura(checked) {
    var radioButton = checked.closest('.radioButton');
    var opzioni = checked.closest('.selezionaOpzioniParticolari');
    var allSpan = opzioni.querySelectorAll('.js-scelto');
    var allInput = opzioni.querySelectorAll('input[name="scontrinoFattura"]');
    var datiFatturazione = document.querySelectorAll('.datiFatturazione');
    opzioni.querySelector('.checkmark').style.border = "none";
    allSpan[0].classList.remove('segnalazione');
    allSpan.forEach(span => span.classList.remove('scelto'));
    radioButton.querySelector('.js-scelto').classList.add('scelto');
    if (allInput[0].checked) {
        datiFatturazione[0].style.display='block';
        datiFatturazione[1].style.display='none';
    }
    if (allInput[1].checked) {
        datiFatturazione[0].style.display='none';
        datiFatturazione[1].style.display='block';
    }
    if (allInput[2].checked) {
        datiFatturazione[0].style.display='none';
        datiFatturazione[1].style.display='none';
    }
}

function selezionaTipoCliente(input) {
    var datiFatturazione = input.closest('.datiFatturazione');
    if (input.value == 'privato') {
        datiFatturazione.querySelector('.pIva').style.display='none';
        datiFatturazione.querySelector('.ragioneSociale').style.display='none';
        datiFatturazione.querySelector('.codiceFiscale').style.display='block';
        datiFatturazione.querySelector('.nomeCognome').style.display='block';
        datiFatturazione.querySelectorAll('.js-scelto')[1].classList.remove('scelto');
    } else  {
        datiFatturazione.querySelector('.pIva').style.display='block';
        datiFatturazione.querySelector('.ragioneSociale').style.display='block';
        datiFatturazione.querySelector('.codiceFiscale').style.display='none';
        datiFatturazione.querySelector('.nomeCognome').style.display='none';
        datiFatturazione.querySelectorAll('.js-scelto')[0].classList.remove('scelto');
    }
    datiFatturazione.querySelectorAll('.errore').forEach(errore => errore.style.display = 'none');
    datiFatturazione.querySelectorAll('input[required]').forEach(bordoRosso => bordoRosso.style.border = '1px solid #e0e1e5');
    input.closest('.radioButton').querySelector('.js-scelto').classList.add('scelto');
}

function selezionaComeInvioFattura(input) {
    var radioButton = input.closest('.radioButton')
    radioButton.querySelector('.js-scelto').classList.add('scelto');
    document.querySelectorAll('input[name^=invioFattura]').forEach(scelta => {
        if (scelta.checked === false) {
            scelta.closest('.radioButton').querySelector('.js-scelto').classList.remove('scelto');
        }
    })
}

function selezionaMetodoPagamento(checked) {
    checked.closest('.js-metodoDiPagamento').querySelector('.checkmark').classList.add('bordoBlu');
    var step = checked.closest('.step');
    step.querySelector('.js-errore').style.visibility='hidden';
    step.querySelectorAll('input[name="pagamento"]').forEach(input => {
        if (input.checked === false) {
            input.closest('.js-metodoDiPagamento').querySelector('.checkmark').classList.remove('bordoBlu');
        }
    })
}

function cliccaAccettaCondizioni (accetta) {
    var div = accetta.closest('.accettaCondizioni');
    var step = accetta.closest('.step');
    if (document.querySelector('input#accettaCondizioni').checked) {
        div.querySelector('.js-scelto').classList.add('scelto');
        div.querySelector('.js-cliccabile').classList.add('grassetto');
        step.querySelectorAll('.js-errore')[1].style.visibility='hidden';
    } else {
        div.querySelector('span.js-scelto').classList.remove('scelto');
        div.querySelector('span.js-cliccabile').classList.remove('grassetto');
        step.querySelectorAll('.js-errore')[1].style.visibility='visible';
    }
}

function mostraCondizioni() {
    document.querySelector('.condizioniGeneraliDiVendita').style.display = 'flex';
}

function nascondiCondizioni() {
    document.querySelector('.condizioniGeneraliDiVendita').style.display = 'none';
}

function selezionaProvincia(select) {
    let i = 0;
    var collezioneNegozi = document.querySelectorAll('.itemContainer');
    select.querySelectorAll('option').forEach(opzione => {
        if (opzione.selected) {
            collezioneNegozi[i].classList.remove('deselezionato');
            collezioneNegozi[i].classList.add('selezionato');
        } else {
            collezioneNegozi[i].classList.remove('selezionato');
            collezioneNegozi[i].classList.add('deselezionato');
        }
        i++;
    })
    document.querySelectorAll('input[name="negozio"]').forEach(input => input.checked = false);
}

function unoCompletoProsegui() {
    var percorsoConsegna =  document.querySelector('.stepColumn:first-child');
    var percorsoRitiro =  document.querySelector('.stepColumn:nth-child(2)');
    document.querySelector('div.stepUno').classList.add('completato');
    document.querySelector('div.stepUno').style.display='none';
    if (document.querySelectorAll('.stepUno .radioButton input')[0].checked) {
        percorsoConsegna.classList.remove('deselezionato');
        percorsoConsegna.classList.add('selezionato');
        percorsoRitiro.classList.remove('selezionato');
        percorsoRitiro.classList.add('deselezionato');
        document.querySelector('div.stepN.uno').classList.remove('indicatore');
        document.querySelector('div.stepN.uno').style.opacity = '1';
        document.querySelector('.modifica').style.display = 'block';
        modificaInMobile[0].classList.add('ricomparsa');
        modificaInMobile[5].classList.remove('ricomparsa');
        modificaInMobile[6].classList.remove('ricomparsa');
        if(!(document.querySelector('div.stepDue').classList.contains('completato'))) {
            document.querySelector('div.stepDue').style.display='block';
            document.querySelector('div.stepN.due').classList.add('indicatore');
        } else if (!document.querySelector('div.stepTre').classList.contains('completato')) {
            document.querySelector('div.stepTre').style.display='block';
            document.querySelector('div.stepN.tre').classList.add('indicatore');
            modificaInMobile[1].classList.add('ricomparsa');
        }else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
            document.querySelector('div.stepQuattro').style.display='block';
            document.querySelector('div.stepN.quattro').classList.add('indicatore');
            modificaInMobile[1].classList.add('ricomparsa');
            modificaInMobile[2].classList.add('ricomparsa');
        }else {
            document.querySelector('div.stepCinque').style.display='block';
            document.querySelector('div.stepN.cinque').classList.add('indicatore');
            document.querySelectorAll('.modifica')[4].style.display = 'none';
            modificaInMobile[1].classList.add('ricomparsa');
            modificaInMobile[2].classList.add('ricomparsa');
            modificaInMobile[3].classList.add('ricomparsa');
        }
    } else {
        percorsoConsegna.classList.remove('selezionato');
        percorsoConsegna.classList.add('deselezionato');
        percorsoRitiro.classList.remove('deselezionato');
        percorsoRitiro.classList.add('selezionato');
        modificaInMobile.forEach(matita => matita.classList.remove('ricomparsa'));
        document.querySelectorAll('div.stepN.uno')[1].classList.remove('indicatore');
        document.querySelectorAll('div.stepN.uno')[1].style.opacity = '1';
        document.querySelectorAll('.modifica')[5].style.display = 'block';
        modificaInMobile[5].classList.add('ricomparsa');
        if(!(document.querySelectorAll('div.stepDue')[1].classList.contains('completato'))) {
            document.querySelectorAll('.stepDue')[1].style.display = 'block';
            document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
        } else {
            document.querySelectorAll('div.stepTre')[1].style.display = 'block';
            document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
            document.querySelectorAll('.modifica')[7].style.display = 'none';
            modificaInMobile[6].classList.add('ricomparsa');
        }
    }
}
function dueCompletoProsegui() {
    document.querySelectorAll('.segnaposto *[required]').forEach(input => {
        if (!input.value) {
            input.closest('div').querySelector('.errore').style.display = 'block';
            input.style.border = '1px solid #DD2727';
        }
    })
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
                                    // document.querySelector('.segnaposto').submit();
                                    // document.querySelector('.segnaposto input[type="submit"]').dispatchEvent(new Event("click"));
                                    document.querySelector('div.stepDue').classList.add('completato');
                                    document.querySelector('div.stepDue').style.display = 'none';
                                    document.querySelector('div.stepN.due').classList.remove('indicatore');
                                    document.querySelector('div.stepN.due').style.opacity = '1';
                                    document.querySelectorAll('.modifica')[1].style.display = 'block';
                                    modificaInMobile[1].classList.add('ricomparsa');
                                    if (!document.querySelector('div.stepTre').classList.contains('completato')) {
                                        document.querySelector('div.stepTre').style.display = 'block';
                                        document.querySelector('div.stepN.tre').classList.add('indicatore');
                                    } else if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
                                        document.querySelector('div.stepQuattro').style.display = 'block';
                                        document.querySelector('div.stepN.quattro').classList.add('indicatore');
                                    } else {
                                        document.querySelector('div.stepCinque').style.display = 'block';
                                        document.querySelector('div.stepN.cinque').classList.add('indicatore');
                                        document.querySelectorAll('.modifica')[4].style.display = 'none';
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
}

function treCompletoProsegui() {    
    document.querySelector('div.stepTre').classList.add('completato');
    document.querySelector('div.stepTre').style.display='none';
    document.querySelector('div.stepN.tre').classList.remove('indicatore');
    document.querySelector('div.stepN.tre').style.opacity = '1';
    document.querySelectorAll('.modifica')[2].style.display = 'block';
    modificaInMobile[2].classList.add('ricomparsa');
    if (!document.querySelector('div.stepQuattro').classList.contains('completato')) {
        document.querySelector('div.stepQuattro').style.display='block';
        document.querySelector('div.stepN.quattro').classList.add('indicatore');
    }else {
        document.querySelector('div.stepCinque').style.display='block';
        document.querySelector('div.stepN.cinque').classList.add('indicatore');
        document.querySelector('div.stepN.cinque .modifica').style.display = 'none';
    }
}

function continua() {
    document.querySelector('div.stepQuattro').classList.add('completato');
    document.querySelector('div.stepQuattro').style.display='none';
    document.querySelector('div.stepCinque').style.display='block';
    document.querySelector('div.stepN.quattro').classList.remove('indicatore');
    document.querySelector('div.stepN.quattro').style.opacity = '1';
    document.querySelectorAll('.modifica')[3].style.display = 'block';
    modificaInMobile[3].classList.add('ricomparsa');
    document.querySelector('div.stepN.cinque').classList.add('indicatore');
    document.querySelectorAll('.modifica')[4].style.display = 'none';
}

function quattroCompletoProsegui() {
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
        continua();
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
                                    continua();
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
                                    continua();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function cinqueCompletoProsegui(){
    if (((document.querySelectorAll('.pagamento input')[0].checked === true)||(document.querySelectorAll('.pagamento input')[1].checked === true))&&(document.querySelector('.stepCinque input[type="checkbox"]').checked)) {
        document.querySelector('div.stepCinque').classList.add('completato');
        document.querySelector('div.stepN.cinque').classList.remove('indicatore');
        document.querySelector('div.stepN.cinque').style.opacity = '1';
        document.querySelectorAll('.modifica')[4].style.display = 'block';
        modificaInMobile[4].classList.add('ricomparsa');
    }
    if ((document.querySelectorAll('.pagamento input')[0].checked === false)&&(document.querySelectorAll('.pagamento input')[1].checked === false)) {
        document.querySelector('.pagamento + p').style.visibility='visible';
    }
    if (document.querySelector('.accettaCondizioni input').checked === false) {
        document.querySelector('.accettaCondizioni + p').style.visibility='visible';
    }
}

function dueBisCompletoProsegui () {
    if (document.querySelector('#selezionareUnaProvincia').value !== '') {
        document.querySelectorAll('.modifica')[7].style.display = 'none';
        document.querySelectorAll('.itemContainer.selezionato input').forEach(input => {
            if (input.checked) {
                document.querySelectorAll('div.stepDue')[1].classList.add('completato');
                document.querySelectorAll('div.stepDue')[1].style.display='none';
                document.querySelectorAll('div.stepTre')[1].style.display='block';
                document.querySelectorAll('div.stepN.due')[1].classList.remove('indicatore');
                document.querySelectorAll('div.stepN.tre')[1].classList.add('indicatore');
                document.querySelectorAll('div.stepN.due')[1].style.opacity = '1';
                document.querySelectorAll('.modifica')[6].style.display = 'block';
                modificaInMobile[6].classList.add('ricomparsa');
                document.querySelector('.riepilogoInfo').innerHTML = document.querySelector('.segnaposto input[name="nome"]').value + ' ' + document.querySelector('.segnaposto input[name="cognome"]').value + ' - ' + document.querySelector('.segnaposto input[name="email"]').value;
                document.querySelector('#recapito').placeholder = document.querySelector('.segnaposto input[name="telefono"]').value;
            } 
        }) 
        
    }
}

function treBisCompletoProsegui() {
    document.querySelectorAll('div.stepTre')[1].classList.add('completato');
    document.querySelectorAll('div.stepN.tre')[1].classList.remove('indicatore');
    document.querySelectorAll('div.stepN.tre')[1].style.opacity = '1';
    document.querySelectorAll('.modifica')[7].style.display = 'block';
}

function modificaStepPrecedente(matita) {
    var steps = document.querySelectorAll('div.step');
    var stepsN = document.querySelectorAll('div.stepN');
    var stepSelected = matita.closest('.stepN'); 
    steps.forEach((item)=> {
        if (item.style.display === 'block') {
            item.style.display = 'none';
        }
    })
    for(i=0; i<5; i++){
        if (stepSelected == stepsN[i]) steps[i].style.display='block';
        if(steps[i].classList.contains('completato')) {
            document.querySelectorAll('.modifica')[i].style.display = 'block';
        }
    }
    if (stepSelected == stepsN[5]) steps[0].style.display='block';
    if(steps[0].classList.contains('completato')) {
        document.querySelectorAll('.modifica')[5].style.display = 'block';
    }
    for(i=6; i<stepsN.length; i++){
        if (stepSelected == stepsN[i]) steps[i-1].style.display='block';
        if(steps[i-1].classList.contains('completato')) {
            document.querySelectorAll('.modifica')[i].style.display = 'block';
        }
    }
    stepSelected.querySelector('.modifica').style.display = 'none';
    stepsN.forEach((item)=> {
        if (item.classList.contains('indicatore')) {
            item.classList.remove('indicatore');
        }
    })
    stepSelected.classList.add('indicatore');
}

var modificaInMobile = document.querySelectorAll('.matitaModificaMobile');

function modificaStepPrecedenteInMobile (matita) {
    document.querySelectorAll('div.step').forEach(step => step.style.display = 'none');
    document.querySelectorAll('div.stepN').forEach(contatore => contatore.classList.remove('indicatore'));
    var divMatita = matita.closest('.matitaModificaMobile');
    if ((divMatita == modificaInMobile[0])||(divMatita == modificaInMobile[5])) {
        document.querySelector('div.stepN.uno').classList.add('indicatore');
        document.querySelector('div.stepUno').style.display='block';
    } else if (divMatita == modificaInMobile[1]) {
        document.querySelector('div.stepN.due').classList.add('indicatore');
        document.querySelector('div.stepDue').style.display='block';
    } else if (divMatita == modificaInMobile[2]) {
        document.querySelector('div.stepN.tre').classList.add('indicatore');
        document.querySelector('div.stepTre').style.display='block';
    } else if (divMatita == modificaInMobile[3]) {
        document.querySelector('div.stepN.quattro').classList.add('indicatore');
        document.querySelector('div.stepQuattro').style.display='block';
    } else if (divMatita == modificaInMobile[4]) {
        document.querySelector('div.stepN.cinque').classList.add('indicatore');
        document.querySelector('div.stepCinque').style.display='block';
    } else if (divMatita == modificaInMobile[6]) {
        document.querySelectorAll('div.stepN.due')[1].classList.add('indicatore');
        document.querySelectorAll('div.stepDue')[1].style.display='block';
    }
}


function bindEvents () {

    settingIniziale();

    document.querySelector('span.apriBanner').addEventListener("click", ()=>{apreBannerProdotti()});

    document.querySelector('span.logo').addEventListener("click", ()=>{chiudeBannerProdotti()});

    document.querySelectorAll('.js-input').forEach(input => {
        input.addEventListener("click", (e)=> selezionaConsegnaRitiro(e.target));
    })
    
    document.querySelectorAll('div.js-cliccabile').forEach(utente => {
        utente.addEventListener("click", (e) => selezionaUtente(e.target))
    })
    
    document.querySelectorAll('.bi-pencil').forEach(matita => {
        matita.addEventListener("click", (e) => modificaDatiUtente(e.target))
    })
    
    document.querySelectorAll('.bi-trash').forEach(cestino => {
        cestino.addEventListener("click", (e) => eliminaDatiUtente(e.target))
    })

    document.querySelectorAll('*[required]').forEach(input => {
        input.addEventListener("change", e => rimuoveErrore(e.target))
    });

    document.querySelectorAll('.js-button').forEach(option => {
        option.addEventListener("click", (e) => selezionaTipoConsegna(e.target))
    })

    document.querySelector('.js-alert').addEventListener("click", ()=> apriOpzioniFattura());

    document.querySelectorAll('input[name="scontrinoFattura"]').forEach(input => {
        input.addEventListener("click", (e)=> selezionaScontrinoFattura(e.target))
    }) 

    document.querySelectorAll('.js-tipoDiCliente').forEach(input => {
        input.addEventListener('click', (e) => selezionaTipoCliente(e.target))
    });

    document.querySelectorAll('input[name^=invioFattura]').forEach(input => {
        input.addEventListener("click", (e) => selezionaComeInvioFattura(e.target))
    });

    document.querySelectorAll('input[name="pagamento"]').forEach(radioButton => {
        radioButton.addEventListener("click", e => selezionaMetodoPagamento(e.target));
    })

    document.querySelector('.accettaCondizioni').addEventListener("click", (e) => cliccaAccettaCondizioni(e.target));
    
    document.querySelector('span.js-cliccabile').addEventListener("click", () => mostraCondizioni());
    
    document.querySelector('.close').addEventListener("click", () => nascondiCondizioni());

    document.querySelector('#selezionareUnaProvincia').addEventListener("change", (e) => selezionaProvincia(e.target));

    document.querySelector('.continua').addEventListener("click", () => unoCompletoProsegui());

    document.querySelectorAll('.continua')[1].addEventListener("click", () => dueCompletoProsegui());

    document.querySelectorAll('.continua')[2].addEventListener("click", () => treCompletoProsegui());

    document.querySelectorAll('.continua')[3].addEventListener("click", () => quattroCompletoProsegui());

    document.querySelectorAll('.continua')[4].addEventListener("click", () => cinqueCompletoProsegui());

    document.querySelectorAll('.continua')[5].addEventListener("click", () => dueBisCompletoProsegui());

    document.querySelectorAll('.continua')[6].addEventListener("click", () => treBisCompletoProsegui());

    document.querySelectorAll('.modifica').forEach(matita => {
        matita.addEventListener("click", (e) => modificaStepPrecedente(e.target));
    })

    modificaInMobile.forEach(step => {
        step.addEventListener("click", (e) => modificaStepPrecedenteInMobile(e.target));
    })
}

function chiamataAjaxUno() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "src/json/negoziUnieuro.json", true);
    xhttp.onload = function() {
        var elenco = JSON.parse(xhttp.responseText);
        renderizzazioneUno(elenco);
    }
    xhttp.send();
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