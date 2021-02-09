import * as twgl from "./twgl-full.module.js"
import * as dat from "./dat.gui.module.js"
import { Plane } from "./plane.js";
import { Cube } from "./cube.js";

const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");

var gui = new dat.GUI({ name: 'gui' });

const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 100.0;
const projMatrix = twgl.m4.perspective(fieldOfView, aspect, zNear, zFar);


let plane = new Plane(gl, gui);
let drawCube = { value: true };
gui.add(drawCube, 'value')
let cube = new Cube(gl);

let drawScene = (time, deltaTime) => {
    gl.clearColor(0, 0, 0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let p = projMatrix;//twgl.m4.translate(cameraPerspective, twgl.v3.mulScalar(cameraPosition, -1))
    let v = twgl.m4.lookAt(cameraPosition, [0, 0, 0], [0, 1, 0]);
    // инверс для получение из lookat матрицы матрицу view (для камеры, которая инверсная).
    // cameraPosition тоже учитывается при инвертировании, поэтому дополнительно перемещать не надо.
    v = twgl.m4.inverse(v);
    // let minusCameraPos = twgl.v3.mulScalar(cameraPosition, -1)
    // p = twgl.m4.translate(p, minusCameraPos)
    let pv = twgl.m4.multiply(p, v);

    plane.draw(time, deltaTime, pv)
    if (drawCube.value) cube.draw(time, deltaTime, pv)

    if (mouse.down) {
        cameraPosition[0] -= mouse.dx / gl.canvas.width * 20;
        cameraPosition[1] += mouse.dy / gl.canvas.width * 20;
        folder.updateDisplay();
    }
}

let cameraPosition = twgl.v3.create(2.7, 3.8, 4.2)
let folder = gui.addFolder('cam position')
folder.open();
Object.keys(cameraPosition).forEach((key) => {
    folder.add(cameraPosition, key, -10, 10, 0.1)
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
    drawScene(time, deltaTime);
    mouse.dx = mouse.dy = 0;

    requestAnimationFrame(render);
}
requestAnimationFrame(render);