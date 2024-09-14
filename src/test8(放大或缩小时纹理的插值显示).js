import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 1.scene
 */
const scene = new THREE.Scene();

/**
 * 2.camera
 */
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
)
camera.position.set(1, 1, 1)

/**
 * 3.renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * 4.mesh
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const texture = textureLoader.load("./textures/minecraft.png");

console.log(doorColorTexture)
doorColorTexture.offset.x = 0.5
doorColorTexture.offset.y = 0.5
// doorColorTexture.offset.set(0.5, 0.5)

// 设置旋转的原点
doorColorTexture.center.set(0.5, 0.5)
// 旋转45deg
doorColorTexture.rotation = Math.PI / 4
// 设置纹理的重复
doorColorTexture.repeat.set(2, 3)

// 设置U方向的包裹模式为镜像重复
doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// 设置V方向的包裹模式为普通重复
doorColorTexture.wrapT = THREE.RepeatWrapping;

// 设置当 放大或 缩小 的纹理显示
// minFilter 属性用于定义当纹理被缩小（minification）时的过滤模式
// THREE.LinearFilter 是一种线性过滤模式，它会使用纹理坐标周围的像素值来创建一个平滑的插值结果，从而减少锯齿和模糊效果
texture.minFilter = THREE.LinearFilter;
// magFilter 属性用于定义当纹理被放大（magnification）时的过滤模式
texture.magFilter = THREE.LinearFilter;

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const basicMaterial = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    // 材质的纹理贴图
    map: texture,
    // side: THREE.DoubleSide, // 设置材质的渲染面，默认为THREE.FrontSide，即正面渲染
})

const cube = new THREE.Mesh(cubeGeometry, basicMaterial)

scene.add(cube)

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
    renderer.setPixelRatio(window.devicePixelRatio)
})

document.body.appendChild(renderer.domElement)