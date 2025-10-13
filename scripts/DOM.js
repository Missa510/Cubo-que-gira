/* 
ME TOMÓ MUCHO TIEMPO DARME CUENTA QUE 
LAS SOLUCION DEL BOTON ERA COLOCAR PRIMERO
EL MAP!!! MADURO COÑOETUMADRE
*/
import { CONSTANTES_DE_AUDIO } from './constantes_de_audio.js'

// Exportar las constantes de las funciones importantes XDDXDXDXDX
export const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Checkear la compatibilidad con WEBGL 2.0
export const CheckWebGLCompatibilidad = () => {
    try {
        const canvas = document.createElement('canvas')
        if (
            Boolean(window.WebGL2RenderingContext) &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext("webgl2"))
        ) {
            canvas.remove()
            return true
        }
    } catch (error) {
        return false
    }
}

// Verificar si usa otros navegadores
const isFireFoxUsed = () => {
    const navegadorWeird = navigator.userAgent.toLowerCase()
    const isFirefox = navegadorWeird.includes("firefox") && navegadorWeird.includes("gecko")

    const isItReallyTrueFirefoxIsUsed = Boolean(
        !navegadorWeird.includes("applewebkit") ||
        isFirefox
    )

    return isItReallyTrueFirefoxIsUsed
}

// Exportar el DOM para alivianar el script principal
export function DOM() {
    // DOM por fuera
    const $container = $(".container")
    const $warning = $('#warning')
    const $songs = $(".songs")
    const $tooltips = $(".tooltips")
    const $button = $(".btn_full")
    let AudioContext = []

    if (isFireFoxUsed()) {
        $warning.innerHTML += `
            <span class="warning">
                <strong>Advertencia!</strong>
                Puede que tu navegador no sea compatible con todas las caracteríisticas del sitio. Siéntete libre de cambiar de navegador si deseas
            </span>
        `
        $warning.removeAttribute("hidden")
    }

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

    $songs.innerHTML = `<h3>
        canciones:
    </h3>`

    const $musiquita_mejor = CONSTANTES_DE_AUDIO.map((audio, i) => {

    const hasSpotify = Boolean(audio.links?.Spotify)
    const hasYoutubeMusic = Boolean(audio.links?.YoutubeMusic)

        const $tooltip = `<article class="tooltip disabled">

            <img src="images/covers/${audio.id}.webp" alt=${audio.id}>
            <span>Estas oyendo: </span>
            <h3>${audio.nombre}</h3>
            <h5>${audio.autor.toUpperCase()}</h5>
            <section>
                ${hasSpotify ? `<a class="spotify" href="${audio.links.Spotify}" target="_blank" rel="noopener noreferrer nofollow">Escuchar en Spotify</a>` : ``}

                ${hasYoutubeMusic ? `<a class="youtube_music" href="${audio.links.YoutubeMusic}" target="_blank" rel="noopener noreferrer nofollow">Escuchar en Youtube Music</a>` : ``}
            </section>
        </article>`

        const $informacion = `<code>${i + 1}) ${audio.nombre} ~ ${audio.autor}</code>`
        const cancionPath = `audio/${audio.id}.mp3`
        const $musiquita = new Audio(cancionPath)

        // Usando la propiedad Audio() en lugar de crear el elemento con createElement
        $musiquita.setAttribute("aria-hidden", "true")
        $musiquita.setAttribute("hidden", "")
        $musiquita.id = audio.id
        $musiquita.controls = true
        $musiquita.type = "audio/mp3"
        $musiquita.volume = 0.8
        AudioContext.push($musiquita)

        $tooltips.innerHTML += $tooltip
        $songs.innerHTML += $informacion
        return $musiquita.outerHTML
    })

    $container.innerHTML += $musiquita_mejor.join('')

    const $canciones = $$('audio')
    const $btn_close = $(".btn_close")

    $btn_close.addEventListener("click", CerrarYMusica)

    function CerrarYMusica() {

        $container.classList.add('disabled')
        $canciones[0].play()
        $btn_close.removeEventListener("click", CerrarYMusica)
    }

    $canciones.forEach(($cancion, key) => {

        $cancion.addEventListener('play', async () => {

            const $tooltip = $$('.tooltip')
            $tooltip.item(key).classList.add('enabled')
            $tooltip.item(key).classList.remove('disabled')
            await delay(5000)
            $tooltip.item(key).classList.add('disabled')
            $tooltip.item(key).classList.remove('enabled')

        })

        $cancion.addEventListener('ended', () => {

            if ($canciones.item(key + 1)) { $canciones[key + 1].play() }

            else { $canciones.item(0).play() }
        })
    })
}