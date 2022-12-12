export default /*glsl*/ `
varying vec2 vUv;
uniform sampler2D uTextureMain;
uniform vec2 uQuadSize;
uniform vec2 uTextureSize;
uniform float uMouseX;
uniform float uTime;
uniform float uActiveLayers;
uniform float uPatron;
uniform float uOffsetX;
uniform float uNoiseX;
#define PI 3.1415926535897932384626433832795

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize){
  vec2 tempUV = uv - vec2(0.5 + uOffsetX, 0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;

  tempUV *= vec2( 0.2, 1.0);

  if(quadAspect < textureAspect){
    tempUV = tempUV * vec2( quadAspect / textureAspect, 1.0);
  }else{
    tempUV = tempUV * vec2( 1.0, textureAspect / quadAspect);
  }

  tempUV += vec2(0.5, 0.5);
  return tempUV;
}

void main()
{
    
    vec2 correctUV = getUV(vUv, uTextureSize, uQuadSize);
    correctUV = vec2(correctUV.x + (sin(correctUV.y) * 0.1 * uNoiseX), correctUV.y);

    vec4 colorTexture = texture2D( uTextureMain, correctUV);
    vec4 colorTextureBW = vec4( colorTexture.r, colorTexture.r, colorTexture.r,1.0);

    float strenght = vUv.x;
    strenght = smoothstep(uMouseX - 0.05, uMouseX + 0.05 , strenght);

    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    float radius = 0.25 + sin(angle * 100.0 + (uTime * 0.5) * 2.0 ) * 0.1 + ( 0.2 * sin(uTime * 0.1) ) * 1.0 ;
    float patron = 0.0 + smoothstep(0.01 + 0.3 * 0.6, 0.05 + 0.3 * 0.6, abs(distance(vUv, vec2(0.5)) - radius * 0.2));

    vec4 finalColor = mix(colorTexture, colorTextureBW, strenght);

    float patron2 = smoothstep(0.35, 0.55, distance(vUv, vec2(0.5)) + 0.25);

    float lastPatron = mix(patron2, patron, uPatron);

    float lastAlpha = mix(1.0, lastPatron, uActiveLayers);

    gl_FragColor = vec4( finalColor.rgb, lastAlpha);
}
`;
