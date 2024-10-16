import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 1. scene
 */
const scene = new THREE.Scene();

/**
 * 2. camera
 */
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
)
// camera.position.z = 10
camera.position.set(0, 0, 10)

/**
 * Mesh
 */
// positionArray 的每一行都有 9 个,这 9 个每 3个组成一个点的坐标，
for( let i = 0; i < 50; i++) {
    const geometry = new THREE.BufferGeometry();
    const positionArr = new Float32Array(9)
    for( let j = 0; j < 9; j++) {
        positionArr[j] = Math.random() * 10 - 5;
    }

    // BufferAttribute: 用于存储与BufferGeometry相关联的 attribute； 3 每个顶点位置由三个值组成
    geometry.setAttribute("position", new THREE.BufferAttribute(positionArr, 3))

    let color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const material = new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: 0.5
    })

    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)
}

const renderer = new THREE.WebGLRenderer({
    // 抗齿距
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true

// scene 不需加 controls
// scene.add(controls)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

const render = () => {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
render()

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})

