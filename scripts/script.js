import * as THREE from 'three';
import { DOM, delay, CheckWebGLCompatibilidad } from './DOM.js';

// Creamos la escena
const escena = new THREE.Scene()
// Creamos la camara
const camara = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 1000)
// Creamos el renderizador
const render = new THREE.WebGLRenderer()
// Creamos un reloj interno para tomar el tiempo de las animaciones
const reloj = new THREE.Clock()

// Para evitar que se vea mal cuando cambias la resolución de la ventana
onresize = async (e) => {
    await delay(250)
    render.setSize(e.target.innerWidth, e.target.innerHeight)
    camara.aspect = e.target.innerWidth / e.target.innerHeight
    render.render(escena, camara)
}

function Hexadecimal() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    const hexR = r.toString(16).padStart(2, '0')
    const hexG = g.toString(16).padStart(2, '0')
    const hexB = b.toString(16).padStart(2, '0')

    return (hexR + hexG + hexB).toLowerCase();
}
const lucesAlAzar = () => {
    const color_hexadecimal = `0x${Hexadecimal()}`
    return parseInt(color_hexadecimal, 16)
}

function Iniciar() {
    // Constantes de inicio
    const puntos = []
    const escala = 1.95, escala_cubo = 1.32, radio_esfera = 1.306, segmentos_esfera = 40, altura_segmentos = 25
    const velocidad = 0.0097, velocidad_esfera = 0.045
    const cantidad_estrellas = 1500
    const posiciones_estrellas = new Float32Array(cantidad_estrellas * 3)
    const colores_estrellas = new Float32Array(cantidad_estrellas * 3)
    const datos_orbita = [] // [{radio, angulo, velocidad, centro: {x, y, z}}]

    // Ajustamos el tamaño de la ventana
    render.setSize(window.innerWidth, window.innerHeight)
    // Seteamos la funcion de animar
    render.setAnimationLoop(animar)
    // Crea el elemento canvas para el render
    document.body.appendChild(render.domElement)

    // Creamos un cubo. 1: definimos la geometría
    const geometria = new THREE.BoxGeometry(escala_cubo, escala_cubo, escala_cubo)
    const geometria_esfera = new THREE.SphereGeometry(radio_esfera, segmentos_esfera, altura_segmentos)
    const geomettria_estrella = new THREE.BufferGeometry()

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

    for (let i = 0; i < cantidad_estrellas; i++) {
        const angulo = Math.random() * Math.PI * 2
        const radio = Math.random() * 25 + 3 // Radio entre 3 y 25
        const velocidad_estrella = Math.random() * 0.9 + 0.2 // Velocidad entre 0.001 y 0.01

        const cx = (Math.random() - 0.5) * 2000 // Centro en x
        const cy = (Math.random() - 0.5) * 2000 // Centro en y
        const cz = (Math.random() - 0.5) * 2000 // Centro en z

        // Asignamos los datos de la órbita
        datos_orbita.push({
            radio: radio,
            angulo: angulo,
            velocidad: velocidad_estrella,
            centro: {
                x: cx,
                y: cy,
                z: cz
            }
        })

        // calculamos las posiciones iniciales de las estrellas
        const i3 = i * 3

        // Asignamos las posiciones de las estrellas
        posiciones_estrellas[i3] = cx + radio * Math.cos(angulo)
        posiciones_estrellas[i3 + 1] = cy + radio * Math.sin(angulo)
        posiciones_estrellas[i3 + 2] = cz + (Math.random() - 0.5) * 2000 // Altura aleatoria entre -2 y 2

        // Asignamos un color aleatorio a cada estrella
        colores_estrellas[i3] = Math.random() // R
        colores_estrellas[i3 + 1] = Math.random() // G
        colores_estrellas[i3 + 2] = Math.random() // B
    }
    geomettria_estrella.setAttribute('position', new THREE.BufferAttribute(posiciones_estrellas, 3))
    geomettria_estrella.setAttribute('color', new THREE.BufferAttribute(colores_estrellas, 3))

    const geometria_linea = new THREE.BufferGeometry().setFromPoints(puntos)

    // 2: Definimos los materiales
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        blendColor: 0x000000,
    })
    const material_linea = new THREE.LineDashedMaterial({
        color: 0xffffff,
        linewidth: 3,
    })
    const materail_esfera1 = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        emissive: 0x000000,
        wireframe: true
    })
    const materail_esfera2 = new THREE.MeshStandardMaterial({
        color: 0xefefef,
        emissive: 0x000000,
        wireframe: true
    })
    const material_estrella = new THREE.PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        alphaTest: 0.5,
        transparent: true,
        vertexColors: true // Activar colores por vértice
    })

    // Creamos las luces que iluminan al cubo
    const luz_pricipal = new THREE.AmbientLight(0xefefef, 0.1)
    const luz1 = new THREE.DirectionalLight(new THREE.Color(lucesAlAzar()))
    const luz2 = new THREE.DirectionalLight(new THREE.Color(lucesAlAzar()))
    const luz3 = new THREE.DirectionalLight(new THREE.Color(lucesAlAzar()))

    // 3: Creamos el objeto Mesh (cubo)
    const cubo = new THREE.Mesh(geometria, material)
    const rombo = new THREE.Line(geometria_linea, material_linea)
    const esfera1 = new THREE.Mesh(geometria_esfera, materail_esfera1)
    const esfera2 = new THREE.Mesh(geometria_esfera, materail_esfera2)
    const estrellas = new THREE.Points(geomettria_estrella, material_estrella)

    // Seteamos la camara
    camara.aspect = window.innerWidth / window.innerHeight
    camara.position.z = 4

    esfera1.position.x = 8
    esfera2.position.x = -8

    // Posicionamos las luces en la escena
    luz1.position.set(4, 4, 0)
    luz2.position.set(0, 4, 0)
    luz3.position.set(4, 0, 4)

    // Añadimos los elementos a la escena
    escena.add(luz_pricipal)
    escena.add(luz1)
    escena.add(luz2)
    escena.add(luz3)
    escena.add(cubo)
    escena.add(rombo)
    escena.add(esfera1)
    escena.add(esfera2)
    escena.add(estrellas)

    // Funcion de animar el cubo en pantalla
    function animar() {
        const tiempo = reloj.getElapsedTime() * velocidad_esfera
        const posiciones_estrellas_animadas = geomettria_estrella.attributes.position.array

        cubo.rotation.x += velocidad
        cubo.rotation.y -= velocidad
        cubo.rotation.z += velocidad

        rombo.rotation.y -= velocidad
        rombo.rotation.x += velocidad
        rombo.rotation.z -= velocidad

        esfera1.position.x = Math.cos(tiempo * 5)
        esfera1.position.z = Math.sin(tiempo * 5)
        esfera1.position.y = -Math.sin(tiempo * 5)

        esfera1.rotation.x -= velocidad * 0.5
        esfera1.rotation.y += velocidad * 0.5
        esfera1.rotation.z = Math.sin(tiempo)

        esfera2.position.x = -Math.cos(tiempo * 5)
        esfera2.position.z = -Math.sin(tiempo * 5)
        esfera2.position.y = Math.sin(tiempo * 5)

        esfera2.rotation.x += velocidad * 0.5
        esfera2.rotation.y -= velocidad * 0.5
        esfera2.rotation.z = -Math.sin(tiempo)

        for (let i = 0; i < cantidad_estrellas; i++) {
            const i3 = i * 3
            const datos = datos_orbita[i]
            // Movimiento circular suave usando tiempo global
            const angulo_actual = datos.angulo + datos.velocidad * reloj.getElapsedTime()
            posiciones_estrellas_animadas[i3] = datos.centro.x + datos.radio * Math.cos(angulo_actual)
            posiciones_estrellas_animadas[i3 + 1] = datos.centro.y + datos.radio * Math.sin(angulo_actual)
            posiciones_estrellas_animadas[i3 + 2] = datos.centro.z + datos.radio * -Math.sin(angulo_actual)

            datos.centro.x += datos.radio * Math.cos(angulo_actual) * 0.001 // Movimiento suave
            datos.centro.y += datos.radio * Math.sin(angulo_actual) * 0.004 // Movimiento suave
            datos.centro.z += datos.radio * -Math.sin(angulo_actual) * 0.009 // Movimiento suave
        }
        geomettria_estrella.attributes.position.needsUpdate = true

        render.render(escena, camara)
    }
}
if (CheckWebGLCompatibilidad()) {
    DOM()
    Iniciar()
} else {
    location.href = "/unsupported/Index.html"
}
