// 全局状态变量
let currentControl = 'whole';
let isDragging = false;
let selectedPart = null;
let dragOffset = { x: 0, y: 0 };
let modelMatrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);

// 马的数据结构
const horse = {
    head: { x: 0, y: 0.5, color: [0.8, 0.6, 0.4, 1.0] },
    neck: { x: 0, y: 0.3, color: [0.7, 0.5, 0.3, 1.0] },
    body: { x: 0, y: 0, color: [0.9, 0.7, 0.5, 1.0] },
    legs: {
        frontLeft: { x: -0.15, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        frontRight: { x: 0.15, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        backLeft: { x: -0.45, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        backRight: { x: 0.45, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] }
    },
    tail: { x: 0.6, y: 0.1, color: [0.5, 0.3, 0.1, 1.0] }
};

// 顶点数据
const vertexData = {
    createCircleVertices: function(centerX, centerY, radius, segments) {
        const vertices = [];
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            vertices.push(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
        }
        return new Float32Array(vertices);
    },

    neckVertices: new Float32Array([
        -0.1, 0.35, 0.1, 0.35, 0.05, 0.2, -0.15, 0.2
    ]),

    bodyVertices: new Float32Array([
        -0.5, 0.2, 0.5, 0.2, 0.5, -0.2, -0.5, -0.2
    ]),

    legVertices: new Float32Array([
        // 前左腿
        -0.35, -0.2, -0.25, -0.2, -0.25, -0.6, -0.35, -0.6,
        // 前右腿
        0.25, -0.2, 0.35, -0.2, 0.35, -0.6, 0.25, -0.6,
        // 后左腿
        -0.45, -0.2, -0.35, -0.2, -0.35, -0.6, -0.45, -0.6,
        // 后右腿
        0.35, -0.2, 0.45, -0.2, 0.45, -0.6, 0.35, -0.6
    ]),

    tailVertices: new Float32Array([
        0.5, 0.1, 0.7, 0.2, 0.6, -0.1
    ])
};