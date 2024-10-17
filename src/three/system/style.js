import * as TEXTURE from "../texture/index.js"

export const Style = {
    default: {
        // 环境映射：指定材质使用的环境映射纹理
        envMap: TEXTURE.envMap,
        // 背景强度：控制场景背景颜色或环境映射的强度。这里的值1.3表示背景强度增加了30%
        backgroundIntensity: 1.3,
        // 环境光强度：设置场景中环境光的强度。环境光均匀地照亮场景中的所有物体。值为1表示环境光强度为最大
        ambientLightIntensity: 1,   
        // 方向光强度：设置场景中方向光的强度。方向光类似于太阳光，光线平行发射。值为4表示方向光非常强烈
        directionalLightIntensity: 4,
        // 雾的颜色：定义场景中的雾的颜色。0xadd5ff是一个十六进制值，对应于浅蓝色
        fogColor: 0xadd5ff,
        // 环境映射强度：控制材质表面反射环境映射的强度
        envMapIntensity: 0.4
    }
}