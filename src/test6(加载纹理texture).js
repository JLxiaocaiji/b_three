import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/**
 * 1.scene
 */
const scene = new THREE.Scene();

/**
 * 2.renderer
 */
const renderer = new THREE.WebGLRenderer({
    // 抗齿距
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * 3.camera
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0,0,10)

/**
 * 4.Mesh
 */
// 加载纹理
const textureLoader = new THREE.TextureLoader();
// 加载的图片要放在 public 中
const doorColorTexture = textureLoader.load("./textures/door/color.jpg")

console.log(doorColorTexture)

// 几何
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
// 材质
const basicMaterial = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    // 材质的纹理贴图
    map: doorColorTexture,
    // side: THREE.DoubleSide, // 设置材质的渲染面，默认为THREE.FrontSide，即正面渲染
})

// Mesh 网格对象
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
scene.add(cube)


/**
 * 其他配置
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(5)
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
    renderer.setPixelRatio(window.devicePixelRatio);
})

document.body.appendChild(renderer.domElement)


