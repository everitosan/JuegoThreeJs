var $ = require('jquery');
var THREE = require('threejs');
var orbit = require('./orbitControls');

$(function(){
	

	// **********************************************Código del Juego
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
		bloques : [1, 1, 1, 1, 1, 1, 1, 1],
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
		adiosBarra : new Audio('media/Balloon Pop.mp3')
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
		renderer = new THREE.WebGLRenderer();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);

		camera.position.z = 400;
		scene.add(camera);

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor( 0xffffff, 1);
		$('body').append(renderer.domElement);

		controls = new THREE.OrbitControls(camera, renderer.domElement);
		iniciaPelota();
		iniciaBarra();
		iniciaBloques();
		render();
	};

	var iniciaPelota = function() {
		var geomPelota = new THREE.SphereGeometry(10,10,10);
		var materialTextura = new THREE.ImageUtils.loadTexture('../img/tri.jpg');
		
		materialTextura.minFilter = THREE.NearestFilter;
		materialTextura.magFilter = THREE.NearestFilter;

		var materialPelota = new THREE.MeshBasicMaterial({color:0xAF17E6,wireframe: false, map:materialTextura, side:THREE.DoubleSide, combine: true});
		Pelota = new THREE.Mesh(geomPelota, materialPelota);
		Pelota.position.y -=50;
		Pelota.velocidad = 1;
		scene.add(Pelota);

	};

	var iniciaBloques = function () {
		

		espaciado = 300 / Game.bloques.length ;

		for (i = 0;i< Game.bloques.length; i++) {
			if( Game.bloques[i] === 1) {
				var geomBloque = new THREE.BoxGeometry(espaciado, 10, 10);
				var materialBloque = new THREE.MeshNormalMaterial({wireframe: false});
				Bloque = new THREE.Mesh(geomBloque, materialBloque);

				posBloque = (i * espaciado) - 150;
				
				Bloque.position.x = posBloque;
				Bloque.position.y = 100;
				Bloque.name = "Bloque"+i;

				scene.add(Bloque);
			}
		}
		//console.log(scene.children[9].position.x);
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
		}
		eliminaBloques();

	};

	var eliminaBloques = function (){
		var i = scene.children.length;
		if (i===3) {
			//#epicWin 
			alert('Epic Win!!');
			render = '';
		}
		else {
			for (i;i>3;i--) {
				if ( (Pelota.position.x + 11) >= (scene.children[i-1].position.x - espaciado/2) && (Pelota.position.x + 11) <= (scene.children[i-1].position.x + espaciado/2) ) {
					if( (Pelota.position.y + 11)  > (scene.children[i-1].position.y - 6) && (Pelota.position.y - 11)  < (scene.children[i-1].position.y + 6)  ) {
						Pelota.masy = !Pelota.masy;	
						Pelota.velocidad+=0.9;
						scene.remove(scene.children[i-1]);	
						audios.adiosBarra.play();
					}
				}
			}
		}
		
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
			}
			//else if (vidas !==0){
				//vidas --;
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

		//console.log(Pelota.position.x +'-'+ maxX);
	};

	var render = function () {
		controls.update();
		renderer.render(scene, camera);
		moverPelota();
		requestAnimationFrame(render);
	};

	function StartTheGame () {
		setTimeout(function(){DomElements.circuloDom.top('-190%')}, 100);
		setTimeout(function(){DomElements.arka.top('-170%')},  300);
		setTimeout(function(){DomElements.barraDom.top('-150%')}, 500);
		setTimeout(function(){DomElements.botonStart.top('-190%')}, 600);
		
		setTimeout(setUp, 3600);
	};


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
		},600);

		setTimeout(function(){
			DomElements.circuloDom.center('right', 'top');
		},400);

		setTimeout(function(){
			DomElements.botonStart.center('right', 'top');
			DomElements.botonStart.elem.css('display','block');
		},2500);

		DomElements.botonStart.elem.on('click', StartTheGame);
	}


	animacionInicial();

});