document.querySelector(".alert-link").addEventListener("click", cookieHidden);

function cookieHidden() {
	document.querySelector(".alert").style.display = 'none';
}


document.querySelectorAll('.btn-outline-success').forEach(function(item) {
	item.addEventListener("click", function(){
		if (!item.classList.contains('green')) {
			item.classList.add('green');
		} else {
			item.classList.remove('green');
		}
	});
})

/* --------------   metodo alternativo...  ---------------------------------------------------------

document.querySelectorAll('.btn-outline-success').forEach(function(item) {
	item.addEventListener("click", function () {
		item.classList.toggle('green');
	})
});
   -------------------------------------------------------------------------------------------------
*/