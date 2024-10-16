import * as THREE from "three";

/**
 *  1.初始化渲染器
*/ 
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    // 抗齿锯，更光滑
    antialias: true,
})

// 设置渲染大小, 注意顺序
renderer.setSize(window.innerWidth, window.innerHeight);



/**
 * 2.初始化相机
 */
// 视野范围 field of view
const fov = 75;
// 宽高比
const aspect = 2;
// 近平面
const near = 0.01;
// 远平面
const far = 1000;
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
    fov, aspect, near, far
)
camera.position.z = 2;

/**
 * 3.场景
 */
// 创建场景
const scene = new THREE.Scene();


/**
 * 4.初始化 Mesh
 */
 // 创建立方几何体
 const boxWidth = 1;
 const boxHeight = 1;
 const boxDepth = 1;
 const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth);

// 创建基本材质 并 设置颜色
// const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
// 改为 冯氏 材质
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })

// 创建网格对象 (立方体，材质)
const cube = new THREE.Mesh(geometry, material)


// 网格对象添加到场景中
scene.add(cube);


/**
 * 5.其他配置，灯光
 */
// 设置灯光以展示 目标
const shine = () => {
    // 光照颜色
    const color = 0xFFFFFF;
    // 光照强度
    const intensity = 3;
    // 创建一个方向光
    const light = new THREE.DirectionalLight(color, intensity);
    // 方向光的位置
    light.position.set(-1, 2, 4);
    scene.add(light);
}
// 光源发亮 配合 冯氏材质
shine();


/**
 * 6.添加到画布上
 */
document.body.appendChild(renderer.domElement)


/**
 * 7.渲染
 * @param {*} time time 是一个递增的值，表示自页面加载以来经过的时间
 */
// 目标动态循环函数
const render = (time) => {
    // time 从毫秒转换为秒
    time *= 0.001;

    // 将 cube 对象的绕 X/Y 轴旋转角度设置为与时间成正比
    cube.rotation.x = cube.rotation.y = time;

    // 渲染 （场景，相机）
    renderer.render(scene, camera)

    // window.requestAnimationFrame, 对回调函数的调用频率通常与显示器的刷新率相匹配 
    requestAnimationFrame(render)
}

requestAnimationFrame(render);
