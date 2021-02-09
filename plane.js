import * as twgl from "./twgl-full.module.js"

let vs = `

#define hpi 1.5708
attribute vec4 position;
attribute vec2 texcoord;
uniform mat4 pMatrix;
uniform mat4 mMatrix;
uniform float lrp;
uniform float lrp2;

varying highp vec2 uv;
varying highp vec3 data;
#define peaksCount 10.0

void main(){

    vec4 normal = normalize(vec4(-position.x, 0.0, -position.z, 0.0));

    float down = step(0.0, position.z);
    float angleInRadians = (4.0 * hpi) * (1.0 - down) + (1.0 - 2.0 * down) * acos(position.x * 2.0);

    float dst = angleInRadians; // длина арки от правого края
    float mdst = cos((dst + position.y) * peaksCount * lrp) * (1.0 - position.y);
    vec4 pos = position + (normal * mix(0.0, 0.03, lrp2) * mdst);

    gl_Position = pMatrix * mMatrix * pos;
    uv = texcoord;

    data = vec3(position.y, 0.0, 0.0);
    // data = vec3(uv, 0);
    // data = normal.xyz;
}
`

let fs = `

varying highp vec2 uv;
varying highp vec3 data;

void main(){
    gl_FragColor = vec4(data, 1);
}
`


export class Plane {
    constructor(gl, datgui) {
        this.gl = gl;
        // twgl.m4.multiply(twgl.m4.translation([0,0,0]), m4, m4);
        this.bufferInfo = twgl.primitives.createCylinderBufferInfo(gl, .5, 1.5, 200, 100, false, false)
        // console.log(this.bufferInfo)
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs])
        this.modelMatrix = twgl.m4.rotationX(3.14 / 2.0);
        this.lerp = 1;
        this.lerp2 = 1;
        datgui.add(this, 'lerp', 0, 1, 0.001);
        datgui.add(this, 'lerp2', 0, 10, 0.001);
    }

    draw(time, deltaTime, perspectiveMatrix) {
        twgl.m4.rotateY(this.modelMatrix, deltaTime * 0.5, this.modelMatrix)
        // debugger;
        const programInfo = this.programInfo;
        this.gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, programInfo, this.bufferInfo)
        twgl.setUniforms(programInfo, { pMatrix: perspectiveMatrix, mMatrix: this.modelMatrix, lrp: this.lerp, lrp2: this.lerp2 })
        twgl.drawBufferInfo(this.gl, this.bufferInfo)
    }
}

