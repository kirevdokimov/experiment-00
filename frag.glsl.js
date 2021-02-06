let frag = `
varying lowp vec4 vColor;
varying lowp vec3 vLighting;

void main() {
    // gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    gl_FragColor = vColor;
}
`