import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "dat.gui";

const gui = new dat.GUI();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,   // field of view
  window.innerWidth / window.innerHeight, // aspect
  0.1,  // near
  1000, // far
)
camera.position.set(0, 0, 10)

// radius, widthSegment, heightSegment
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
})
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true;
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(50, 50)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane)

const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 1)  // 颜色为白色（0xffffff），强度为1
// 聚光灯的位置为坐标(5, 5, 5)
spotLight.position.set(5, 5, 5)
spotLight.castShadow = true
// 聚光灯强度
spotLight.intensity = 2
spotLight.shadow.radius = 20;
// 阴影贴图（shadow map）的大小为512x512
spotLight.shadow.mapSize.set(512, 512)
// 聚光灯的目标对象为sphere
spotLight.target = sphere;
// 聚光灯的光束角度为π/6弧度，大约是30度。这将定义聚光灯圆锥体的宽度
spotLight.angle = Math.PI / 6;
// 聚光灯的影响距离为0。这实际上是不合理的，因为距离为0意味着聚光灯不会照亮任何东西。通常，你应该设置一个正数，以定义聚光灯光束可以到达的最大距离
spotLight.distance = 0;
// 定义了聚光灯光束中心光强到边缘光强的衰减程度。这个值范围从0到1。当penumbra为0时，聚光灯的光束边缘与中心一样亮；当penumbra为1时，光束边缘几乎不亮，呈现一个非常明显的衰减效果
spotLight.penumbra = 0;
// 定义了光强度随距离增加而减弱的速度。这个值可以是THREE.NoDistance, THREE.LinearDistance, THREE.QuadraticDistance或者THREE.CubicDistance。设置为0（或者THREE.NoDistance）意味着光强度不会随着距离的增加而减弱
spotLight.decay = 0;
scene.add(spotLight)

// gui
gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01)
gui.add(spotLight, "distance").min(0).max(100).step(1)
gui.add(spotLight, "decay").min(0).max(5).step(0.01);


// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;


// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enabledDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const render = () => {
  camera.updateMatrix()
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

document.body.appendChild(renderer.domElement)