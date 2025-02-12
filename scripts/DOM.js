/* 
ME TOMÓ MUCHO TIEMPO DARME CUENTA QUE 
LAS SOLUCION DEL BOTON ERA COLOCAR PRIMERO
EL MAP!!! MADURO COÑOETUMADRE
*/
import { CONSTANTES_DE_AUDIO } from './constantes_de_audio.js';

// Exportar las constantes de las funciones importantes XDDXDXDXDX
export const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// Checkear la compatibilidad con WEBGL 2.0
export const CheckWebGLCompatibilidad = () => {
    try {
        const canvas = document.createElement('canvas')
        if(!!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext("webgl2"))){
            canvas.remove()
            return true
        }
    } catch (error) {
        return false
    }
}

// Verificar si usa otros navegadores
const FireFoxAndOthers = () => {
    const navegadorWeird = navigator.userAgent.toLowerCase()
    return Boolean(
        !navegadorWeird.includes("applewebkit") ||
        navegadorWeird.includes("firefox")
    )
}

// Exportar el DOM para alivianar el script principal
export function DOM() {
    // DOM por fuera
    const $container = $(".container")
    const $warning = $('#warning')
    const $songs = $(".songs")
    const $tooltips = $(".tooltips")

    $songs.innerHTML = `<h3>
        nombre de las canciones:
    </h3>`

    const $musiquita_mejor = CONSTANTES_DE_AUDIO.map((audio, i) => {

        const $tooltip = `<article class="tooltip disabled">

            <img src="images/covers/${audio.id}.webp" alt=${audio.id}>
            <span>Estas oyendo: </span>
            <h3>${audio.nombre}</h3>
            <h5>${audio.autor}</h5>
            <section>
                <a class="spotify" href="${audio.links.Spotify}" target="_blank" rel="noopener noreferrer nofollow">Escuchar en Spotify</a>
                <a class="youtube_music" href="${audio.links.YoutubeMusic}" target="_blank" rel="noopener noreferrer nofollow">Escuchar en Youtube Music</a>
            </section>
        </article>`

        const $informacion = `<code>${i + 1}) ${audio.nombre} ~ ${audio.autor}</code>`
        const $musiquita = `<audio aria-hidden=" true" hidden id="${audio.id}" controls type="audio.mp3" src="audio/${audio.id}.mp3"></audio>`;

        $tooltips.innerHTML += $tooltip
        $songs.innerHTML += $informacion
        return $musiquita
    })

    $container.innerHTML += $musiquita_mejor.join('')
    const $canciones = $$('audio')
    const $btn_close = $(".btn_close")

    if(FireFoxAndOthers()){
        $warning.removeAttribute("hidden")
        $warning.innerHTML += `
            <span class="warning">
                <strong>Advertencia!</strong>
                Puede que tu navegador no sea compatible con todas las caracteríisticas del sitio. Siéntete libre de cambiar de navegador si deseas
            </span>
        `
    }

    $btn_close.addEventListener("click", CerrarYMusica)

    function CerrarYMusica() {

        $container.classList.add('disabled')
        $canciones[0].volume = 0.8
        $canciones[0].play()
        $btn_close.removeEventListener("click", CerrarYMusica)
    }

    $canciones.forEach(($cancion, key) => {

        $cancion.addEventListener('play', () => {

            const $tooltip = $$('.tooltip')
            $tooltip.item(key).classList.add('enabled')
            $tooltip.item(key).classList.remove('disabled')
            delay(5000).finally(() => {
                $tooltip.item(key).classList.add('disabled')
                $tooltip.item(key).classList.remove('enabled')
            })

        })

        $cancion.addEventListener('ended', () => {

            if ($canciones.item(key + 1)) {

                $canciones.item(key + 1).volume = 0.8
                $canciones[key + 1].play()

            } else {

                $canciones.item(0).volume = 0.8
                $canciones.item(0).play()
            }
        })
    })
}