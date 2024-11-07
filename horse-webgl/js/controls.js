// 鼠标事件处理
function handleMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(event.clientY - rect.top) / rect.height * 2 + 1;

    if (isPointInPart(x, y)) {
        isDragging = true;
        dragOffset.x = x - horse[selectedPart].x;
        dragOffset.y = y - horse[selectedPart].y;
    }
}

function handleMouseMove(event) {
    if (!isDragging) return;

    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(event.clientY - rect.top) / rect.height * 2 + 1;

    if (currentControl === 'whole') {
        const dx = x - (horse[selectedPart].x + dragOffset.x);
        const dy = y - (horse[selectedPart].y + dragOffset.y);
        moveWholeHorse(dx, dy);
    } else {
        horse[selectedPart].x = x - dragOffset.x;
        horse[selectedPart].y = y - dragOffset.y;
    }
}

function handleMouseUp() {
    isDragging = false;
    selectedPart = null;
}

// 键盘事件处理
function handleKeyDown(event) {
    const step = 0.05;
    let dx = 0, dy = 0;

    switch(event.key) {
        case 'ArrowRight': dx = step; break;
        case 'ArrowLeft': dx = -step; break;
        case 'ArrowUp': dy = step; break;
        case 'ArrowDown': dy = -step; break;
        case ' ': 
            jump();
            return;
    }

    if (currentControl === 'whole') {
        moveWholeHorse(dx, dy);
    } else if (selectedPart) {
        horse[selectedPart].x += dx;
        horse[selectedPart].y += dy;
    }
}

// 移动整体
function moveWholeHorse(dx, dy) {
    Object.keys(horse).forEach(part => {
        if (typeof horse[part] === 'object') {
            if (part === 'legs') {
                Object.values(horse[part]).forEach(leg => {
                    leg.x += dx;
                    leg.y += dy;
                });
            } else {
                horse[part].x += dx;
                horse[part].y += dy;
            }
        }
    });
}

// 跳跃动画
function jump() {
    const jumpHeight = 0.3;
    const jumpDuration = 500;
    const startTime = Date.now();
    const startY = {};

    Object.keys(horse).forEach(part => {
        if (typeof horse[part] === 'object') {
            if (part === 'legs') {
                Object.keys(horse[part]).forEach(leg => {
                    startY[`${part}_${leg}`] = horse[part][leg].y;
                });
            } else {
                startY[part] = horse[part].y;
            }
        }
    });

    function jumpAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / jumpDuration;

        if (progress < 1) {
            const height = jumpHeight * Math.sin(progress * Math.PI);
            
            Object.keys(startY).forEach(key => {
                if (key.startsWith('legs_')) {
                    const [_, leg] = key.split('_');
                    horse.legs[leg].y = startY[key] + height;
                } else {
                    horse[key].y = startY[key] + height;
                }
            });
            requestAnimationFrame(jumpAnimation);
        } else {
            Object.keys(startY).forEach(key => {
                if (key.startsWith('legs_')) {
                    const [_, leg] = key.split('_');
                    horse.legs[leg].y = startY[key];
                } else {
                    horse[key].y = startY[key];
                }
            });
        }
    }

    requestAnimationFrame(jumpAnimation);
}

// 碰撞检测函数
function isPointInPart(x, y) {
    if (isPointInCircle(x, y, horse.head.x, horse.head.y, 0.15)) {
        selectedPart = 'head';
        return true;
    }
    if (isPointInRect(x, y, horse.neck, 0.2, 0.15)) {
        selectedPart = 'neck';
        return true;
    }
    if (isPointInRect(x, y, horse.body, 1.0, 0.4)) {
        selectedPart = 'body';
        return true;
    }
    for (const leg in horse.legs) {
        if (isPointInRect(x, y, horse.legs[leg], 0.1, 0.4)) {
            selectedPart = `legs_${leg}`;
            return true;
        }
    }
    if (isPointInTriangle(x, y, horse.tail)) {
        selectedPart = 'tail';
        return true;
    }
    return false;
}

// 几何形状碰撞检测
function isPointInCircle(x, y, cx, cy, radius) {
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
}

function isPointInRect(x, y, part, width, height) {
    return x >= part.x - width/2 && 
           x <= part.x + width/2 && 
           y >= part.y - height/2 && 
           y <= part.y + height/2;
}

function isPointInTriangle(x, y, tail) {
    const tx = tail.x;
    const ty = tail.y;
    return x >= tx - 0.1 && 
           x <= tx + 0.2 && 
           y >= ty - 0.15 && 
           y <= ty + 0.15;
}

// 菜单控制功能
function toggleControl(part) {
    currentControl = part;
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="toggleControl('${part}')"]`).classList.add('active');
    document.getElementById('status').textContent = `当前控制: ${getPartName(part)}`;
}

function getPartName(part) {
    const names = {
        'whole': '整体',
        'head': '头部',
        'neck': '脖子',
        'body': '身体',
        'legs': '腿部',
        'tail': '尾巴'
    };
    return names[part] || part;
}

// 重置位置
function resetPosition() {
    horse.head = { x: 0, y: 0.5, color: [0.8, 0.6, 0.4, 1.0] };
    horse.neck = { x: 0, y: 0.3, color: [0.7, 0.5, 0.3, 1.0] };
    horse.body = { x: 0, y: 0, color: [0.9, 0.7, 0.5, 1.0] };
    horse.legs = {
        frontLeft: { x: -0.15, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        frontRight: { x: 0.15, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        backLeft: { x: -0.45, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] },
        backRight: { x: 0.45, y: -0.3, color: [0.6, 0.4, 0.2, 1.0] }
    };
    horse.tail = { x: 0.6, y: 0.1, color: [0.5, 0.3, 0.1, 1.0] };
}