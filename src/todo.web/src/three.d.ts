declare module "three" {
  type IUniform<T = unknown> = { value: T; shared?: boolean; mixed?: boolean; linked?: boolean }
  interface MeshPhysicalMaterialParameters { fog?: boolean }
  interface ShaderLibShader { vertexShader: string; fragmentShader: string; uniforms: Record<string, IUniform>; defines?: Record<string, string | number | boolean> }
  interface Material { color?: Color; roughness?: number; metalness?: number; envMap?: Texture; envMapIntensity?: number }
  interface MaterialParameters { fog?: boolean }
  type ShaderMaterial = any
  type Color = any
  type Texture = any
  type Mesh<T = BufferGeometry, U = ShaderMaterial> = any
  type BufferGeometry = any
  type DirectionalLight = any
  type Camera = any
  type MeshStandardMaterial = any
  type MeshPhysicalMaterial = any
  namespace UniformsUtils { function clone(u: Record<string, IUniform>): Record<string, IUniform> }
  namespace ShaderLib { const physical: ShaderLibShader }
  function BufferAttribute(array: ArrayLike<number>, itemSize: number): BufferAttribute
  interface BufferAttribute { }
}

declare module "three/src/math/MathUtils.js" {
  export function degToRad(degrees: number): number
}
