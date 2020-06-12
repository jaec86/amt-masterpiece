import * as THREE from 'three'
import glslify from 'glslify'
import { gsap, Quad } from 'gsap'
import ParticleVert from './shaders/particle.vert'
import ParticleFrag from './shaders/particle.frag'

export default class Particles {
  constructor (webgl) {
    this.webgl = webgl
    this.container = new THREE.Object3D()
  }

  init (sample) {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(sample.poster, texture => {
      this.texture = texture
      this.texture.minFilter = THREE.LinearFilter
      this.texture.magFilter = THREE.LinearFilter
      this.texture.format = THREE.RGBFormat

      this.width = texture.image.width
      this.height = texture.image.height

      this.initAudio(sample.theme)
      this.initPoints()
      this.resize()
      this.show()
    })
  }

  initAudio (theme) {
    const listener = new THREE.AudioListener()
    this.audio = new THREE.Audio(listener)

    const loader = new THREE.AudioLoader()
    loader.load(theme, buffer => {
      this.audio.setBuffer(buffer)
      this.audio.setLoop(true)
      this.audio.setVolume(0.5)
      // this.audio.play()
    })

    // this.analyser = new THREE.AudioAnalyser(this.audio, 2048)
  }

  initPoints () {
    const pointCount = this.width * this.height

    const img = this.texture.image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = this.width
    canvas.height = this.height
    ctx.scale(1, -1)
    ctx.drawImage(img, 0, 0, this.width, this.height * -1)

    const imgData = ctx.getImageData(0,0, canvas.width, canvas.height)
    const originalColors = Float32Array.from(imgData.data)

    let pointsVisible = 0
    const threshold = 34

    for (let i = 0; i < pointCount; i++) {
      if (originalColors[i * 4] > threshold) {
        pointsVisible++
      }
    }

    const uniforms = {
      uTime: { value: 0 },
      uRandom: { value: 0.1 },
      uDepth: { value: 2.0 },
      uSize: { value: 0.0 },
      uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
      uTexture: { value: this.texture },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
    }

    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: glslify(ParticleVert),
      fragmentShader: glslify(ParticleFrag),
      depthTest: false,
      transparent: true
    })

    const geometry = new THREE.InstancedBufferGeometry()

    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3)
    positions.setXYZ(0, -0.5, 0.5, 0.0)
    positions.setXYZ(1, 0.5, 0.5, 0.0)
    positions.setXYZ(2, -0.5, -0.5, 0.0)
    positions.setXYZ(3, 0.5, -0.5, 0.0)
    geometry.setAttribute('position', positions)

    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2)
    uvs.setXYZ(0, 0.0, 0.0)
    uvs.setXYZ(1, 1.0, 0.0)
    uvs.setXYZ(2, 0.0, 1.0)
    uvs.setXYZ(3, 1.0, 1.0)
    geometry.setAttribute('uv', uvs)

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1))

    const indices = new Uint16Array(pointsVisible)
    const offsets = new Float32Array(pointsVisible * 3)

    for (let i = 0, j = 0; i < pointCount; i++) {
      if (originalColors[i * 4] <= threshold) {
        continue
      }

      offsets[j * 3] = i % this.width
      offsets[j * 3 + 1] = Math.floor(i / this.width)

      indices[j] = i

      j++
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false))
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false))

    this.object3D = new THREE.Mesh(geometry, material)
    this.container.add(this.object3D)
  }

  resize () {
    if (!this.object3D) {
      return
    }

    const scale = this.webgl.fovHeight / this.height
    this.object3D.scale.set(scale, scale, 1)
  }

  update (delta) {
    if (this.object3D) {
      this.object3D.material.uniforms.uTime.value += delta
      this.object3D.material.uniforms.uBass.value = this.getFrequencyRangeValue([20, 140])
      this.object3D.material.uniforms.uMid.value = this.getFrequencyRangeValue([400, 2600])
      this.object3D.material.uniforms.uTreble.value = this.getFrequencyRangeValue([5200, 14000])
    }
  }

  show (time = 1.0) {
    gsap.fromTo(this.object3D.material.uniforms.uSize, time, { value: 0.5 }, { value: 1.5 })
    gsap.to(this.object3D.material.uniforms.uRandom, time, { value: 2.0 })
    gsap.fromTo(this.object3D.material.uniforms.uDepth, time * 1.5, { value: 40.0 }, { value: 4.0 })
  }

  hide (time = 0.8) {
    return new Promise((resolve) => {
      if (!this.object3D) return
      gsap.to(this.object3D.material.uniforms.uSize, time * 0.8, { value: 0.0 })
      gsap.to(this.object3D.material.uniforms.uDepth, time, { value: -400.0, ease: Quad.easeIn })
      gsap.to(this.object3D.material.uniforms.uRandom, time, { value: 2.0, onComplete: () => {
        this.destroy()
        resolve()
      } })
    })
  }

  destroy () {
    if (this.object3D) {
      this.object3D.parent.remove(this.object3D)
      this.object3D.geometry.dispose()
      this.object3D.material.dispose()
      this.object3D = null
    }

    if (this.audio) {
      this.audio.disconnect()
      this.analyser = null
      this.audio = null
    }
  }

  getFrequencyRangeValue (frequency) {
    if (this.analyser) {
      const data = this.analyser.getFrequencyData()
      const lowIndex = Math.round(frequency[0] / 24000 * data.length)
      const highIndex = Math.round(frequency[1] / 24000 * data.length)

      let total = 0
      let frequencyCount = 0

      for (let i = lowIndex; i <= highIndex; i++) {
          total += data[i];
          frequencyCount++
      }

      return total / frequencyCount / 255
    }

    return 0
  }
}