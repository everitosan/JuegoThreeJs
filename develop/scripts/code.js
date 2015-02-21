var $ = require('jquery');
var THREE = require('threejs');
var orbit = require('./orbitControls');

$(function(){
	

	// **********************************************  Código del Juego
	orbit(THREE);
	//variables para three
	var renderer,
		scene,
		camera,
		controls,
		Barra,
		Pelota;
	//variables para game
	var Game = {
		bloques : 10, 
		vidas 	: 5,
		p1      : '',
		lose 	: false
	};

	var DomElements = {
		arka : '',
		barraDom :'',
		circuloDom :'',
		botonStart :''
	};

	var audios = {
		inicio : new Audio('media/Loop1.mp3'),
		adiosBarra : new Audio('media/bicycle_pump.mp3'),
		cancion :  new Audio('media/LoveWar.mp3')
	};

	audios.inicio.loop=true;
	audios.inicio.play();

	var maxX = 150,
		minY = -50,
		maxY = 150,
		maxZ = 150;

	var espaciado,
		posBloque;


	var setUp = function() {
		$('#wrapper').remove();
		$('#Scores').css('top',0);

		for (var j=0; j<Game.vidas; j++) {
			$('#LeftVidas').append( $('<span class="icon-circle-full"></span>') );
		}


		renderer = new THREE.WebGLRenderer();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);

		camera.position.z = 400;
		scene.add(camera);

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor( 0xffffff, 1);
		renderer.domElement.id = "canvas";
		$('body').append(renderer.domElement);

		controls = new THREE.OrbitControls(camera, renderer.domElement);
		iniciaPelota();
		iniciaBarra();
		iniciaBloques();
		render();

		$('#canvas').animate({top:0},{duration:2000,easing:"swing"});
	};

	var iniciaPelota = function() {
		var geomPelota = new THREE.SphereGeometry(10,10,10);
		var materialTextura = new THREE.ImageUtils.loadTexture('../img/tri.jpg');
		materialTextura.wrapS=materialTextura.wrapT=THREE.RepeatWrapping;
		materialTextura.repeat.set(2,1);

		materialTextura.minFilter = THREE.NearestFilter;
		materialTextura.magFilter = THREE.NearestFilter;

		var materialPelota = new THREE.MeshBasicMaterial({color:0xAF17E6,wireframe: false, map:materialTextura, side:THREE.DoubleSide});
		Pelota = new THREE.Mesh(geomPelota, materialPelota);
		Pelota.position.y -=50;
		Pelota.velocidad = 1;
		scene.add(Pelota);

	};

	var iniciaBloques = function () {
		

		espaciado = 350 / Game.bloques ;

		for (i = 0;i< Game.bloques; i++) {
			
				var geomBloque = new THREE.BoxGeometry(espaciado, 10, 10);
				var materialBloque = new THREE.MeshNormalMaterial({wireframe: false});
				Bloque = new THREE.Mesh(geomBloque, materialBloque);

				posBloque = (i * espaciado) - (150+espaciado/2);
				
				Bloque.position.x = posBloque;
				Bloque.position.y = 100;
				Bloque.name = "Bloque"+i;

				scene.add(Bloque);
			
		}
	};

	var iniciaBarra = function () {
		var geomBarra =  new THREE.BoxGeometry(50,10,30);
		var materialBarra = new THREE.MeshNormalMaterial();
		Barra = new THREE.Mesh(geomBarra, materialBarra);
		Barra.position.y -= 65;

		scene.add(Barra);

		$('canvas').mousemove(mueveBarra);
	};

	function mueveBarra() {
		Barra.position.x = (event.pageX) - (window.innerWidth / 2);
		// Barra.position.z = (event.pageY) - (window.innerWidth / 2);
	}

	var moverPelota = function () {
		
		Pelota.rotation.z -= 0.01;
		if (!Game.lose) {
			rebote();
			eliminaBloques();
		}

	};

	var eliminaBloques = function (){
		var i = scene.children.length;
		var PelotaX,
			PelotaY;

		if (Pelota.masx) {
			PelotaX = Pelota.position.x + 10;
		}
		else {
			PelotaX = Pelota.position.x - 10;
		}

		if (Pelota.masy) {
			PelotaY = Pelota.position.y + 10;
		}
		else {
			PelotaY = Pelota.position.y - 10;
		}

		if (i===3) {
			alerta('Epic Win!!', 'Salir', 'Jugar!');
			Game.lose = true;
		}
		else {
			for (i;i>3;i--) {
				if ( PelotaX >= (scene.children[i-1].position.x - espaciado/2) && PelotaX <= (scene.children[i-1].position.x + espaciado/2) ) {
					//console.log( (Pelota.position.y + 11)  +'>='+(scene.children[i-1].position.y - 6)+'&&'+(Pelota.position.y - 11)+'<='+(scene.children[i-1].position.y + 6));
					if( PelotaY  >= (scene.children[i-1].position.y - 6) && PelotaY <= (scene.children[i-1].position.y + 6)  ) {
						Pelota.masy = !Pelota.masy;	
						Pelota.velocidad+=1;
						$('#speed').html(Pelota.velocidad + 'x');
						scene.remove(scene.children[i-1]);	
						audios.adiosBarra.play();
					}
				}
			}
		}
		
	};

	var reStart= function () {
		Game.lose = false;
		Pelota.position.x = 0;
		Pelota.position.y = -50;
		Barra.position.x = 0;
		Pelota.masx = !Pelota.masx;
		Pelota.masy = true;

	};

	var rebote = function(){
		if (Pelota.position.x >= maxX) {
			Pelota.masx = false;
		}
		else if (Pelota.position.x <= (maxX*-1) ) {
			Pelota.masx = true;
		}
		if (Pelota.position.y >= maxY) {
			Pelota.masy = false;
		}
		else if (Pelota.position.y <= minY) {

			if (Pelota.position.x <= (Barra.position.x + 35 ) && Pelota.position.x >= (Barra.position.x - 35)) 
			{
				//if (Pelota.position.z <= (Barra.position.z + 10 ) && Pelota.position.z >= (Barra.position.z - 10)) 
				//{
					Pelota.masy = true;
				/*	Pelota.masz = true;
				}
				else {
					Game.lose = true;
				}
				*/
			}
			else {
				Game.lose = true;
				if (Game.vidas !==0) {
					Game.vidas --;
					$($('#LeftVidas').children()[0]).remove();
					$('#LeftVidas').append($("<p class='icon-record livelost'></p>"));
					setTimeout(reStart,3000);
				}
				else {
					alerta('You Lose :( ', 'Salir', 'Jugar!');
				}
			}
		}
		
		if (Pelota.position.z >= maxZ) {
			Pelota.masz = false;
		}
		else if (Pelota.position.z <= (maxZ*-1) ){
			
		}
		
		if(Pelota.masx) {
			Pelota.position.x += Pelota.velocidad;
		}
		else {
			Pelota.position.x -= Pelota.velocidad;
		}
		if (Pelota.masy) {
			Pelota.position.y += Pelota.velocidad;
		}
		else {
			Pelota.position.y -= Pelota.velocidad;
		}
		/*
		if (Pelota.masz) {
			Pelota.position.z += 1;
		}
		else {
			Pelota.position.z -= 1;
		}
		*/
	};

	var render = function () {
		controls.update();
		renderer.render(scene, camera);
		moverPelota();
		requestAnimationFrame(render);
	};

	function StartTheGame () {

		$(audios.inicio).animate({volume: 0}, 3600);
		audios.cancion.play();
		audios.cancion.volume = 0;
		$(audios.cancion).animate({volume: 1}, 5500);


		setTimeout(function(){DomElements.circuloDom.top('-190%'); }, 100);
		setTimeout(function(){DomElements.arka.top('-170%'); },  300);
		setTimeout(function(){DomElements.barraDom.top('-150%'); }, 500);
		setTimeout(function(){DomElements.botonStart.top('-190%'); }, 600);
		
		setTimeout(setUp, 3600);
	}


	var elementoDom = function(elem) {
		this.elem = elem;
	};

	elementoDom.prototype.center = function (fromPositionW, fromPositionH) {
		var mitadW = window.innerWidth/2;
		var mitadH = window.innerHeight/2;

		this.elem.css(fromPositionW, mitadW - parseInt( this.elem.css('width'))/2  );
		this.elem.css(fromPositionH, mitadH - parseInt( this.elem.css('height'))/2  );
	};

	elementoDom.prototype.top = function (amount) {
		this.elem.css('transition-duration','3s');
		this.elem.css('transition-timing-function','ease-in');
		this.elem.css('top', amount);
	};


	function animacionInicial() {
		DomElements.arka = new elementoDom( $('#arkanoid') );
		DomElements.barraDom = new elementoDom( $('#barra') );
		DomElements.circuloDom = new elementoDom( $('#circulo') );
		DomElements.botonStart = new elementoDom( $('#Start') );
		

		DomElements.arka.center('left', 'top');

		setTimeout(function(){
			DomElements.barraDom.center('left', 'top');
		},400);

		setTimeout(function(){
			DomElements.circuloDom.center('right', 'top');
		},400);

		setTimeout(function(){
			DomElements.botonStart.center('right', 'top');
			DomElements.botonStart.elem.css('display','block');
		},2500);

		DomElements.botonStart.elem.on('click', StartTheGame);
		$('body').on('click','#Salir',Salir );
		$('body').on('click','#Jugar',Jugar );
		$(document).on('keydown',KeyPressed);
		$('#controles').on('click', toggleAudio);
	}

	function toggleAudio(event) {
		event.stopPropagation();

		console.log(audios.cancion.volume);
		if(audios.cancion.volume === 1) {
			audios.cancion.volume = 0;
			$('.icon-soundoff').removeClass('hide');
			$('.icon-sound-alt').addClass('hide');
		}
		else {
			audios.cancion.volume = 1;
			$('.icon-soundoff').addClass('hide');
			$('.icon-sound-alt').removeClass('hide');
		}


		
	}

	function Salir () {
		window.location.assign("https://github.com/everitosan/JuegoThreeJs");
	}

	function Jugar () {
		$('#alerta').remove();
		Game.vidas = 5;
		Pelota.velocidad = 1;
		iniciaBloques();
		$('#LeftVidas').html('');
		for (var j=0; j<Game.vidas; j++) {
			$('#LeftVidas').append( $('<span class="icon-circle-full"></span>') );
		}
		reStart();
	}


	function KeyPressed (event) {
		if(event.keyCode === 13) {
			StartTheGame();
		}
		else if (event.keyCode === 39 && Barra){ //derecha
			Barra.position.x += 25;
		}
		else if (event.keyCode === 37&& Barra){ //izquierda
			Barra.position.x -= 25;
		}
	}

	function alerta (msg, btn1, btn2) {
		var elementoAlerta = new elementoDom ( $('<div id="alerta" ><p>'+msg+'</p> <div class="btn" id="Salir" > '+btn1+' </div> <div class="btn" id="Jugar"> '+btn2+' </div> </div>') );
		$('body').append(elementoAlerta.elem);
		elementoAlerta.center('right','top');
	}


	animacionInicial();
});