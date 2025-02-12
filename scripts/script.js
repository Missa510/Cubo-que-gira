import * as THREE from 'three';
import { DOM, $, delay, CheckWebGLCompatibilidad } from './DOM.js';

// Creamos la escena
const escena = new THREE.Scene()
// Creamos la camara
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
// Creamos el renderizador
const render = new THREE.WebGLRenderer()

// Para evitar que se vea mal cuando cambias la resolución de la ventana
window.onresize = () => delay(300).finally(() => render.setSize(window.screen.availWidth, window.screen.availHeight))

function Iniciar() {
    // DOM
    const $button = $(".btn_full")

    $button.addEventListener("click", togglePantallaCompleta);

    function togglePantallaCompleta() {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen()
            $button.innerText = 'Salir de la pantalla completa'
            render.setSize(window.screen.width, window.screen.height)

        } else {

            document.exitFullscreen()
            $button.innerText = 'Pantalla completa'
            render.setSize(window.screen.availWidth, window.screen.availHeight)
        }

    }

    // Fin del Los elementos del DOM

    // Constantes de inicio
    const puntos = []
    const escala = 1.5, escala_cubo = 1.02, radio_esfera = 4, segmentos_esfera = 20, altura_segmentos = 15
    const velocidad = 0.0077

    // Ajustamos el tamaño de la ventana
    render.setSize(window.innerWidth, window.innerHeight)
    // Seteamos la funcion de animar
    render.setAnimationLoop(animar)
    // Crea el elemento canvas para el render
    document.body.appendChild(render.domElement)

    // Creamos un cubo. 1: definimos la geometría
    const geometria = new THREE.BoxGeometry(escala_cubo, escala_cubo, escala_cubo)

    // Geometria de la esfera
    const geometria_esfera = new THREE.SphereGeometry(radio_esfera, segmentos_esfera, altura_segmentos)

    // Rombo en el plano x, y
    puntos.push(new THREE.Vector3(-escala, 0, 0))
    puntos.push(new THREE.Vector3(0, escala, 0))
    puntos.push(new THREE.Vector3(escala, 0, 0))
    puntos.push(new THREE.Vector3(0, -escala, 0))
    puntos.push(new THREE.Vector3(-escala, 0, 0))

    // Rombo en el plano z, y
    puntos.push(new THREE.Vector3(0, 0, escala))
    puntos.push(new THREE.Vector3(0, -escala, 0))
    puntos.push(new THREE.Vector3(0, 0, escala))
    puntos.push(new THREE.Vector3(0, escala, 0))
    puntos.push(new THREE.Vector3(0, 0, -escala))
    puntos.push(new THREE.Vector3(0, -escala, 0))

    // Intersectar puntos faltantes
    puntos.push(new THREE.Vector3(0, 0, -escala))
    puntos.push(new THREE.Vector3(-escala, 0, 0))
    puntos.push(new THREE.Vector3(0, 0, -escala))
    puntos.push(new THREE.Vector3(escala, 0, 0))
    puntos.push(new THREE.Vector3(0, 0, escala))


    // Definimos la geometria del rombo
    const geometria_linea = new THREE.BufferGeometry().setFromPoints(puntos)

    // 2: Definimos el material
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,

    })
    const material_linea = new THREE.LineDashedMaterial({
        color: 0xffffff
    })

    // Creamos las luces que iluminan al cubo
    const luz_pricipal = new THREE.AmbientLight(0xefefef, 0.1)
    const luz1 = new THREE.DirectionalLight(0xff2f2f, 1)
    const luz2 = new THREE.DirectionalLight(0x4f4ff5, 1)
    const luz3 = new THREE.DirectionalLight(0x23ff66, 1)

    // 3: Creamos el objeto Mesh (cubo)
    const cubo = new THREE.Mesh(geometria, material)
    const rombo = new THREE.Line(geometria_linea, material_linea)
    const esfera = new THREE.Mesh(geometria_esfera, material)

    // Seteamos la camara
    camara.position.z = 3

    // Posicionamos las luces en la escena
    luz1.position.set(4, 4, 0)
    luz2.position.set(0, 4, 0)
    luz3.position.set(4, 0, 4)

    esfera.position.x = 2

    // Añadimos los elementos a la escena
    escena.add(luz_pricipal)
    escena.add(luz1)
    escena.add(luz2)
    escena.add(luz3)
    escena.add(cubo)
    escena.add(rombo)
    // escena.add(esfera)

    // Funcion de animar el cubo en pantalla
    function animar() {

        cubo.rotation.x += velocidad
        cubo.rotation.y -= velocidad
        cubo.rotation.z += velocidad

        rombo.rotation.y -= velocidad
        rombo.rotation.x += velocidad
        rombo.rotation.z -= velocidad

        render.render(escena, camara)
    }
}


if (CheckWebGLCompatibilidad()) {
    DOM()
    Iniciar()
} else {
    alert("Tu navegador no soporta WebGL")
}