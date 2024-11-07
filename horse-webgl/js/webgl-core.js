let gl;
let program;
let partBuffers = {};

// WebGL初始化函数
function initWebGL() {
    const canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        alert('无法初始化WebGL，您的浏览器可能不支持它。');
        return;
    }

    // 设置画布尺寸
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // 创建和编译着色器程序
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    program = createProgram(vertexShader, fragmentShader);
    gl.useProgram(program);

    // 设置背景色为白色
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 创建缓冲区
    createBuffers();

    // 开始渲染循环
    render();
}

// 创建着色器
function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('着色器编译错误:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// 创建着色器程序
function createProgram(vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('程序链接错误:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// 创建缓冲区
function createBuffers() {
    const headVertices = vertexData.createCircleVertices(0, 0, 0.15, 20);
    partBuffers = {
        head: createBuffer(headVertices),
        neck: createBuffer(vertexData.neckVertices),
        body: createBuffer(vertexData.bodyVertices),
        legs: createBuffer(vertexData.legVertices),
        tail: createBuffer(vertexData.tailVertices)
    };
}

// 创建缓冲区辅助函数
function createBuffer(vertices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    return buffer;
}

// 渲染函数
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 更新模型矩阵
    const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

    // 绘制各个部分
    drawPart('body', horse.body);
    drawPart('neck', horse.neck);
    drawPart('head', horse.head);
    drawPart('legs', horse.legs.frontLeft);
    drawPart('tail', horse.tail);

    requestAnimationFrame(render);
}

// 绘制部件函数
function drawPart(partName, part) {
    const buffer = partBuffers[partName];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    const aColor = gl.getAttribLocation(program, 'aColor');
    gl.vertexAttrib4fv(aColor, part.color);

    const uTranslation = gl.getUniformLocation(program, 'uTranslation');
    gl.uniform2f(uTranslation, part.x, part.y);

    switch(partName) {
        case 'head':
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 20);
            break;
        case 'neck':
        case 'body':
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            break;
        case 'legs':
            gl.drawArrays(gl.TRIANGLES, 0, 16);
            break;
        case 'tail':
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            break;
    }
}