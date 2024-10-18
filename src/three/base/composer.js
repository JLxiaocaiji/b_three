import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { sizes } from "../system/sizes";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { EffectComposer } from "three/examples/jsm/Addons.js";
import * as THREE from "three"

const parameters = {
    bloomStrength: 0.3,
    bloomThreshold: 0.1,
    bloomRadius: 0.6,
}

let ssrPass = null

function initComposer(renderer, scene, camera){
    // RenderPass：这是一个后处理通道，用于渲染场景和相机。这是所有后处理效果的基础，因为它首先渲染了场景
    const renderScene = new RenderPass(scene, camera);

    // UnrealBloomPass：这是用于创建辉光效果的通道。辉光效果会使场景中明亮的部分“泛光”，从而增加视觉效果，尤其是在光源和高亮区域
    // new UnrealBloomPass(resolution, strength, radius, threshold)
    const bloomPass = new UnrealBloomPass(
        // 定义效果的分辨率
        new THREE.Vector2(sizes.width, sizes.height),
        1.5,    // 强度，控制辉光效果的强度
        0.4,    // 半径，控制辉光效果的扩散范围
        0.85    // 阈值，控制哪些部分会被辉光效果影响
    )

    // 定义了像素亮度达到何种程度时才会被考虑用于辉光效果。它的值通常在0到1之间，其中0表示所有像素都被考虑，而1则表示只有最亮的像素才会产生辉光效果
    bloomPass.threshold = parameters.bloomThreshold;
    // 决定了辉光效果的强度。值越高，辉光效果越明显。这个值可以根据场景的具体需要来调整
    bloomPass.strength = parameters.bloomStrength;
    // 定义了辉光效果向外扩展的半径。值越大，辉光越分散，覆盖的区域也越广
    bloomPass.radius = parameters.bloomRadius;

    // 抗锯齿处理通道
    // FXAAShader: 快速近似抗锯齿（FXAA）的着色器，用于减少图像中的锯齿效果
    const fxaaPass = new ShaderPass(FXAAShader);
    // 获取渲染器的像素比
    const pixelRatio = renderer.getPixelRatio();
    // uniform变量是一个二维向量，用于在着色器中计算每个像素的物理尺寸
    // 设置了 resolution 向量的x分量。它计算每个CSS像素在x轴方向上的实际尺寸。这是通过将画布的宽度（sizes.width）乘以像素比（pixelRatio），然后取其倒数来完成的。这样，着色器就知道如何在x轴上应用FXAA算法
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (sizes.width * pixelRatio);
    // 同上设置 y 分量
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (sizes.height * pixelRatio);

    // SSRPass（Screen Space Reflections Pass）用于添加屏幕空间反射效果，这可以给场景中的物体添加反射特性，从而增强真实感
    ssrPass = new SSRPass({
        renderer,
        scene,
        camera,
        width: innerWidth,
        height: innerHeight,  
        groundReflector: null,  // 地面反射器，用于控制地面的反射效果,如果场景中有一个特定的平面需要特别处理反射效果，可以传递这个参数。如果不需要特别处理地面反射，可以设置为null
        selects: []
    })

    // 输出
    // 创建一个OutputPass实例，通常用于将最终的后处理结果输出到屏幕或渲染目标
    const outputPass = new OutputPass()
    // 创建一个EffectComposer实例，传入渲染器用于执行实际的渲染操作
    const composer = new EffectComposer(renderer)
    // 将基本的渲染通道添加到composer，这是第一个pass，用于渲染场景和相机
    composer.addPass(renderScene);
    // 将SSRPass（屏幕空间反射）添加到composer，用于添加反射效果
    composer.addPass(ssrPass)
    // 将BloomPass（辉光效果）添加到composer，用于添加辉光效果
    composer.addPass(bloomPass)
    // 将OutputPass添加到composer，用于输出最终结果
    composer.addPass(outputPass)
    // 将FXAAPass（快速近似抗锯齿）添加到composer，用于平滑图像边缘
    composer.addPass(fxaaPass)

    return composer
}

export { initComposer, ssrPass }