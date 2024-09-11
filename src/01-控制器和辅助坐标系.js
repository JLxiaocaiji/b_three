import * as THREE from 'three';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建场景,
const scene = new THREE.Scene()

// 透视相机
const camera = new THREE.PerspectiveCamera(
    45, // 视角
    window.innerWidth / window.innerHeight, // 屏幕相机宽高比
    0.1,    // 近平面，最近能看到的是什么
    1000,   // 远平面，最远能看到的是什么
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加到画布上
document.body.appendChild(renderer.domElement)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00})

// 创建网格
const cube = new THREE.Mesh(geometry, material)

// 网格添加到场景中
scene.add(cube)

// 设置相机位置 
camera.position.z = 5;  // z轴
camera.position.y = 5;  // y轴
camera.position.x = 5;  // x轴

// 设置相机看向位置
camera.lookAt(0, 0, 0);

// 添加坐标辅助器 5为线段长度，
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 添加轨道控制器, 格式固定
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.01



// 动态渲染函数
function animation() {
    requestAnimationFrame( animation )

    // 控制器更新， 必须在对相机的变换进行任何手动更改后调用
    controls.update();

    // x 轴
    cube.rotation.x += 0.01
    // y 轴
    cube.rotation.y += 0.01

    // 渲染
    renderer.render(scene, camera)
}

animation()