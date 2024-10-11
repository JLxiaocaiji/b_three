import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { roughness } from "three/examples/jsm/nodes/Nodes.js";

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75, // fov, field of view
  window.innerWidth / window.innerHeight,
  0.1, // near
  1000, // far
)

// 设置相机位置
camera.position.set(0, 0, 10);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")

// 导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("./textures/door/normal.jpg");

// 立方几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);


// 材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  // 颜色贴图。可以选择包括一个alpha通道，通常与.transparent 或.alphaTest。默认为null。 纹理贴图颜色由漫反射颜色.color调节
  map: doorColorTexture,
  // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null
  alphaMap: doorAlphaTexture,
  transparent: true,

  // 环境遮蔽贴图: 描述了在几何体的不同区域中，光线能够到达的难易程度
  aoMap: doorAoTexture,
  // 环境遮挡效果的强度。默认值为1。零是不遮挡效果。
  aoMapIntensity: 1,

  // 位移贴图(Displacement Map),通过在材质上应用一张纹理贴图来改变顶点的位置，从而创造出更加详细和复杂的表面细节，而不需要增加额外的几何复杂度。位移贴图通常用于模拟物体表面的凹凸不平
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  // 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘
  roughness: 1,
  // 该纹理的绿色通道用于改变材质的粗糙度, 与上面的 roughness 相乘
  roughnessMap: roughnessTexture,
  // 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘
  metalness: 1,
  // 与上面的 metalness 相乘
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
})

material.side = THREE.DoubleSide;
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);

cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
)

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enabledDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

const render = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()

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

document.body.appendChild(renderer.domElement);