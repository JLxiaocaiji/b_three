import { ThreeApp } from "./three/ThreeApp";

// onload 和 onbeforeunload 都是 window 事件

// load 事件在整个页面及所有依赖资源如样式表和图片都已完成加载时触发
onload = () => {
    // document.getElementById("webgl") 为 container
    const threeApp = new ThreeApp(document.getElementById("webgl"));

    threeApp.render();
}

// 当浏览器窗口关闭或者刷新时，会触发 beforeunload 事件
onbeforeunload = () => {
    // 清理ThreeApp实例
    ThreeApp.getInstance().clear();
}
