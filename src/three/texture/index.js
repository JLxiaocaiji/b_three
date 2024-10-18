import * as THREE from "three"

// 创建 loader 以加载一个由6张图片所组成的立体纹理对象
const cubeTextureLoader = new THREE.CubeTextureLoader()
// 使用cubeTextureLoader的setPath方法设置加载立方体贴图的路径，并使用load方法加载六个图像文件，这些文件分别代表立方体的正面、背面、顶面、底面、前面和后面。加载完成后，将生成的立方体贴图存储在envMap常量中
export const envMap = cubeTextureLoader.setPath(import.meta.env.BASE_URL+'textures/environmentMaps/0').load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
])

// envMap的环境映射的类型为THREE.CubeRefractionMapping。这意味着环境映射将使用立方体贴图，并且将模拟折射效果。折射映射通常用于创建像玻璃或水这样的透明材质，其中光线穿过物体时会发生折射
envMap.mapping = THREE.CubeRefractionMapping
// TextureLoader: 加载纹理图片
const textureLoader = new THREE.TextureLoader()

export let skyTextureEquirec = textureLoader.load(import.meta.env.BASE_URL+'texture/envmap/room.png');
// 加载的纹理的映射类型设置为THREE.EquirectangularReflectionMapping。这意味着纹理将使用等距圆柱投影映射，通常用于全景图片作为环境映射，以创建反射效果
skyTextureEquirec.mapping = THREE.EquirectangularReflectionMapping;
// 纹理的颜色空间为sRGB。THREE.SRGBColorSpace表示纹理的颜色值是在sRGB颜色空间中，这通常用于确保在不同设备上颜色显示的一致性
skyTextureEquirec.colorSpace = THREE.SRGBColorSpace;

export const disposeTexture = () => {
    envMap.dispose()
    skyTextureEquirec.dispose()
}