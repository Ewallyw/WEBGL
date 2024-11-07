// 添加事件监听器
function initEvents() {
    const canvas = document.getElementById('glCanvas');
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
}

// 初始化程序
function init() {
    // 初始化WebGL
    initWebGL();
    
    // 初始化事件监听
    initEvents();
    
    // 重置位置
    resetPosition();
    
    // 设置默认控制模式
    toggleControl('whole');
}

// 启动应用
window.onload = init;