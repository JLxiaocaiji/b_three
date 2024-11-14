import * as THREE from "three"
import { gui } from '../system/gui';

export const createDynamicEnv = (scene) => {

    // 创建一个新的组（Group），用于组织和管理多个对象
    const group = new THREE.Group()
    // 为组设置一个名称，方便后续引用
    group.name = "dynamicEnv"
    // 将组存储在场景的userData中，这样可以在其他地方通过这个键来访问组
    scene.userData.dynamicEnv = group
    // 将组添加到场景中
    scene.add(group)

    // 创建一个新的矩形平面网格（Mesh），使用平面几何体（PlaneGeometry）和基础材质（MeshBasicMaterial）
    // 创建一个宽度为2，高度为5的平面
    const rect = new THREE.Mesh(new THREE.PlaneGeometry(2, 5), new THREE.MeshBasicMaterial({
        color: "#fff",
        // 双面可见
        side: THREE.DoubleSide
    }))

    rect.position.set(3, 2, 0)
    rect.rotation.set(-Math.PI * 0.5, Math.PI * 0.1, 0)
    // 为矩形平面设置一个名称
    rect.name = "rect"
    // 在矩形的userData中添加一个更新函数，该函数可以在渲染循环中被调用以更新矩形的位置
    rect.userData.update = 
        // deltaTime：这是指从上一帧到当前帧经过的时间，通常用于保证动画的平滑性和一致性，不受帧率变化的影响
        // elapsedTime：这是指从动画开始到现在经过的总时间。在这个函数中，elapsedTime 被用来计算正弦波动的相位，从而产生连续的动画效果
        (deltaTime, elapsedTime) => {
            // 使用正弦函数更新矩形的位置，使其在垂直方向上波动;Math.sin(elapsedTime * 0.5) 产生一个周期性的值，乘以 0.5 可以调整波动频率
            // Math.abs 确保波动始终向上，加上 1 则是设置了一个最小高度，防止矩形下沉到地面以下
            rect.position.y = Math.abs(Math.sin(elapsedTime * 0.5)) + 1
            // 使用正弦函数更新矩形的深度位置，使其在深度方向上波动
            rect.position.z = 0.5 * Math.sin(elapsedTime * 0.5)
        }
    
    // 创建一个 5 * 5 的平面    
    const rect2 = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({
        color: "#5c67ff",
        side: THREE.DoubleSide,
    }))
    rect2.rotation.set(-Math.PI * 0.2, -Math.PI * 0.3, -Math.PI * 0.2)
    rect2.position.set(-3.5, 0, 0)

    // radiusL 5, widthSegment: 32, heightSegment: 32
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({
        color: '#5a509f',
        // 背面渲染，可能是因为球体内部被用作环境的一部分，例如作为天空球
        side: THREE.BackSide,
    }))

    // 立方体，width, height, depth,
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: '#66edff',
    }))
    cube.userData.update = (deltaTime, elapsedTime) => {
        // 方体在X轴上的位置随时间变化，通过正弦函数实现周期性移动，范围在[-2, 0]之间
        cube.position.x = 1 * Math.sin(elapsedTime) - 1
        // 立方体在Y轴上的位置也随时间变化，通过正弦函数实现周期性移动，范围在[0, 2.5]之间
        cube.position.y = Math.sin(elapsedTime) + 1.5
        // 立方体在Z轴上的位置随时间变化，通过余弦函数实现周期性移动，范围在[-2, 0]之间
        cube.position.z = Math.cos(elapsedTime) - 1
    }

    // ring: 戒指
    const ring = new THREE.Mesh(
        // 圆柱缓冲几何体 radiusTop(圆柱的顶部半径), radiusBottom(圆柱的底部半径), height, radialSegments(圆柱侧面周围的分段数), heightSegments(圆柱侧面沿着其高度的分段数), openEnded(圆锥底部是开放的还是封顶)
        new THREE.CylinderGeometry(2, 2, 0.5, 16, 1, true), 
        new THREE.MeshBasicMaterial({
            color: '#fafeff',
            side: THREE.DoubleSide,
        })
    )
    // // 设置ring对象的旋转，使其绕X轴旋转90度（π/2弧度），Y轴和Z轴不旋转
    ring.rotation.set(Math.PI * 0.5, 0, 0)
    ring.userData.update = 
        // deltaTime：帧时间差，这是指从上一帧到当前帧经过的时间，通常用于保证动画的平滑性和一致性，不受帧率变化的影响
        // elapsedTime：这是指从动画开始到现在经过的总时间。
        (deltaTime, elapsedTime) => {
            // 每帧根据deltaTime（通常是帧时间间隔）增加ring对象的z轴位置
            ring.position.z += 2 * deltaTime
            // 如果ring对象的z轴位置大于4，将其重置为-5
            if ( ring.position.z > 4) {
                ring.position.z = -5
            }
        }

    group.add(rect, rect2, sphere, cube, ring)
    // 遍历group对象的所有子对象，将每个子对象设置到场景的特定层（在这里是scene.userData.rtCubeCameraLayer）
    group.children.forEach( item => {
        item.layers.set(scene.userData.rtCubeCameraLayer)   // 设定层数为 1
    })

    gui.addColor(rect.material, "color").name("rectColor")
    gui.addColor(rect2.material, "color").name("rect2Color")
    gui.addColor(sphere.material, "color").name("sphereColor")
    gui.addColor(cube.material, "color").name("cubeColor")
}

/**
let lastTime = performance.now();
let startTime = lastTime;

function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    const elapsedTime = currentTime - startTime;

    // 更新场景中的矩形位置
    if (rect.userData.update) {
        rect.userData.update(deltaTime, elapsedTime);
    }

    renderer.render(scene, camera);

    lastTime = currentTime;
}
animate();
 */