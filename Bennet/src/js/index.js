window.addEventListener("load", function () {
    $('.scegliUnGiorno').slick({
        infinite: false,
        slidesToShow: 5.5,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
        ],
    })
});

window.addEventListener("load", function () {
    $('.scegliUnaFasciaOraria').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    })
});

window.addEventListener("load", function () {
    $('.orariSelezionabili').slick({
        infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
        mobileFirst: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 992,
                settings: 'unslick',
            }
        ]
    });
});

window.addEventListener('resize', function() {
    $('.orariSelezionabili').slick('resize');
});

const dataToday = new Date();
const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const collectionIntervals = ["07:30 - 09:30", "09:30 - 11:30", "11:30 - 13:30", "13:30 - 15:30", "15:30 - 17:30", "17:30 - 19:30", "19:30 - 21:30"];

const giornoCorrente = document.querySelector('.giornoEdata');
const giorni = document.querySelectorAll('.giornoEdata');
const amPm = document.querySelectorAll('.mattinaEpomeriggio');
const fasciaOraria = document.querySelectorAll('.orario');

let j = 0;
giorni.forEach(function (item) {
    dataToday.setDate(dataToday.getDate() + j);
    let dayOfWeek = days[dataToday.getDay()];
    let day = dataToday.getDate();
    let month = months[dataToday.getMonth()];
    item.innerHTML = dayOfWeek + ' ' + day + ' ' + '<br>' + month;
    item.value = dayOfWeek + ' ' + day + ' ' + month;
    j = 1;
});

function valoreFasciaOraria() {
    let ora = 8;
    fasciaOraria.forEach(function (item) {
        item.value = ora;
        ora += 2;
    });
}
valoreFasciaOraria();

fasciaOraria.forEach(function (item) {
    if ((giornoCorrente.classList.contains('selected')) && (dataToday.getHours() > item.value)) {
        item.classList.remove('disponibile');
        item.classList.add('nonDisponibile');
    }
    giorni.forEach(function (option) {
        option.addEventListener("click", function () {
            if (option !== giornoCorrente) {
                if ((item.value < 20) && (item.value > 8)) {
                    item.classList.remove('nonDisponibile');
                    item.classList.add('disponibile');
                }
            } else {
                if (dataToday.getHours() > item.value) {
                    item.classList.remove('disponibile');
                    item.classList.add('nonDisponibile');
                }
            }
        })
    });
});

giorni.forEach(function (item) {
    item.addEventListener("click", function () {
        for (let i = 0; i < giorni.length; i++) {
            if (giorni[i] !== item) {
                giorni[i].classList.remove('selected');
            }
        }
        item.classList.add('selected');
    })
});

fasciaOraria.forEach(function (item) {
    item.addEventListener("click", function () {
        if (item.classList.contains('disponibile')) {
            for (let i = 0; i < fasciaOraria.length; i++) {
                if (fasciaOraria[i] !== item) {
                    fasciaOraria[i].classList.remove('selected');
                }
            }
            item.classList.add('selected');
            document.querySelector('.stepUnoInCorso button').removeAttribute('disabled');
        }
    })
});

amPm.forEach(function (item) {
    item.addEventListener("click", function () {
        for (let i = 0; i < amPm.length; i++) {
            if (amPm[i] !== item) {
                amPm[i].classList.remove('selected');
            }
        }
        item.classList.add('selected');
        if (amPm[0].classList.contains('selected')) {
            fasciaOraria.forEach(function (option) {
                option.style.display = 'block';
            })
        }
        if (amPm[1].classList.contains('selected')) {
            fasciaOraria.forEach(function (option) {
                if (option.value > 13) {
                    option.style.display = 'none';
                }
                if (option.value < 13) {
                    option.style.display = 'block';
                }
            });
        }
        if (amPm[2].classList.contains('selected')) {
            fasciaOraria.forEach(function (option) {
                if (option.value < 13) {
                    option.style.display = 'none';
                }
                if (option.value > 13) {
                    option.style.display = 'block';
                }
            });
        }
    })
});

let x = 0;
let giornoSelezionato;
let orarioSelezionato;
document.querySelector('.stepUnoInCorso button').addEventListener("click", function () {
    if (!document.querySelector('.stepUnoInCorso button').hasAttribute('disabled')) {
        document.querySelector('.stepUnoInCorso').classList.add('nascosto');
        document.querySelector('.stepUnoCompletato').classList.remove('nascosto');
        document.querySelector('.stepDue').classList.add('nascosto');
        document.querySelector('.stepDueInCorso').classList.remove('nascosto');
        document.querySelector('.stepDueCompletato').classList.add('nascosto');
        giorni.forEach(function (item) {
            if (item.classList.contains('selected')) {
                giornoSelezionato = item.value;
            }
        });
        fasciaOraria.forEach(function (item) {
            item.value = collectionIntervals[x];
            x++;
            if (item.classList.contains('selected')) {
                orarioSelezionato = item.value;
            }
        })
        document.querySelector('.opzioniSelezionate').innerHTML = 'Ritiro ' + giornoSelezionato + ' ' + orarioSelezionato;
    }
});

document.querySelector('.stepUnoCompletato svg').addEventListener("click", function () {
    document.querySelector('.stepUnoCompletato').classList.add('nascosto');
    document.querySelector('.stepUnoInCorso').classList.remove('nascosto');
    x = 0;
    giornoSelezionato = 0;
    orarioSelezionato = 0;
    valoreFasciaOraria();
});

let contaTermiche = 0;
let contaBio = 0;
let contaRiuso = 0;
window.addEventListener("load", function () {
    document.querySelector('.nBuste.termiche').innerHTML = contaTermiche;
    document.querySelector('.nBuste.bio').innerHTML = contaBio;
    document.querySelector('.nBuste.riuso').innerHTML = contaRiuso;
});
document.querySelector('.meno.termiche').addEventListener("click", function () {
    if (contaTermiche > 0) {
        contaTermiche--;
        document.querySelector('.nBuste.termiche').innerHTML = contaTermiche;
    }
});
document.querySelector('.piu.termiche').addEventListener("click", function () {
    contaTermiche++;
    document.querySelector('.nBuste.termiche').innerHTML = contaTermiche;
});
document.querySelector('.meno.bio').addEventListener("click", function () {
    if (contaBio > 0) {
        contaBio--;
        document.querySelector('.nBuste.bio').innerHTML = contaBio;
    }
});
document.querySelector('.piu.bio').addEventListener("click", function () {
    contaBio++;
    document.querySelector('.nBuste.bio').innerHTML = contaBio;
});
document.querySelector('.meno.riuso').addEventListener("click", function () {
    if (contaRiuso > 0) {
        contaRiuso--;
        document.querySelector('.nBuste.riuso').innerHTML = contaRiuso;
    }
});
document.querySelector('.piu.riuso').addEventListener("click", function () {
    contaRiuso++;
    document.querySelector('.nBuste.riuso').innerHTML = contaRiuso;
});

document.querySelectorAll('.piu').forEach(function (item) {
    item.addEventListener("click", function () {
        if (document.querySelector('#sacchetto').checked) {
            document.querySelector('#sacchetto').checked = false;
        }
    })
});

document.querySelectorAll('.meno').forEach(function (item) {
    item.addEventListener("click", function () {
        if (document.querySelector('#sacchetto').checked === false) {
            if (contaTermiche === 0) {
                if (contaBio === 0) {
                    if (contaRiuso === 0) {
                        document.querySelector('#sacchetto').checked = true;
                    }
                }
            }
        }
    })
});

document.querySelector('#sacchetto').addEventListener("click", function () {
    if (document.querySelector('#sacchetto').checked) {
        contaTermiche = 0;
        contaBio = 0;
        contaRiuso = 0;
        document.querySelector('.nBuste.termiche').innerHTML = contaTermiche;
        document.querySelector('.nBuste.bio').innerHTML = contaBio;
        document.querySelector('.nBuste.riuso').innerHTML = contaRiuso;
        document.querySelector('.bustePerSpesa div:nth-child(2) div strong').innerHTML = (contaTermiche * 1.10).toFixed(2) + '&euro;';
        document.querySelector('.bustePerSpesa div:nth-child(3) div strong').innerHTML = (contaBio * 0.10).toFixed(2) + '&euro;';
        document.querySelector('.bustePerSpesa div:last-child div strong').innerHTML = (contaRiuso * 0.99).toFixed(2) + '&euro;';
    } else {
        document.querySelector('#sacchetto').checked = true;
    }
});

document.querySelectorAll('.contatore').forEach(function (item) {
    item.addEventListener("click", function () {
            document.querySelector('.bustePerSpesa div:nth-child(2) div strong').innerHTML = (contaTermiche * 1.10).toFixed(2) + '&euro;';
            document.querySelector('.bustePerSpesa div:nth-child(3) div strong').innerHTML = (contaBio * 0.10).toFixed(2) + '&euro;';
            document.querySelector('.bustePerSpesa div:last-child div strong').innerHTML = (contaRiuso * 0.99).toFixed(2) + '&euro;';
    })
});

let busteTermiche = ' ';
let busteBio = ' ';
let busteRiuso = ' ';
document.querySelector('.stepDueInCorso button').addEventListener("click", function () {
    document.querySelector('.stepDueInCorso').classList.add('nascosto');
    document.querySelector('.stepDueCompletato').classList.remove('nascosto');
    document.querySelector('.stepTre').classList.add('nascosto');
    document.querySelector('.stepTreInCorso').classList.remove('nascosto');
    if (document.querySelector('#sacchetto').checked) {
        document.querySelector('.stepDueCompletato .opzioniSelezionate').innerHTML = 'Nessun sacchetto. I sacchetti utilizzati per la preparazione delle spese sono a pagamento (Euro 0,10 cad.)' +
            ' e vengono addebitati in modo commisurato in funzione della necessità di ogni singola spesa. Qualora scegliessi di non ricevere sacchetti da parte di Bennet la tua spesa ti verr\à ' +
            'consegnata utilizzando solo i dispositivi idonei all\'imbustamento dei prodotti freschissimi e surgelati e non verr\à richiesta alcuna spesa aggiuntiva.';
    } else {
        if (contaTermiche !== 0) {
            busteTermiche = 'BORSA TERMICA BENNET (' + contaTermiche + ') <br>';
        } else { busteTermiche = ' '; }
        if (contaBio !== 0) {
            busteBio = 'SHOPPER BIODEGRADABILE (' + contaBio + ') <br>';
        } else { busteBio = ' '; }
        if (contaRiuso !== 0) {
            busteRiuso = 'BORSA PORTA TUTTO (' + contaRiuso + ') <br>';
        } else { busteRiuso = ' '; }
        document.querySelector('.stepDueCompletato .opzioniSelezionate').innerHTML = busteTermiche + busteBio + busteRiuso;
    }
    document.querySelector('.scontrino p:first-child').innerHTML = 'Articoli (' + (1 + contaTermiche + contaBio + contaRiuso).toFixed(0) + ')';
    document.querySelector('.scontrinoDesign p:first-child').innerHTML = (3.03 + contaTermiche * 1.10 + contaBio * 0.10 + contaRiuso * 0.99) + '&euro;';
    document.querySelector('.cassa strong:last-child').innerHTML = (3.03 + contaTermiche * 1.10 + contaBio * 0.10 + contaRiuso * 0.99).toFixed(2) + '&euro;';
});

document.querySelector('.stepDueCompletato svg').addEventListener("click", function () {
    document.querySelector('.stepDueCompletato').classList.add('nascosto');
    document.querySelector('.stepDueInCorso ').classList.remove('nascosto');
});

document.querySelector('.stepTreInCorso input').addEventListener("click", function () {
    if (document.querySelector('.stepTreInCorso input').checked) {
        document.querySelector('.cassa button').disabled = false;
    } else {
        document.querySelector('.cassa button').disabled = true;
    }
});