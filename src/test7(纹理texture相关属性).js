import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 1.scene
 */
const scene = new THREE.Scene();

/**
 * 2.camera
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
camera.position.set(0, 0, 10)

/**
 * 3.renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * 4.mesh
 */
// 纹理，材质
const textureLoader = new THREE.TextureLoader();

// 纹理相关设置
const doorColorTexture = textureLoader.load("./textures/door/color.jpg")
doorColorTexture.offset.x = 0.5
doorColorTexture.offset.y = 0.5
// doorColorTexture.set(0.5, 0.5)

// 纹理旋转
// 设置旋转原点
doorColorTexture.center.set(0.5, 0.5)
// 旋转 45°
doorColorTexture.rotation = Math.PI / 4;
// repeat 属性用于设置纹理在U（水平）和V（垂直）方向上的重复次数, 在水平方向（U方向）上重复纹理2次，在垂直方向（V方向）上重复纹理3次
doorColorTexture.repeat.set(2, 3)

// MirroredRepeatWrapping: 纹理在U方向（水平方向）的包裹模式为镜像重复
doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// RepeatWrapping: 纹理在V方向（垂直方向）的包裹模式为普通重复
doorColorTexture.wrapT = THREE.RepeatWrapping



const texture = textureLoader.load("./textures/minecraft.png")

console.log(doorColorTexture)

// 几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    // 材质的纹理贴图
    map: doorColorTexture,
    // map: texture,
    transparent: true,
    opacity: 0.3,
    // side: THREE.DoubleSide, // 设置材质的渲染面，默认为THREE.FrontSide，即正面渲染
})
const cube = new THREE.Mesh(cubeGeometry, material)
scene.add(cube)


/**
 * 5.配置
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.render(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})

document.body.appendChild(renderer.domElement)