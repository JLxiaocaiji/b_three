import { Scene, Color } from "three"
import { gui } from "../system/gui.js"

export const createScene = () => {
    const scene = new Scene();

    // 16进制
    // 需要预先 new Color()
    scene.background = new Color();
    scene.background.setRGB(0.01, 0.005, 0.05)
    // 背景的模糊程度,一个浮点数，值越高，背景越模糊
    scene.backgroundBlurriness = 0.5

    gui.addColor(scene, "background")
    return scene
}                                   