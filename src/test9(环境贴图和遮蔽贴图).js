import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * scene
 */
const scene = new THREE.Scene();

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.set(0, 0, 10)

/**
 * mesh
 */
// texture
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("./textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg")
const doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")

// geometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const basicMaterial = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    // map: 材质的纹理贴图，材质的颜色贴图
    map: doorColorTexture,
    // 也称透明贴图，用于控制材质的透明度， 原本 alpha.jpg 中灰白色部分是实体， 黑色部分是透明
    alphaMap: doorAlphaTexture,
    // true: 材质变为半透明，渲染顺序时根据物体和摄像机的距离排序
    transparent: true,
    
    // 环境遮蔽贴图对材质外观的影响强度
    aoMapIntensity: 1,
    // 环境遮蔽贴图: 描述了在几何体的不同区域中，光线能够到达的难易程度
    aoMap: doorAoTexture,
    // 贴图透明度
    opacity: 1,
})

// 将材质的侧面属性设置为双面显示, 
/*
 *  双面显示: 当你的物体是一个封闭的形状，但是摄像机可能会从内部观察时，双面显示确保了无论摄像机位于物体的哪一侧，物体的面都是可见的
             设计模型时，双面显示可以帮助设计师从任何角度查看模型，而不必担心某些面因为不渲染而遗漏设计细节
             透明度,环境映射,渲染 也是这样
    比如在这：双面展示
*/
basicMaterial.side = THREE.DoubleSide;

const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
scene.add(cube)

// 设置几何体的属性 uv2 是为了提供第二组纹理坐标，这些坐标可以用于多种效果，如光照贴图（light maps）、遮挡贴图（ao maps）或者细节贴图（detail maps）
cubeGeometry.setAttribute(
    // uv2 是一个特殊的属性，用于存储第二组纹理坐标
    "uv2",
    // cubeGeometry.attributes.uv.array：这是从几何体的 uv 属性中获取的纹理坐标数组。uv 属性包含了用于标准纹理映射的坐标
    // 2：这个数字指定了每个顶点对应坐标的分量数量
    new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
)

// 添加平面 平面缓冲几何体
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const plane = new THREE.Mesh(planeGeometry, basicMaterial)
plane.position.set(3, 0, 0)

scene.add(plane)

// 将平面几何体原有的 uv 属性中的纹理坐标复制一份，并设置为新的 uv2 属性
planeGeometry.setAttribute( 
    "uv2",
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})

document.body.appendChild(renderer.domElement)