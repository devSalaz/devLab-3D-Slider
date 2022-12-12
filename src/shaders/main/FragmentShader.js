export default /*glsl*/ `
varying vec2 vUv;
uniform sampler2D uTextureMain;
uniform vec2 uQuadSize;
uniform vec2 uTextureSize;
uniform float uMouseX;
uniform float uOffsetX;
uniform float uNoiseX;

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

  tempUV += vec2(0.5);
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

    vec4 finalColor = mix(colorTexture, colorTextureBW, strenght);

    gl_FragColor = vec4( finalColor.rgb, 1.0);
}
`;
