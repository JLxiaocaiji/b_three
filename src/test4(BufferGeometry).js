import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"

/**
 * 1.scene
 */
const scene = new THREE.Scene()

/**
 * 2.camera
 */
let fov = 75
let aspect = window.innerWidth / window.innerHeight
let near = 0.01
let far = 1000
const camera = new THREE.PerspectiveCamera(
    fov, aspect, near, far
)

// camera.position.z = 10
camera.position.set(0, 0, 10)

/**
 * 3.renderer
 */
const renderer = new THREE.WebGLRenderer({
    // 抗齿距
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * 4.Mesh
 */
// BufferGeometry 图元是面向性能的类型
const geometry = new THREE.BufferGeometry();
// 顶点
const vertices = new Float32Array([
    -1.0, -1.0, 1.0, // 第一个顶点
    1.0, -1.0, 1.0,  // 第二个顶点
    1.0, 1.0, 1.0,   // 第三个顶点
    1.0, 1.0, 1.0,   // 第四个顶点
    -1.0, 1.0, 1.0,  // 第五个顶点
    -1.0, -1.0, 1.0, // 第六个顶点
])
// .setAttribute() 方法用于为几何体添加属性，这里添加的是 position 属性，它定义了顶点的位置
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


/**
 * 5.其他配置
 */
// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标辅助器 5为线段长度，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const render = () => {
    // 轨道控制器更新
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

render()

document.body.appendChild(renderer.domElement);
