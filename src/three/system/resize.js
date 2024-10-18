import { sizes } from "./sizes"

let camera,renderer,composer

export const resizeEventListener = (_camera, _renderer, _composer = null) => {
    camera = _camera
    renderer = _renderer
    composer = _composer
    window.addEventListener("resize", resizeEvent)
}

export const clear = (_camera, _renderer, _composer = null) => {
    window.removeEventListener("resize", resizeEvent)
}

const resizeEvent = () => {
    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    composer && composer.setSize(sizes.width, sizes.height)
}