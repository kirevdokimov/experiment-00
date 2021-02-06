import * as twgl from "./twgl-full.module.js"

const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");

const positions = [
    1, 1, 1,
    1, 1, -1,
    1, -1, 1,
    1, -1, -1,
    -1, 1, 1,
    -1, 1, -1,
    - 1, -1, 1,
    -1, -1, -1,
];

const indices = [
    // +x side
    2, 0, 1,
    2, 1, 3,
    // -z side
    3, 1, 5,
    3, 5, 7,
    // -x side
    7, 5, 4,
    7, 4, 6,
    // +z side
    6, 4, 0,
    6, 0, 2,
    // +y side
    4, 5, 1,
    4, 1, 0,
    // -y side
    7, 6, 2,
    7, 2, 3,
];

const colors = [
    0, 0, 0, 1,
    1, 1, 1, 1,
    1, 1, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    0, 1, 1, 1,
    1, 0, 1, 1,
    1, 0, 0, 1,
]

var bufferArrays = {
    aVertexPosition: { numComponents: 3, data: positions },
    indices: { numComponents: 3, data: indices },
    aVertexColor: { numComponents: 4, data: colors },
}
// createBuffer & bindBuffer & bufferData
let buffersInfo = twgl.createBufferInfoFromArrays(gl, bufferArrays);

// gl.createShader & shaderSource & shaderCompile for both vs and fs
const programInfo = twgl.createProgramInfo(gl, [vert, frag]);

let getPrespectiveMatrix = (translation) => {
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.translate(projectionMatrix, projectionMatrix, translation);
    return projectionMatrix;
}

let getModelMatrix = (rotationAmount) => {
    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAmount, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAmount * .7, [0, 1, 0]);

    return modelViewMatrix;
}

console.log(programInfo);

let rotationAmount = 0;

let drawScene = (time, deltaTime) => {
    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uniforms = {
        uProjectionMatrix: getPrespectiveMatrix(translation),
        uModelViewMatrix: getModelMatrix(rotationAmount)
    }

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, buffersInfo)
    twgl.setUniforms(programInfo, uniforms)
    twgl.drawBufferInfo(gl, buffersInfo)
}

let updateScene = (time, deltaTime) => {

    rotationAmount += deltaTime;
    if (mouse.down) { 
        translation[0] += mouse.dx / gl.canvas.width * 10;
        translation[1] -= mouse.dy / gl.canvas.width * 10;
     }
}

let translation = [0, 0, -6]

window.addEventListener("keydown", (event) => {
    // event.preventDefault();
    switch (event.key) {
        case "ArrowDown":
            translation[2] -= 1;
            break;
        case "ArrowUp":
            translation[2] += 1;
            break;
    }
})

const clearMouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    down: false,
}

let mouse = Object.assign({}, clearMouse);

canvas.addEventListener("mousedown", (event) => {
    console.log("mousedown")
    mouse.down = true;
})

canvas.addEventListener("mouseup", (event) => {
    mouse.down = false;
})

canvas.addEventListener("mouseout", (event) => {
    mouse.down = false;
})

canvas.addEventListener("mousemove", (event) => {
    var rect = event.target.getBoundingClientRect();
    mouse.x = event.clientX - rect.left; //x position within the element.
    mouse.y = event.clientY - rect.top;  //y position within the element.
    mouse.dx = event.movementX;
    mouse.dy = event.movementY;
})

let then = 0;
function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let now = time * 0.001;
    const deltaTime = now - then;
    then = now;
    updateScene(time, deltaTime);
    drawScene(time, deltaTime);
    mouse.dx = mouse.dy = 0;

    requestAnimationFrame(render);
}
requestAnimationFrame(render);