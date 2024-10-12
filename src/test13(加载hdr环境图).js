import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";


// RGBELoader 是一个用于加载HDR（高动态范围）图像的加载器，这些图像通常用于创建更为逼真的光照和反射效果
const rgbeLoader = new RGBELoader();
// loadAsync方法用于异步加载HDR图像，并返回一个Promise对象。一旦加载完成，它将解析为一个纹理（Texture）对象
rgbeLoader.loadAsync("textures/hdr/002.hdr").then((texture) => {
  // 设置纹理的映射类型为THREE.EquirectangularReflectionMapping，这是一种用于环境映射的特殊纹理映射方式，适用于全景HDR图像
  // 映射适用于HDR环境贴图，它们通常是equirectangular格式的，即经纬度映射，可以环绕整个场景
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // 将加载的HDR纹理设置为场景的背景。这意味着整个场景的背景将被这个HDR图像覆盖
  scene.background = texture;
  // 将HDR纹理同时设置为场景的环境纹理。环境纹理会影响场景中所有物体的反射和折射效果，特别是对于使用了MeshStandardMaterial或MeshPhysicalMaterial的材料
  scene.environment = texture;
})

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight,   // aspect
  0.1, // near
  1000,   // far
)
camera.position.set(0, 0, 10)

// 设置cube纹理加载器
// 加载CubeTexture的一个类。 内部使用ImageLoader来加载文件
const cubeTextureLoader = new THREE.CubeTextureLoader();
// 必须要有 x,y,z 3个方向 p,n 2种图片
// const envMapTexture = cubeTextureLoader.load([
//   "textures/environmentMaps/1/px.jpg",
//   "textures/environmentMaps/1/nx.jpg",
//   "textures/environmentMaps/1/py.jpg",
//   "textures/environmentMaps/1/ny.jpg",
//   "textures/environmentMaps/1/pz.jpg",
//   "textures/environmentMaps/1/nz.jpg",
// ])

// 第二种加载方式
const envMapTexture = cubeTextureLoader.setPath("textures/environmentMaps/").load([
  "1/px.jpg",
  "1/nx.jpg",
  "1/py.jpg",
  "1/ny.jpg",
  "1/pz.jpg",
  "1/nz.jpg",
])


// 几何体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

// 材质
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap属性被设置为之前加载的立方体贴图，这样材质就能反射出加载的环境映射
  envMap: envMapTexture,
})

// 场景的背景为环境映射纹理，使得渲染的场景背景与物体反射的环境相匹配
scene.background = envMapTexture;
// 该纹理贴图将会被设为场景中所有物理材质的环境贴图, 场景的全局环境，这会影响场景中所有具有环境映射属性的材质
scene.environment = envMapTexture;

const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// 灯光, 没有灯光会显示不出来
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enabledDamping = true;


const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const render = () => {
  controls.update()
  // 必须这个顺序
  renderer.render(scene, camera)
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render)
}
render()

document.body.appendChild(renderer.domElement);


// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});