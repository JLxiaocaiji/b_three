const isMobileDevice = () => {
    // Navigator 接口代表了用户代理的状态和身份，它允许脚本对其进行查询并注册自身以便执行某些活动
    // Navigator.userAgent: 返回当前浏览器的用户代理字符串
    // 例：“Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0”
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent) ||
        "ontouchstart" in document.documentElement
    ) {
        return true;
    } else {
        return false;
    }
}

export default isMobileDevice