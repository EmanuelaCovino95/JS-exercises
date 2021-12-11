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
    var step = input.closest('.step');
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
    var allSpan = opzioni.querySelectorAll('.js-checked');
    var allInput = opzioni.querySelectorAll('input[name="scontrinoFattura"]');
    var datiFatturazione = document.querySelectorAll('.datiFatturazione');

    opzioni.querySelector('.checkmark').style.border = "none";
    allSpan[0].classList.remove('segnalazione');
    allSpan.forEach(span => span.classList.remove('scelto'));
    radioButton.querySelector('.js-checked').classList.add('scelto');
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
        datiFatturazione.querySelector('.pIva').classList.add('deselezionato');
        datiFatturazione.querySelector('.ragioneSociale').classList.add('deselezionato');
        datiFatturazione.querySelector('.codiceFiscale').classList.remove('deselezionato');
        datiFatturazione.querySelector('.nomeCognome').classList.remove('deselezionato');
        datiFatturazione.querySelectorAll('.js-scelto')[1].classList.remove('scelto');
    } else  {
        datiFatturazione.querySelector('.pIva').classList.remove('deselezionato');
        datiFatturazione.querySelector('.ragioneSociale').classList.remove('deselezionato');
        datiFatturazione.querySelector('.codiceFiscale').classList.add('deselezionato');
        datiFatturazione.querySelector('.nomeCognome').classList.add('deselezionato');
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
    var negozio = document.querySelectorAll('input[name="negozio"]')
    
    negozio.forEach(input => input.checked = false);

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
}

var step = document.querySelectorAll('.step');
var contatoreStep = document.querySelectorAll('.stepN');
var modifica = document.querySelectorAll('.modifica');
var modificaInMobile = document.querySelectorAll('.matitaModificaMobile');
var continua = document.querySelectorAll('.continua');

var percorsoConsegna =  document.querySelector('.stepColumn:first-child');
var percorsoRitiro =  document.querySelector('.stepColumn:nth-child(2)');

function changeFromRitiroToConsegna() {
    percorsoConsegna.classList.remove('deselezionato');
    percorsoConsegna.classList.add('selezionato');
    percorsoRitiro.classList.remove('selezionato');
    percorsoRitiro.classList.add('deselezionato');
}

function changeFromConsegnaToRitiro() {
    percorsoConsegna.classList.remove('selezionato');
    percorsoConsegna.classList.add('deselezionato');
    percorsoRitiro.classList.remove('deselezionato');
    percorsoRitiro.classList.add('selezionato');
}

function goToStepTwoConsegna(stepInCorso) {
    stepInCorso.classList.add('completato');
    stepInCorso.style.display='none';
    contatoreStep[0].classList.remove('indicatore');
    contatoreStep[0].style.opacity = '1';
    modifica[0].style.display = 'block';
    modificaInMobile[0].classList.add('ricomparsa');
    modificaInMobile[5].classList.remove('ricomparsa');
    modificaInMobile[6].classList.remove('ricomparsa');
    if(!(step[1].classList.contains('completato'))) {
        step[1].style.display='block';
        contatoreStep[1].classList.add('indicatore');
    } else if (!step[2].classList.contains('completato')) {
        step[2].style.display='block';
        contatoreStep[2].classList.add('indicatore');
        modificaInMobile[1].classList.add('ricomparsa');
    }else if (!step[3].classList.contains('completato')) {
        step[3].style.display='block';
        contatoreStep[3].classList.add('indicatore');
        modificaInMobile[1].classList.add('ricomparsa');
        modificaInMobile[2].classList.add('ricomparsa');
    }else {
        step[4].style.display='block';
        contatoreStep[4].classList.add('indicatore');
        modifica[4].style.display = 'none';
        modificaInMobile[1].classList.add('ricomparsa');
        modificaInMobile[2].classList.add('ricomparsa');
        modificaInMobile[3].classList.add('ricomparsa');
    }
}

function goToStepThreeConsegna() {
    step[1].classList.add('completato');
    step[1].style.display = 'none';
    contatoreStep[1].classList.remove('indicatore');
    contatoreStep[1].style.opacity = '1';
    modifica[1].style.display = 'block';
    modificaInMobile[1].classList.add('ricomparsa');
    if (!step[2].classList.contains('completato')) {
        step[2].style.display = 'block';
        contatoreStep[2].classList.add('indicatore');
    } else if (!step[3].classList.contains('completato')) {
        step[3].style.display = 'block';
        contatoreStep[3].classList.add('indicatore');
    } else {
        step[4].style.display = 'block';
        contatoreStep[4].classList.add('indicatore');
        modifica[4].style.display = 'none';
    }
}

function goToStepFourConsegna() {    
    step[2].classList.add('completato');
    step[2].style.display='none';
    contatoreStep[2].classList.remove('indicatore');
    contatoreStep[2].style.opacity = '1';
    modifica[2].style.display = 'block';
    modificaInMobile[2].classList.add('ricomparsa');
    if (!step[3].classList.contains('completato')) {
        step[3].style.display='block';
        contatoreStep[3].classList.add('indicatore');
    }else {
        step[4].style.display='block';
        contatoreStep[4].classList.add('indicatore');
        modifica[4].style.display = 'none';
    }
}

function goToStepFiveConsegna() {
    step[3].classList.add('completato');
    step[3].style.display='none';
    step[4].style.display='block';
    contatoreStep[3].classList.remove('indicatore');
    contatoreStep[3].style.opacity = '1';
    modifica[3].style.display = 'block';
    modificaInMobile[3].classList.add('ricomparsa');
    contatoreStep[4].classList.add('indicatore');
    modifica[4].style.display = 'none';
}

function goToTheEndConsegna() {
    step[4].classList.add('completato');
    contatoreStep[4].classList.remove('indicatore');
    contatoreStep[4].style.opacity = '1';
    modifica[4].style.display = 'block';
    modificaInMobile[4].classList.add('ricomparsa');
    window.alert('Il tuo acquisto e\' andato a buon fine. \n Grazie per averti scelto!');
}

function goToStepTwoRitiro(stepInCorso) {
    stepInCorso.classList.add('completato');
    stepInCorso.style.display='none';
    modificaInMobile.forEach(matita => matita.classList.remove('ricomparsa'));
    contatoreStep[5].classList.remove('indicatore');
    contatoreStep[5].style.opacity = '1';
    modifica[5].style.display = 'block';
    modificaInMobile[5].classList.add('ricomparsa');
    if(!(step[5].classList.contains('completato'))) {
        step[5].style.display = 'block';
        contatoreStep[6].classList.add('indicatore');
    } else {
        step[6].style.display = 'block';
        contatoreStep[7].classList.add('indicatore');
        modifica[7].style.display = 'none';
        modificaInMobile[6].classList.add('ricomparsa');
    }
}

function goToStepThreeRitiro() {
    step[5].classList.add('completato');
    step[5].style.display='none';
    step[6].style.display='block';
    contatoreStep[6].classList.remove('indicatore');
    contatoreStep[7].classList.add('indicatore');
    contatoreStep[6].style.opacity = '1';
    modifica[6].style.display = 'block';
    modificaInMobile[6].classList.add('ricomparsa');
}

function goToTheEndRitiro() {
    step[6].classList.add('completato');
    contatoreStep[7].classList.remove('indicatore');
    contatoreStep[7].style.opacity = '1';
    modifica[7].style.display = 'block';
    window.alert('Il tuo acquisto e\' andato a buon fine. \n Grazie per averti scelto!');
}

function unoCompletoProsegui(element) {
    var stepInCorso = element.closest('.step');
    var primoRadioButton = stepInCorso.querySelector('.js-input');
    
    if (primoRadioButton.checked) {
        changeFromRitiroToConsegna();
        goToStepTwoConsegna(stepInCorso)
    } else {
        changeFromConsegnaToRitiro();
        goToStepTwoRitiro(stepInCorso)
    }
}

function dueCompletoProsegui() {
    let utente = false;
    let isNotEmpty = true;
    
    document.querySelectorAll('.segnaposto *[required]').forEach(input => {
        if (!input.value) {
            input.closest('div').querySelector('.errore').style.display = 'block';
            input.style.border = '1px solid #DD2727';
            isNotEmpty = false;
        }
    })

    document.querySelectorAll('.inserireDatiPersonali').forEach(form => {
        if (form.classList.contains('segnaposto')) utente = true
    })

    if ((isNotEmpty)&&(utente)) goToStepThreeConsegna();
    
    if (utente) {
        nome = document.querySelector('.segnaposto input[name="nome"]').value;
        cognome = document.querySelector('.segnaposto input[name="cognome"]').value;
        telefono = document.querySelector('.segnaposto input[name="telefono"]').value;
        citta = document.querySelector('.segnaposto input[name="citta"]').value;
        indirizzo = document.querySelector('.segnaposto input[name="indirizzo"]').value;
        nCivico = document.querySelector('.segnaposto input[name="nCivico"]').value;
        provincia = document.querySelector('.segnaposto select[name="provincia"]').value;
        cap = document.querySelector('.segnaposto input[name="cap"]').value;
        email = document.querySelector('.segnaposto input[name="email"]').value;
    
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
    
        document.querySelector('.riepilogoInfo').innerHTML = nome + ' ' + cognome + ' - ' + email;
        document.querySelector('#recapito').value = telefono;
    }
}

function treCompletoProsegui() {
    goToStepFourConsegna();
}

function quattroCompletoProsegui(element) {
    var step = element.closest('.step');
    var inputRequired = step.querySelectorAll('input[required]');
    var opzioni = step.querySelector('.selezionaOpzioniParticolari');
    var input = step.querySelectorAll('input[name="scontrinoFattura"]');

    if ((opzioni.style.display === 'block') && (input[0].checked === false) && (input[1].checked === false) && (input[2].checked === false)) {
        opzioni.querySelector('.js-checked').classList.add('segnalazione');
        opzioni.querySelector('.checkmark').style.border = "1px solid #DD2727";
    }

    if (input[0].checked) {
        let isNotEmpty = true;
        for (i = 0; i < inputRequired.length /2; i++) {
            if ((!inputRequired[i].value)&&(!inputRequired[i].closest('.js-controllo').classList.contains('deselezionato'))) {
                step.querySelectorAll('.errore')[i].style.display = 'block';
                inputRequired[i].style.border = '1px solid #DD2727';
                isNotEmpty = false;
            }
        }
        if (isNotEmpty) goToStepFiveConsegna();
    }

    if (input[1].checked) {
        let isNotEmpty = true;
        for (i = inputRequired.length /2; i < inputRequired.length; i++) {
            if ((!inputRequired[i].value)&&(!inputRequired[i].closest('.js-controllo').classList.contains('deselezionato'))) {
                step.querySelectorAll('.errore')[i].style.display = 'block';
                inputRequired[i].style.border = '1px solid #DD2727';
                isNotEmpty = false;
            }
        }
        if (isNotEmpty) goToStepFiveConsegna();
    }

    if ((opzioni.style.display !== 'block')||(input[2].checked === true)) {
        goToStepFiveConsegna();
    }
}

function cinqueCompletoProsegui(element){
    var carta = document.querySelector('#pagamentoConCarta');
    var paypal = document.querySelector('#pagamentoPaypal');
    var checkBox = document.querySelector('#accettaCondizioni');
    var errore = element.closest('.step').querySelectorAll('.js-errore');

    if (((carta.checked)||(paypal.checked))&&(checkBox.checked)) {
        goToTheEndConsegna();
    }
    if ((carta.checked === false)&&(paypal.checked === false)) {
        errore[0].style.visibility='visible';
    }
    if (checkBox.checked === false) {
        errore[1].style.visibility='visible';
    }
}

function dueBisCompletoProsegui () {
    var provincia = document.querySelector('#selezionareUnaProvincia');
    var negozio = document.querySelectorAll('.itemContainer.selezionato input');

    if (provincia.value !== '') {
        modifica[7].style.display = 'none';
        negozio.forEach(input => {if (input.checked) goToStepThreeRitiro()}) 
    }
}

function treBisCompletoProsegui(element) {
    var telefono = document.querySelector('#recapito');
    var errore = element.closest('.step').querySelector('.errore');

    if (!telefono.value) {
        errore.style.display = 'block';
        telefono.style.border = '1px solid #DD2727';
    } else {
        rimuoveErrore(telefono);
        goToTheEndRitiro();
    }
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
            modifica[i].style.display = 'block';
        }
    }
    if (stepSelected == stepsN[5]) steps[0].style.display='block';
    if(steps[0].classList.contains('completato')) {
        modifica[5].style.display = 'block';
    }
    for(i=6; i<stepsN.length; i++){
        if (stepSelected == stepsN[i]) steps[i-1].style.display='block';
        if(steps[i-1].classList.contains('completato')) {
            modifica[i].style.display = 'block';
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

function modificaStepPrecedenteInMobile (matita) {
    document.querySelectorAll('div.step').forEach(step => step.style.display = 'none');
    document.querySelectorAll('div.stepN').forEach(contatore => contatore.classList.remove('indicatore'));
    var divMatita = matita.closest('.matitaModificaMobile');
    if ((divMatita == modificaInMobile[0])||(divMatita == modificaInMobile[5])) {
        contatoreStep[0].classList.add('indicatore');
        step[0].style.display='block';
    } else if (divMatita == modificaInMobile[1]) {
        contatoreStep[1].classList.add('indicatore');
        step[1].style.display='block';
    } else if (divMatita == modificaInMobile[2]) {
        contatoreStep[2].classList.add('indicatore');
        step[2].style.display='block';
    } else if (divMatita == modificaInMobile[3]) {
        contatoreStep[3].classList.add('indicatore');
        step[3].style.display='block';
    } else if (divMatita == modificaInMobile[4]) {
        contatoreStep[4].classList.add('indicatore');
        step[4].style.display='block';
    } else if (divMatita == modificaInMobile[6]) {
        contatoreStep[6].classList.add('indicatore');
        step[5].style.display='block';
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

    continua[0].addEventListener("click", (e) => unoCompletoProsegui(e.target));

    continua[1].addEventListener("click", () => dueCompletoProsegui());

    continua[2].addEventListener("click", () => treCompletoProsegui());

    continua[3].addEventListener("click", (e) => quattroCompletoProsegui(e.target));

    continua[4].addEventListener("click", (e) => cinqueCompletoProsegui(e.target));

    continua[5].addEventListener("click", () => dueBisCompletoProsegui());

    continua[6].addEventListener("click", (e) => treBisCompletoProsegui(e.target));

    modifica.forEach(matita => {
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