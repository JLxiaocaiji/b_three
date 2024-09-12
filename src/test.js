import * as THREE from "three"
// 导入轨道控制
import { OrbitControls, orbitControls } from "three/examples/jsm/controls/OrbitControls.js"

/**
 * 相机
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


// 渲染器
const renderer = new THREE.WebGLRenderer({
    // 抗齿距
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);