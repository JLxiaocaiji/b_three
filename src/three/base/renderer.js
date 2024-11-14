import { PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from "three"
import { sizes} from "../system/sizes"

/**
 * THREE.PCFSoftShadowMap 是 Three.js 库中的一个常量，用于指定阴影映射的类型，
 * 是一种阴影过滤技术，它可以平滑阴影边缘，使其看起来不那么生硬和块状。
 * PCF（Percentage Closer Filtering）：PCF 通过在每个阴影映射的像素周围采样多个点来确定阴影的柔和程度。通过这种方式，阴影边缘呈现出一种渐变效果，而不是硬边。
软阴影：软阴影指的是边缘模糊的阴影，与硬阴影（边缘清晰）相对。软阴影通常看起来更自然，因为现实世界中的阴影通常不是完全锐利的。
性能考虑：虽然软阴影看起来更真实，但它们通常比硬阴影计算起来更耗费性能。THREE.PCFSoftShadowMap 是一种平衡性能和视觉效果的阴影映射方法
 */

/**
 * 
 * @param {*} container 
 * @returns 
 */
export const createRenderer = ( container ) => {
    const renderer = new WebGLRenderer({
        // 一个供渲染器绘制其输出的canvas 它和下面的domElement属性对应。 如果没有传这个参数，会创建一个新canvas
        canvas: container,
        // 抗齿锯，更光滑
        antialias: true,
    })
    // 启用阴影映射
    renderer.shadowMap.enabled = true
    // 设置阴影映射的类型为 PCF软阴影映射
    renderer.shadowMap.type = PCFSoftShadowMap
    // 设置渲染器的大小以匹配画布的尺寸
    renderer.setSize(sizes.width, sizes.height)
    // 设置像素比，以匹配设备的像素比，但不超过2： Math.min() 函数返回作为输入参数的数字中最小的一个
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 设置输出颜色空间为sRGB颜色空间
    // 注意：在Three.js中，颜色空间设置可能不是直接这样设置的，具体取决于Three.js的版本
    // 在较新的Three.js版本中，可以这样设置：
    renderer.outputColorSpace = SRGBColorSpace
    return renderer
}