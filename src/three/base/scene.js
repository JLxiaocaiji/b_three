import { Scene, Color } from "three"
import { gui } from "../system/gui.js"

export const createScene = () => {
    const scene = new Scene();

    // 16进制
    // 需要预先 new Color()
    scene.background = new Color();
    scene.background.setRGB(0.01, 0.005, 0.05)
    scene.backgroundBlurriness = 0.5

    gui.addColor(scene, "background")
    return scene
}                                   