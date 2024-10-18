import * as THREE from "three";
import { gui } from "./system/gui"
import Stats from "stats.js"
import isMobileDevice from "./utils/deviceType"
import { createCamera } from "./base/camera"
import { createControl } from "./base/control"
import { createScene } from "./base/scene"
import { createRenderer } from "./base/renderer"
import { initComposer } from "./base/composer"
import { createModels } from "./main/model"
import { createLight } from "./base/light"
import { createDynamicEnv } from "./main/dynamicEnv"
import * as resize from "./system/resize"
import { disposeTexture } from "./texture"

// 三维向量（3D vector）
const vector3 = new THREE.Vector3();

// 单例模式, 一个类只有一个实例，并提供一个全局访问点来访问这个实例
class ThreeApp {
    // // 静态属性，用于存储单例实例
    static instance

    // 静态方法，用于获取单例实例
    static getInstance() {
        // 如果实例不存在，则创建它
        if (!ThreeApp.instance) {
            ThreeApp.instance = new ThreeApp(container);
        }

        return ThreeApp.instance
    }

    // 构造函数是私有的，外部不能直接使用new创建实例
    // container 本质是 canvas
    constructor(container) {
        // 如果已经存在实例，则直接返回该实例
        if ( ThreeApp.instance) {
            return ThreeApp.instance
        }

        // 将实例赋值给静态属性，表示已经创建了实例
        ThreeApp.instance = this;

        // stat, Stats 类是一个用于显示性能统计的面板
        let stats = new Stats();
        // 显示第一个面板  0: fps, 1: ms, 2: mb, 3+: custom
        stats.showPanel(0);
        document.body.appendChild(stats.dom)
        stats.dom.className = "stats"
        this.stats = stats

        this.isAllowComposer = true;

        if (isMobileDevice()) {
            alert("当前设备可能不支持SSR效果，建议使用PC端进行浏览。")
            this.isAllowComposer = false
        }

        gui.add(this, "isAllowComposer").name("SSR-enabled").onChange( e => {
            if ( v && isMobileDevice()) {
                if (confirm("您的设备暂不完全支持SSR效果，强制开启可能导致画面出现异常，是否继续？"))
                    this.isAllowComposer = true
                else
                    this.isAllowComposer = false
            }
        })

        console.log("场景初始化")
        // 相机 camera
        this.camera = createCamera();
        this.listener = new THREE.AudioListener()
        this.camera.add(this.listener)

        // 控制器
        this.control = createControl(this.camera, container)
        // 场景 scene
        this.scene = createScene()
        // 存储场景中音频监听器的引用
        this.scene.userData.listener = this.listener
        // 渲染器 renderer
        this.renderer = createRenderer(container)
        // 后处理渲染器 composer
        this.composer = initComposer(this.renderer, this.scene, this.camera)

        // 目标渲染
        // 创建一个新的WebGLCubeRenderTarget对象,专门用于生成立方体贴图（Cube Map）,参数256指定了立方体贴图的每个面的分辨率，即每个面都是256x256像素
        this.renderTarget = new THREE.WebGLCubeRenderTarget(256)
        // THREE.HalfFloatType是一个纹理类型，它允许使用16位浮点数来存储颜色信息，这比默认的8位整数类型提供了更高的颜色精度，这对于渲染高质量的反射和折射效果很有用
        this.renderTarget.texture.type = THREE.HalfFloatType

        // 创建6个渲染到WebGLCubeRenderTarget的摄像机
        // 参数 near, far, renderTarget
        this.rtCubeCamera = new THREE.CubeCamera(1, 1000, this.renderTarget)
        // 设置立方体相机所属的层（layer）,层是一种用于控制对象渲染的方式。通过设置不同的层，可以更精细地控制哪些对象被哪些相机看到
        this.rtCubeCamera.layers.set(1)
        // 这里只是个赋值操作，将层1的引用存储在场景（scene）的userData对象中
        this.scene.userData.rtCubeCameraLayer =  1
        // 将渲染目标（render target）的纹理（texture）存储在场景（scene）的userData属性中
        this.scene.userData.dynamicMap = this.renderTarget.texture

        // 场景组成内容 object3D
        createModels(this.scene)

        // 灯光
        createLight(this.scene)

        createDynamicEnv(this.scene)

        resize.resizeEventListener(this.camera, this.renderer)
    }

    render() {
        // 渲染场景
        console.log("渲染场景...")
        const clock = new THREE.Clock()
        let previousTime = 0;
        // 定义一个名为tick的方法，该方法将在每一帧中被调用
        this.tick = () => {
            // 更新性能监控器（stats对象）
            this.stats.update();
            // 获取自时钟启动后的秒数，同时将 .oldTime 设置为当前时间。如果 .autoStart 设置为 true 且时钟并未运行，则该方法同时启动时钟
            const elapsedTime = clock.getElapsedTime()

            // console.log(11111)
            // console.log(clock.getElapsedTime())
            // console.log(clock.getDelta())
            // console.log(this.scene.userData)
            // 计算自上一帧以来经过的时间（秒）
            const deltaTime = elapsedTime - previousTime
            // 更新previousTime变量，为下一帧计算deltaTime做准备
            previousTime = elapsedTime

            this.control.update()

            // 使用线性插值（lerp）平滑地更新相机位置
            // 设置一个新向量，其x坐标基于sin函数随时间变化，y坐标保持不变，z坐标基于cos函数随时间变化
            // 然后将该向量与当前相机位置相加，最后使用lerp函数以0.05的插值率更新相机位置
            this.camera.position.lerp(vector3.set(0.05 * Math.sin(elapsedTime), 0, 0.01 * Math.cos(elapsedTime)).add(this.camera.position), 0.05)

            // 如果场景的userData属性中存在dynamicEnv对象，则遍历它的所有子对象
            this.scene.userData.dynamicEnv && this.scene.userData.dynamicEnv.children.forEach( item => {
                // 如果子对象有userData属性并且该属性包含update方法，则调用该方法
                // 传递deltaTime和elapsedTime作为参数
                if (item.userData.update) {
                    item.userData.update(deltaTime, elapsedTime)
                }
            })
            // 更新场景背景的蓝色通道值，使其随时间变化
            // 使用sin函数使蓝色通道值在0.02的范围内波动，并添加0.04以避免值为负
            this.scene.background.b = 0.02 * Math.sin(elapsedTime) + 0.04
            // 更新立方体贴图相机（rtCubeCamera），渲染场景的立方体贴图
            this.rtCubeCamera.update(this.renderer, this.scene)

            // Render
            if(this.isAllowComposer) {
                // 后期渲染处理
                this.composer.render()
            } else {
                this.renderer.render(this.scene, this.camera)
            }
            this.tickId = window.requestAnimationFrame(this.tick)
        }
        this.tick();
    }

    clear() {
        console.log("清理内存")
        resize.clear();
        document.body.removeChild(this.stats.dom)
        cancelAnimationFrame(this.tickId)
        this.tick = null;
        // 递归遍历model包含所有的模型节点及其所有子对象
        this.scene.traverse( child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                child.material.dispose()
            }
        })
        this.scene = null
        this.camera = null
        this.renderer.dispose()
        this.control.dispose()
        disposeTexture()

        gui.children.forEach( h=> {
            console.log("h")
            console.log(h)
            h.domElement.remove();
        })
    }
}

export { ThreeApp }