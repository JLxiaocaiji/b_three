import { AmbientLight, SpotLight } from "three"
import Style from "../system/style"

export const createLight = (scene) => {
    // 聚光灯
    // 创建一个聚光灯光源，颜色为白色，强度为300.0，距离为0（默认值，通常不使用），角度衰减为0.3，聚光锥的半影衰减为1
    // 参数：color, intensity(光照强度), distance(光源照射的最大距离), angle, penumbra(聚光锥的半影衰减百分比), decay(沿着光照距离的衰减量)
    const pointLight = new SpotLight(0xffffff, 300.0, 0, 0.3, 1)
    pointLight.position.set(0, 15, 0)
    // 启用阴影投射，这样聚光灯可以产生阴影
    pointLight.castShadow = true
    // 关闭阴影的自动更新，通常在静态场景中为了性能考虑
    pointLight.shadow.autoUpdate = false
    // 设置阴影偏差，用于减少阴影失真，-0.0001是一个常见的值
    pointLight.shadow.bias = -0.0001
    scene.add(pointLight)

    // 环境光
    const ambientLight = new AmbientLight(0xffffff, 0.5)
    // 环境光强度：设置场景中环境光的强度。环境光均匀地照亮场景中的所有物体。值为1表示环境光强度为最大
    ambientLight.intensity = Style.default.ambientLightIntensity    // 1
    ambientLight.name = "ambientLight"
    scene.add(ambientLight)
}