import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const createControl = (camera, canvas) => {
    const control = new OrbitControls(camera, canvas)

    // 设置最大极角，即相机向上看的最大角度，这里设置为大约135度
    control.maxPolarAngle = Math.PI * 0.46
    // 设置最小极角，即相机向下看的最大角度，这里设置为 0.1 度
    control.minPolarAngle = 0.1
    // 设置相机距离目标的最小距离
    control.minDistance = 4
    // 相机距离目标的最大距离
    control.maxDistance = 15
    // 禁用屏幕空间平移，这意味着平移操作将会在相机本身的平面上进行，而不是在屏幕空间中
    control.screenSpacePanning = false
    // 设置控件的目标位置，相机将会围绕这个点旋转
    control.target.set(0.2, 0, 0.3)
    // 启用阻尼（惯性），这将给相机操作带来平滑的运动效果
    control.enableDamping = true
    // 设置阻尼系数，数值越大，相机移动到新位置的速度越慢
    control.dampingFactor = 0.05

    return control
}