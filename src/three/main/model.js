import * as THREE from "three"

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

        updateAllMaterials()
    })
}

const updateAllMaterials = () => {
    scene.getObjectByName("911").traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            child.material.envMap = scene.userData.dynamicMap
        }
    })
}