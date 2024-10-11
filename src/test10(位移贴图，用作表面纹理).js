import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, // aspect
  0.1,  // near
  1000,   // far
)

camera.position.set(0, 0, 10) // camera.position.z = 10;
// 不需要这样做，因为摄像机不是场景的一部分，它只是定义了视角
// scene.add(camera);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")

//导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");

/*
 添加物体
 width, height, depth, 
 widthSegments: 立方体宽度方向上的分段数,宽度方向上的面数
 heightSegments: 立方体高度方向上的分段数,高度方向上的面数
 depthSegments: 立方体深度方向上的分段数,深度方向上的面数
*/
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)
// 材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  // map: 材质的纹理贴图，材质的颜色贴图
  map: doorColorTexture,
  // 也称透明贴图，用于控制材质的透明度， 原本 alpha.jpg 中灰白色部分是实体， 黑色部分是透明
  // 设置了这个就要设置 transparent: true
  alphaMap: doorAlphaTexture,
  // true: 材质变为半透明，渲染顺序时根据物体和摄像机的距离排序
  transparent: true,
  // 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。
  // aoMap: doorAoTexture,

  // 位移贴图(Displacement Map),通过在材质上应用一张纹理贴图来改变顶点的位置，从而创造出更加详细和复杂的表面细节，而不需要增加额外的几何复杂度。位移贴图通常用于模拟物体表面的凹凸不平
  displacementMap: doorHeightTexture,
  displacementScale: 0.1, // 控制位移强度
  displacementBias: 0     // 控制位移偏移量
})

// 将材质的侧面属性设置为双面显示, 
/*
 *  双面显示: 当你的物体是一个封闭的形状，但是摄像机可能会从内部观察时，双面显示确保了无论摄像机位于物体的哪一侧，物体的面都是可见的
             设计模型时，双面显示可以帮助设计师从任何角度查看模型，而不必担心某些面因为不渲染而遗漏设计细节
             透明度,环境映射,渲染 也是这样
    比如在这：双面展示
*/
material.side = THREE.DoubleSide;

const cube = new THREE.Mesh(cubeGeometry, material)
scene.add(cube);

// 复制默认的uv坐标到uv2，以便可以使用第二组纹理坐标
cubeGeometry.setAttribute(
  // 为cubeGeometry设置一个名为"uv2"的属性
  "uv2",
  // new THREE.BufferAttribute: 创建了一个新的BufferAttribute实例
  // ubeGeometry.attributes.uv.array: 这是原始uv属性的坐标数据数组
  // 2: 这表示每个顶点对应的坐标数据由两个元素组成（通常是二维坐标，例如(u, v)）
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
)

// 添加平面
// width, height, widthSegments, heightSegments
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(1.5, 1, 0);
// scene 添加 平面
scene.add(plane);

planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
)


// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight);


// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)


const render = () => {
  controls.update();
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
render();

window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
})

document.body.appendChild(renderer.domElement);