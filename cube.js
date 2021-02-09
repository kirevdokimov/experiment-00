import * as twgl from "./twgl-full.module.js"

let vs = `
attribute vec4 position;
uniform mat4 projViewMatrix;
uniform mat4 modelMatrix;

varying highp vec4 pos;

void main(){
    gl_Position = projViewMatrix * modelMatrix * position;
    pos = modelMatrix * position;
}
`

let fs = `

varying highp vec4 pos;

void main(){
    gl_FragColor = vec4(pos.xyz,1);
}
`


export class Cube {
    constructor(gl) {
        this.gl = gl;
        this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs])
        this.modelMatrix = twgl.m4.identity();
    }

    draw(time, deltaTime, projViewMatrix) {
        const programInfo = this.programInfo;
        this.gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, programInfo, this.bufferInfo)
        twgl.setUniforms(programInfo, { projViewMatrix: projViewMatrix, modelMatrix: this.modelMatrix })
        twgl.drawBufferInfo(this.gl, this.bufferInfo)
    }
}

