import * as THREE from "three"
// 导入轨道控制，使得相机围绕目标进行轨道运动
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// 导入 gui
import * as dat from "dat.gui";
// 导入动画库
import gsap from "gsap";

/**
 * 1.相机
 */
// field of view 视野角度
let fov = 75
let aspect = window.innerWidth / window.innerHeight
let near = 0.001
let far = 1000
const camera = new THREE.PerspectiveCamera(
    fov, aspect, near, far
)
// camera.position.z = 10
camera.position.set(0, 0, 10)


/**
 * 2.render
 */
// 渲染器
const renderer = new THREE.WebGLRenderer({
    // 抗齿距
    antialias: true,
});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)



/**
 * 3.场景
 */
const scene = new THREE.Scene();


/**
 * 4.网格对象
 */
let boxWidth = 1
let boxHeight = 1
let boxDepth = 1
// 立体 geometry:几何
const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// x: 45°， y: 0, z: 0,先绕 X 轴旋转，然后绕 Z 轴旋转，最后绕 Y 轴旋转，即倾斜角度
cube.rotation.set(Math.PI / 4, 0, 0, "XZY")

scene.add(cube);

/**
 * 5.其他配置
 */
// 5.1 创建轨道控制器，使得相机围绕目标进行轨道运动
const controls = new OrbitControls(camera, renderer.domElement);
// damping 阻尼, 设置控制器阻尼
controls.enableDamping = true;


// 添加坐标辅助器 5为线段长度，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper);


// render 渲染，轨道控制 orbitcontrols 更新
const render = () => {
    cube.position.x += 0.01
    if ( cube.position.x > 5) {
        cube.position.x = 0
    }

    // 轨道控制器更新
    controls.update();
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
render()

/**
 * gui
 */
const gui = new dat.GUI();
// 对 立方体 的 位置属性的 x 修改
gui.add(cube.position, "x").min(0).max(5).step(0.01).name("移动x轴").onChange((e)=> {
    console.log("值被修改：", e);
}).onFinishChange((e)=> {
    console.log("完全停下来:", e);
})

// 需修改的属性集
const params = {
    color:"#ffff00",
    fn: () => {
        // x: 5：将 cube 对象的 x 位置动画化到 5
        // duration: 2：动画的持续时间是 2 秒
        // yoyo: true：当动画到达终点后，会返回到起点，形成一个往返动画
        // repeat: -1：动画会无限重复。如果设置为正整数，动画将重复指定的次数
        gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repea: -1 })
    }
}

// 添加修改颜色 gui， 一定要放在 params 中，是格式
gui.addColor(params, "color").onChange(e => {
    console.log("值被修改：", e);
    cube.material.color.set(e)
})

// 设置选项框, 修改 visible 属性
gui.add(cube, "visible").name("是否显示")

// addFolder: 添加文件夹样式
const folder = gui.addFolder("设置立方体");
// .add(cube.material, "wireframe"): 添加一个控制器，用于切换立方体的线框模式
folder.add(cube.material, "wireframe").name("显示线框");
// 设置按钮点击触发某个事件
folder.add(params, "fn").name("立方体运动");

// 设置文件夹展开状态
folder.open();

// 设置 gui 的位置
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '10px';
gui.domElement.style.right = '0';

// 响应式
window.addEventListener("resize", () => {
    // 更新摄像头宽高比
    camera.aspect = window.innerWidth / window.innerHeight

    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    // pixel：像素，设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
})

/**
 * 6. 挂载
 */
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);