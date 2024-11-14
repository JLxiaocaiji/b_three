const isMobileDevice = () => {
    // Navigator 接口代表了用户代理的状态和身份，它允许脚本对其进行查询并注册自身以便执行某些活动
    // Navigator.userAgent: 返回当前浏览器的用户代理字符串
    // 例：“Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0”
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent) ||
        // 检查document.documentElement（HTML文档的根元素）是否定义了ontouchstart属性。这个属性是触摸事件的功能检测，通常在移动设备上存在。如果它存在，这个条件也会返回true
        "ontouchstart" in document.documentElement
    ) {
        return true;
    } else {
        return false;
    }
}

export default isMobileDevice