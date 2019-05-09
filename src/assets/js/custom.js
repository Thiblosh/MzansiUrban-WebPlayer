$(document).ready(function () {
	"use strict";

	var header = $('.header');
	var cdd = $('.custom_dropdown');
	var cddActive = false;

	initMenu();
	initHomeSlider();
	initDropdown();
	initScrolling();
	initSinglePlayer();
	initParallax();

	setHeader();

	$(window).on('resize', function () {
		setHeader();

		setTimeout(function () {
			$(window).trigger('resize.px.parallax');
		}, 375);
	});
	$(document).on('scroll', function () {
		setHeader();
	});

	function setHeader() {
		if ($(window).scrollTop() > 91) {
			header.addClass('scrolled');
		} else {
			header.removeClass('scrolled');
		}
	}

	function initMenu() {
		if ($('.menu').length && $('.hamburger').length) {
			var menu = $('.menu');
			var hamburger = $('.hamburger');
			var close = $('.menu_close');

			hamburger.on('click', function () {
				menu.toggleClass('active');
			});

			close.on('click', function () {
				menu.toggleClass('active');
			});
		}
	}

	function initHomeSlider() {
		if ($('.home_slider').length) {
			var homeSlider = $('.home_slider');
			homeSlider.owlCarousel({
				items: 1,
				loop: true,
				autoplay: false,
				nav: false,
				dots: false,
				smartSpeed: 1200,
				mouseDrag: false
			});

			if ($('.home_slider_nav').length) {
				var next = $('.home_slider_nav');
				next.on('click', function () {
					homeSlider.trigger('next.owl.carousel');
				});
			}
		}
	}

	function initDropdown() {
		if ($('.custom_dropdown').length) {
			var dd = $('.custom_dropdown');
			var ddItems = $('.custom_dropdown ul li');
			var ddSelected = $('.custom_dropdown_selected');

			dd.on('click', function () {
				if (cddActive) {
					closeCdd();
				} else {
					openCdd();
					$(document).one('click', function cls(e) {
						if ($(e.target).hasClass('cdd')) {
							$(document).one('click', cls);
						} else {
							closeCdd();
						}
					});
				}
			});

			ddItems.on('click', function () {
				var sel = $(this).text();
				ddSelected.text(sel);
			});
		}
	}

	function closeCdd() {
		cdd.removeClass('active');
		cddActive = false;
	}

	function openCdd() {
		cdd.addClass('active');
		cddActive = true;
	}

	function initScrolling() {
		if ($('.scroll_down_link').length) {
			var links = $('.scroll_down_link');
			links.each(function () {
				var ele = $(this);
				var target = ele.data('scroll-to');
				ele.on('click', function (e) {
					e.preventDefault();
					$(window).scrollTo(target, 1500, {
						offset: -75,
						easing: 'easeInOutQuart'
					});
				});
			});
		}
	}

	function initSinglePlayer() {
		if ($(".jp-jplayer").length) {
			$("#jquery_jplayer_1").jPlayer({
				ready: function () {
					$(this).jPlayer("setMedia", {
						title: "Mzansi Urban Radio",
						artist: "Mzansi Urban Radio",
						mp3: "http://stream.urbanza.co.za/mzansiurban_high"
					});
				},
				play: function () { // To avoid multiple jPlayers playing together.
					$(this).jPlayer("pauseOthers");
				},
				swfPath: "plugins/jPlayer",
				supplied: "mp3",
				cssSelectorAncestor: "#jp_container_1",
				wmode: "window",
				globalVolume: false,
				useStateClassSkin: true,
				autoBlur: false,
				smoothPlayBar: true,
				keyEnabled: true,
				solution: 'html',
				preload: 'metadata',
				volume: 0.55,
				muted: false,
				backgroundColor: '#000000',
				errorAlerts: false,
				warningAlerts: false
			});
		}
	}

	function initParallax() {
		if ($('.parallax_background').length) {
			$('.parallax_background').parallax({
				speed: 0.8
			});
		}
	}


});