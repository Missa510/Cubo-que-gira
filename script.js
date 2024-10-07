import * as THREE from 'three';


// Creamos la escena
const escena = new THREE.Scene()
// Creamos la camara
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
// Renderisamos la camara y la escena
const render = new THREE.WebGLRenderer()
// Para poner musiquita
const escuchador = new THREE.AudioListener()
escena.add(escuchador)
const sonido = new THREE.Audio(escuchador)

function Iniciar() {

    const puntos = []
    const escala = 1.5, escala_cubo = 1.02
    const velocidad = 0.008

    // DOM
    const $ = (el) => document.querySelector(el)
    const $container = $(".container")
    const $button_close = $(".btn_close")
    const $button = $(".btn_full")
    
    $button_close.addEventListener("click", () => {

        $container.style.display = "none"

    })

    $button.addEventListener("click", togglePantallaCompleta)

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

    // Ajustamos el tamaño de la ventana
    render.setSize(window.innerWidth, window.innerHeight)
    render.setAnimationLoop(animar)
    document.body.appendChild(render.domElement)

    // Creamos un cubo. 1: definimos la geometría
    const geometria = new THREE.BoxGeometry(escala_cubo, escala_cubo, escala_cubo)
    // 2: Definimos el material
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,

    })

    const material_linea = new THREE.LineDashedMaterial({
        color: 0xffffff
    })

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

    // Intersectar puntos
    puntos.push(new THREE.Vector3(0, 0, -escala))
    puntos.push(new THREE.Vector3(-escala, 0, 0))
    puntos.push(new THREE.Vector3(0, 0, -escala))
    puntos.push(new THREE.Vector3(escala, 0, 0))
    puntos.push(new THREE.Vector3(0, 0, escala))


    const geometria_linea = new THREE.BufferGeometry().setFromPoints(puntos)

    const luz_pricipal = new THREE.AmbientLight(0xefefef, 0.1)
    const luz1 = new THREE.DirectionalLight(0xff2f2f, 1)
    const luz2 = new THREE.DirectionalLight(0x4f4ff5, 1)
    const luz3 = new THREE.DirectionalLight(0x23ff44, 1)

    const cargador = new THREE.AudioLoader()

    // 3: Creamos el objeto Mesh (cubo)
    const cubo = new THREE.Mesh(geometria, material)
    const rombo = new THREE.Line(geometria_linea, material_linea)

    // Seteamos la camara
    camara.position.z = 3

    // Añadimos los objetos a la escena
    luz1.position.set(4, 4, 0)
    luz2.position.set(0, 4, 0)
    luz3.position.set(0, -4, 4)

    // Seteamos la musiquita
    cargador.load("audio/the-approaching-night.mp3", (buffer) => {
        sonido.setBuffer(buffer)
        sonido.setLoop(true)
        sonido.setVolume(0.8)
        sonido.play()
    })

    escena.add(luz_pricipal)
    escena.add(luz1)
    escena.add(luz2)
    escena.add(luz3)
    escena.add(cubo)
    escena.add(rombo)

    // Funcion de animar el cubo en pantalla
    function animar() {

        cubo.rotation.x += velocidad
        cubo.rotation.y -= velocidad
        cubo.rotation.z += velocidad

        rombo.rotation.y -= velocidad
        rombo.rotation.x += velocidad
        rombo.rotation.z -= velocidad

        // rombo.rotation.y = Math.asin(-1)

        render.render(escena, camara)
    }
}

Iniciar()