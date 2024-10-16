import { Scene, Color } from "three"
import { gui } from "../system/gui.js"

export const createScene = () => {
    const scene = new Scene();

    // 16进制
    // scene.background = new Color(0x000000);
    scene.background,setRGB(0.01, 0.005, 0.05)
    scene.backgroundBlurriness = 0.5

    gui.addColor(scene, "background")
    return scene
}                                   