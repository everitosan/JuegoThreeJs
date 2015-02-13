var $ = require('jquery');
var THREE = require('threejs');
var orbit = require('./orbitControls');

$(function(){
	orbit(THREE);
	//variables para three
	var renderer,
		scene,
		camera,
		controls,
		Barra,
		Pelota;
	//variables para game
	var bloques = [1, 1, 1, 1, 1, 1, 1, 1],
		vidas 	= 5,
		p1      = '';

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
		var materialPelota = new THREE.MeshBasicMaterial({color:0xAF17E6,wireframe: true});
		Pelota = new THREE.Mesh(geomPelota, materialPelota);
		Pelota.position.y -=50;
		scene.add(Pelota);

	};

	var iniciaBloques = function () {
		var espaciado,
			posBloque;

		espaciado = 300 / bloques.length ;

		for (i = 0;i<bloques.length; i++) {
			if(bloques[i] === 1) {
				var geomBloque = new THREE.BoxGeometry(espaciado, 10, 10);
				var materialBloque = new THREE.MeshNormalMaterial({wireframe: true});
				Bloque = new THREE.Mesh(geomBloque, materialBloque);

				posBloque = (i * espaciado) - 150;
				
				Bloque.position.x = posBloque;
				Bloque.position.y = 100;
				Bloque.name = "Bloque"+i;

				scene.add(Bloque);
			}
		}
		console.log(scene.children);
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
		//Barra.position.z = (event.pageY) - (window.innerHeight / 2);
	}

	var moverPelota = function () {
		var maxX = 150,
			minY = -50,
			maxY = 150,
			maxZ = 150;

		Pelota.rotation.z -= 0.01;

		if (Pelota.position.x == maxX) {
			Pelota.masx = false;
		}
		else if (Pelota.position.x == (maxX*-1) ) {
			Pelota.masx = true;
		}
		if (Pelota.position.y == maxY) {
			Pelota.masy = false;
		}
		else if (Pelota.position.y == minY) {

			if (Pelota.position.x <= (Barra.position.x + 35 ) && Pelota.position.x >= (Barra.position.x - 35)) 
			{
				Pelota.masy = true;
				scene.remove(scene.children[3]);
			}
			else if (vidas !==0){
				vidas --;

			}
		}
		/*		
		if (Pelota.position.z == maxZ) {
			Pelota.masz = false;
		}
		else if (Pelota.position.z == (maxZ*-1) ){
			Pelota.masz = true;
		}
		*/
		if(Pelota.masx) {
			Pelota.position.x +=2;
		}
		else {
			Pelota.position.x -=2;
		}
		if (Pelota.masy) {
			Pelota.position.y += 2;
		}
		else {
			Pelota.position.y -= 2;
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
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		moverPelota();
	};

	setUp();
});