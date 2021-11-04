var $ =window.jQuery= require('jquery');
const  slick  =  require ('slick-carousel');
const  Mustache  =  require ( 'mustache' ); 


$(".alert-link").on( "click",() => { $(".alert").hide();});


$('.heroBanner').slick({
	dots: true,
	infinite: true,
	speed: 300,
	slidesToShow: 1,
	arrows: true,
	fade: true,
	cssEase: 'linear',
	autoplay: true,
	autoplaySpeed: 1000,
});


//  CHIAMATA  AJAX  al file .json al caricamento della pagina html

var jqxhr = $.ajax({
		method: "GET",
		url: "src/json/articoli.json",
		dataType: "json"
	})
	.done(function(data) {
		var template = $('#template').html();
		var rendered = Mustache.render(template, data);
		$('#divTarget').html( rendered );
		$('.btn-outline-success').on( "click",function() { $(this).toggleClass('green');});
	})
  .fail(function() {
    	alert( "error" );
	});



/*        SENZA  IL  JQUERY

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

 --------------   metodo alternativo...  ---------------------------------------------------------

document.querySelectorAll('.btn-outline-success').forEach(function(item) {
	item.addEventListener("click", function () {
		item.classList.toggle('green');
	})
});
 -------------------------------------------------------------------------------------------------


window.addEventListener("load", function(){
  $('.heroBanner').slick({
	dots: true,
	infinite: true,
	speed: 300,
	slidesToShow: 1,
	arrows: true,
	fade: true,                     // dissolvenza
	cssEase: 'linear',              // dissolvenza
	autoplay: true,
	autoplaySpeed: 1000,
  }); 
});


function ajaxCall() {
	var template = document.getElementById('template').innerHTML;
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		var rendered = Mustache.render(template, this.responseText);
		document.getElementById('divTarget').innerHTML = rendered;
	}
	xhttp.open("GET", "src/json/articoli.json");
	xhttp.send();
}
ajaxCall();
*/