import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import * as dat from "dat.gui";
// 导入动画库
import gsap from "gsap";

/**
 * 1.camera
 */
let fov = 75
let aspect = window.innerWidth / window.innerHeight
let near = 0.01
let far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0,0, 10)

/**
 * 2.renderer
 */
// 抗齿锯
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)


/**
 * 3.scene
 */
const scene = new THREE.Scene()

/**
 * 4.mesh
 */
let boxWidth = 1
let boxHeight = 1
let boxDepth = 1
const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth )
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

const cube = new THREE.Mesh(geometry, material)
// x: 45°， y: 0, z: 0,先绕 X 轴旋转，然后绕 Z 轴旋转，最后绕 Y 轴旋转, 即倾斜角度
cube.rotation.set(Math.PI / 4, 0, 0, "XZY")

// 实际上并不需要这样做，因为摄像机不是场景的一部分，它只是定义了视角
// scene.add(camera)
scene.add(cube)

/**
 * 5. 其他配置
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

// 添加坐标辅助器 5为线段长度，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const gui = new dat.GUI()
gui.add(cube.position, "x").min(0).max(5).step(0.01).name("移动x轴").onChange(e => {
    console.log(e)
}).onFinishChange(e=> {
    console.log(e)
})
// 修改物体颜色
const params = {
    color: "#ffff00",
    fn: () => {
        gsap.to(cube.position, {x: 5, duration: 2, yoyo: true, repeat: 5})
    }
}

gui.addColor(params, "color").onChange(e => {
    console.log(e)
    cube.material.color.set(e)
})

gui.add(cube, "visible").name("是否显示")
const folder = gui.addFolder("设置立方体")
folder.add(cube.material, "wireframe").name("显示线框")
folder.add(params, "fn").name("立方体运动")
folder.open()

gui.domElement.style.position = "absolute"
gui.domElement.style.top = "10px"
gui.domElement.style.right = "10px"


// 时钟
const clock = new THREE.Clock()

const render = (time) => {
    // 移动样式1
    // cube.position.x += 0.01
    // cube.rotation.x += 0.01
    // if( cube.position.x >= 5) {
    //     cube.position.x = 0
    // }

    // 移动样式2
    // time *= 0.001
    // cube.position.x = time % 5

    // 外部时间
    // let ctime = clock.getElapsedTime();
    // console.log("时钟运行总时长：", ctime);
    // let t = ctime % 5;
    // cube.position.x = t * 1;

    // 轨道控制器更新
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

render()

const animation = gsap.to(cube.position, {
    x: 5,
    duration: 5,
    // power1.inOut 是 GSAP (GreenSock Animation Platform) 中使用的一种缓动函数
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2,
    onStart: () => {
        console.log("动画开始")
    },
    onComplete: () => {
        console.log("动画完成")
    }
})

window.addEventListener("resize", () => {
    // 动画库
    if ( animation.isActive) {
        // 暂停
        animation.pause()
    } else {
        // 恢复
        animation.resume()
    }

    camera.aspect(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})
/**
 * 挂载
 */
document.body.appendChild(renderer.domElement)