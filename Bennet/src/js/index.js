const dataToday = new Date("2021-11-25T16:00:00Z");
const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

const divArray = document.querySelectorAll('.scegliUnGiorno div');
const fasciaOraria = document.querySelectorAll('.orariSelezionabili div');
const giornoCorrente = document.querySelector('.scegliUnGiorno div');

let j = 0;
divArray.forEach(function (item) {
    dataToday.setDate(dataToday.getDate() + j);
    let dayOfWeek = days[dataToday.getDay()];
    let day = dataToday.getDate();
    let month = months[dataToday.getMonth()];
    item.innerHTML = dayOfWeek + ' ' + day + ' ' + '<br>' + month;
    j = 1;
});

let ora = 8;
fasciaOraria.forEach(function (item) {
    item.value = ora;
    ora += 2;
    console.log(item.value);
});

fasciaOraria.forEach(function (item) {
    if ((giornoCorrente.classList.contains('selected')) && (dataToday.getHours() > item.value)) {
        item.classList.remove('disponibile');
        item.classList.add('nonDisponibile');
    }
    divArray.forEach(function (option) {
        option.addEventListener("click", function () {
            if ((item.value < 20) && (item.value > 8)) {
                item.classList.add('disponibile');
            }
        })
    });
});

divArray.forEach(function (item) {
    item.addEventListener("click", function () {
        for (let i = 0; i < divArray.length; i++) {
            if (divArray[i] !== item) {
                divArray[i].classList.remove('selected');
            }
        }
        item.classList.add('selected');
    })
});

fasciaOraria.forEach(function (item) {
    item.addEventListener("click", function () {
        for (let i = 0; i < fasciaOraria.length; i++) {
            if (fasciaOraria[i] !== item) {
                fasciaOraria[i].classList.remove('selected');
            }
        }
        item.classList.add('selected');
        document.querySelector('.stepUno button').removeAttribute('disabled');
    })
});

const amPm = document.querySelectorAll('.scegliUnaFasciaOraria > div');
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
                option.style.display = 'flex';
            })
        }
        if (amPm[1].classList.contains('selected')) {
            fasciaOraria.forEach(function (option) {
                if (option.value > 13) {
                    option.style.display = 'none';
                }
                if (option.value < 13) {
                    option.style.display = 'flex';
                }
            });
        }
        if (amPm[2].classList.contains('selected')) {
            fasciaOraria.forEach(function (option) {
                if (option.value < 13) {
                    option.style.display = 'none';
                }
                if (option.value > 13) {
                    option.style.display = 'flex';
                }
            });
        }
    })
});