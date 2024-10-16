import { PerspectiveCamera } from "three";
import { sizes } from "../system/sizes";

export const createCamera = () => {
    const camera = new PerspectiveCamera(
        50, // filed of view
        sizes.width / sizes.height, // aspect
        1,  // near
        2000,   // far
    )
    camera.position.set(-2.95, 1.33, 3.91)
    return camera
}