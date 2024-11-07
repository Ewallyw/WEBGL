// 顶点着色器
const vertexShaderSource = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uModelMatrix;
    uniform vec2 uTranslation;
    varying vec4 vColor;
    
    void main() {
        vec4 position = aPosition;
        position.xy += uTranslation;
        gl_Position = uModelMatrix * position;
        vColor = aColor;
    }
`;

// 片元着色器
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 vColor;
    
    void main() {
        gl_FragColor = vColor;
    }
`;