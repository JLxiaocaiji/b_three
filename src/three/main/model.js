import * as THREE from "three"
import { gui, debugObject } from '../system/gui'
import isMobileDevice from "../utils/deviceType"
import { ReflectorForSSRPass } from "three/examples/jsm/Addons.js"
import { sizes } from "../system/sizes"
import { ssrPass } from '../base/composer';

let scene = new THREE.Scene()

const createModels = (_scene) => {
    scene = _scene

    // 背景音
    // scene.userData.listener 是一个 THREE.AudioListener 对象的引用，它被存储在场景（THREE.Scene）对象的 userData 属性中
    const positionalAudio = new THREE.PositionalAudio(scene.userData.listener)
    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();

    // import.meta.env.BASE_URL 是一个环境变量，它通常包含你的应用程序的基本URL
    // buffer 参数是加载的音频数据
    audioLoader.load(import.meta.env.BASE_URL + "bg0.mp3", (buffer) => {
        // setBuffer 方法将加载的音频数据设置到位置音频对象中
        positionalAudio.setBuffer(buffer);
        // setRefDistance 方法设置了音频的参考距离，这是指音频开始衰减的距离
        positionalAudio.setRefDistance(3);

        // 浏览器安全策略，须用户进行 click, touchend: 触摸结束 才可播放音频
        addEventListener("click", () => {
            !positionalAudio.isPlaying && positionalAudio.play();
        })
        addEventListener("touchend", () => {
            !positionalAudio.isPlaying && positionalAudio.play()
        })
    });

    // 异步加载一个 GLB 模型文件
    gltfLoader.load(import.meta.env.BASE_URL + '911-draco.glb', (gltf)=> {
        // gltf.scene 是一个 THREE.Group 或 THREE.Scene 对象，它包含了加载的GLTF模型的所有几何体和材质
        const carModel = gltf.scene
        // 为模型设置一个名称，这在调试或通过名称查找模型时很有用
        carModel.name = "911"
        // 将之前创建的 positionalAudio 对象添加到汽车模型中, 音频源将随模型一起移动，并且其音效将根据模型的位置来处理
        carModel.add(positionalAudio)
        // 添加模型
        scene.add(carModel)
        // 调整模型位置: 将模型在 y 轴上的位置向上调整0.63单位
        carModel.position.y += 0.63

        console.log('carModel', carModel)
        // 材质更新调整
        updateAllMaterials()

        // 关闭GUI控制面板
        gui.close()
    })

    // 将平面几何体和材质结合在一起，形成地面
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 6),
        new THREE.MeshStandardMaterial({
            color: "#7780a6",   // 地面的颜色设置为深灰色
            roughness: 0.2, // 材质的粗糙度设置为0.2，较低的值表示表面更光滑
            metalness: 0.8, // 材质的金属感设置为0.8，较高的值表示表面更像金属
            side: THREE.FrontSide,  // 只有几何体的前面会被渲染
            envMap: scene.userData.dynamicMap,  // 环境映射为 userData.dynamicMap 用户数据中预先定义的一个环境贴图
            envMapIntensity: 0.8,   // 环境映射的强度设置为0.8，这决定了环境映射对材质颜色的影响程度
        })
    )

    // 地面将只被特定的层渲染，这通常用于分层渲染或选择性渲染, 这里是 1
    ground.layers.enable(scene.userData.rtCubeCameraLayer)
    // 接收来自其他物体（如灯光源）的投影
    ground.receiveShadow = true 
    // 将地面旋转90度（π/2弧度），使其平行于x轴和z轴，垂直于y轴
    ground.rotation.set(-Math.PI * 0.5, 0, 0)
    // 放置在场景的原点
    ground.position.set(0, 0, 0)
    scene.add(ground)

    // 若为手机设备，不使用 使用深度纹理
    let isUseDepthTexture = true
    if (isMobileDevice()) {
        isUseDepthTexture = false
    }

    // 用于屏幕空间反射（Screen Space Reflection, SSR）的特殊反射器
    const groundReflector = new ReflectorForSSRPass(
        new THREE.PlaneGeometry(5, 6),
        {
            // 控制反射器如何处理几何体的边缘，以避免深度冲突
            clipBias: 0.0003,
            // 反射器的纹理尺寸，通常设置为与画布尺寸相同
            textureWidth: sizes.width,
            textureHeight: sizes.height,
            color: 0x888888,
            useDepthTexture: isUseDepthTexture,
        }
    )
    // 反射器将写入深度缓冲区
    groundReflector.material.depthWrite = true;
    // 反射器的旋转设置为使平面与x轴和z轴平行，与y轴垂直
    groundReflector.rotation.set(-Math.PI * 0.5, 0, 0)
    // 反射器的位置，将其放置在场景的原点稍微向上（0.01单位）的位置
    groundReflector.position.set(0, 0.01, 0)
    // 反射器的visible属性设置为false，这意味着反射器本身不会在场景中直接渲染，但它仍然会影响SSR效果
    groundReflector.visible = false;
    // 将反射器对象赋值给ssrPass对象的groundReflector属性
    ssrPass.groundReflector = groundReflector

    scene.add(groundReflector)

    //  决定物体在渲染时的顺序。数值越大，物体越晚被渲染
    ground.renderOrder = 1
    // groundReflector的渲染顺序为2，确保它比地面（renderOrder为1）更晚渲染
    groundReflector.renderOrder = 2
    // 开启菲涅耳效应，这会根据视角改变反射的强度，通常用于创建更真实的水面或玻璃效果
    groundReflector.fresnel = ssrPass.fresnel = true;
    // 启用距离衰减，这意味着反射强度会随着距离的增加而减弱
    groundReflector.distanceAttenuation = ssrPass.distanceAttenuation = true;
    // 设置SSRPass的最大反射距离
    ssrPass.maxDistance = 1.3
    // 最大反射距离设置为与ssrPass相同的值
    groundReflector.maxDistance = ssrPass.maxDistance
    // SSRPass的反射透明度。这里设置为0.55，意味着反射将有一定的透明度
    ssrPass.opacity = 0.55
    groundReflector.opacity = ssrPass.opacity


    debugObject.painColor = '#b3b3ff'
    gui.addColor(debugObject, "painColor").onChange(()=> {
        updateAllMaterials()
    })
    gui.add(ground, "visible").name("ground visible")
}

const updateAllMaterials = () => {
    // 在场景中根据名称获取一个对象。在这里，它尝试找到名为"911"的对象
    scene.getObjectByName("911")
    // traverse: 递归遍历model包含所有的模型节点及其所有子对象，并对每个子对象执行传入的函数
    .traverse((child) => {
        // 判断用来检查当前遍历到的子对象是否是一个网格, 可被渲染
        if (child instanceof THREE.Mesh) {
            // 该网格能够投射阴影
            child.castShadow = true
            // 该网格能够接收阴影
            child.receiveShadow = true
            // 网格的材质设置环境贴图（envMap）。scene.userData.dynamicMap假设是在场景的用户数据中预先定义的一个环境贴图
            child.material.envMap = scene.userData.dynamicMap

            // 材质名称为 橡胶
            if (child.material.name === "rubber") {
                child.material.color.set("#222")    // 将材质的颜色设置为深灰色。
                child.material.roughness = 1    // 将材质的粗糙度设置为1，使材质非常粗糙且反射较少。
                child.material.normalScale.set(4, 4)    // 法线贴图对材质的影响程度, 典型范围是0-1,将法线贴图的效果放大4倍，增强材质的细节和深度感
                child.material.material.envMap = scene.userData.dynamicMap  // 为材质设置环境贴图，用于反射效果
            }
            // 材质名称为 窗户
            if (child.material.name === "window") {
                child.material.color.set("#222")
                child.material.roughness = 1
                // 清漆层属性.clearcoat可以用来模拟物体表面一层透明图层，就好比你在物体表面刷了一层透明清漆，喷了点水。.clearcoat的范围0到1，默认0
                child.material.clearcoat = 0.1
                child.material.envMap = scene.userData.dynamicMap   // 为材质设置环境贴图，用于反射效果
            }
            // 材质名称为 外套表皮；涂料层，覆盖层
            if (child.material.name === "coat") {
                child.material.envMapIntensity = 4
                child.material.roughness = 0.5
                child.material.metalness = 1
                child.material.envMap = scene.userData.dynamicMap
            }
            // 材质名称为 油漆
            if (child.material.name === "paint") {
                child.material.envMapIntensity = 2  // 将环境贴图的反射强度设置为2
                child.material.roughness = 0.45 // 将材质的粗糙度设置为0.45，使材质具有一定的反射性。
                child.material.metalness = 0.8  // 将材质的金属度设置为0.8，表示材质主要是金属的
                child.material.envMap = scene.userData.dynamicMap   // 为材质设置环境贴图，用于反射效果
                child.material.color.set(debugObject.paintColor)    // 将材质的颜色设置为`debugObject`对象中定义的`paintColor`
            }
        }
    })

    // 更新阴影
    // scene.getObjectByProperty(name, value):从对象本身开始，搜索对象及其子对象，并返回第一个与给定值匹配的属性
    // name: 要搜索的属性名称
    // value: 属性的值
    // scene.getObjectByProperty("type", "SpotLight").shadow.needsUpdate = true

    /**
     * SpotLight对象的needsUpdate属性并不直接存在。然而，SpotLight确实有一个阴影映射系统，而阴影映射系统有一个needsUpdate属性。当你想要更新SpotLight的阴影映射时，你应该使用SpotLight的shadow属性中的map属性的needsUpdate属性
     */
    let spotLight = scene.getObjectByProperty("type", "SpotLight")
    if (spotLight.castShadow.map) {
        spotLight.castShadow.map.needsUpdate = true
    }
}

export { createModels, updateAllMaterials }