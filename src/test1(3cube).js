import * as THREE from "three";

/**
 *  1.初始化渲染器
*/ 
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    // 抗齿锯
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
const aspect = window.innerWidth / window.innerHeight;
// 近平面
const near = 0.001;
// 远平面
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

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
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

const makeInstance = (geometry, color, x) => {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material)
    // 先添加到场景中
    scene.add(cube)

    // 再设置位置
    cube.position.x = x;
    return cube
}

const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
]

const shine = () => {
    // 光照颜色
    const color = 0xFFFFFF;
    // 光照强度
    const intensity = 3;
    // 创建一个方向光
    const light = new THREE.DirectionalLight(color, intensity);

    light.position.set(-1, 2, 4);
    scene.add(light);
}

shine();

document.body.append(renderer.domElement);

// 检查渲染器的canvas尺寸是不是和canvas的显示尺寸不一样
const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height
    if ( needResize) {
        // 第三个参数： 是否同时更新画布的样式
        renderer.setSize(width, height, false);
    }
    return needResize;
}

// time 是一个递增的值，表示自页面加载以来经过的时间
const render = (time) => {
    time *= 0.001

    // 若不一样就设置它
    if ( resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机的投影矩阵
        camera.updateProjectionMatrix();
    }



    cubes.forEach( (item, index) => {
        const speed = 1 + index * 0.1;
        const rot = time * speed

        item.rotation.x = item.rotation.y = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

render()

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    // 更新相机投影矩阵
    camera.updateProjectionMatrix();

    // 更新渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 更新渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio);
})