import * as THREE from 'three'
import Particles from './particles'

export default class WebGLView {
  constructor (app) {
    this.app = app

    this.samples = [
      { poster: 'posters/2001_space_odyssey.jpg', theme: 'themes/2001_space_odyssey.mp3' },
      { poster: 'posters/star_wars.jpg', theme: 'themes/star_wars.mp3' },
      { poster: 'posters/indiana_jones.jpg', theme: 'themes/indiana_jones.mp3' },
      { poster: 'posters/jurassic_park.jpg', theme: 'themes/jurassic_park.mp3' },
      { poster: 'posters/back_to_the_future.jpg', theme: 'themes/back_to_the_future.mp3'},
      { poster: 'posters/pulp_fiction.jpg', theme: 'themes/pulp_fiction.mp3' }
    ]

    this.initThree()
    this.initParticles()

    this.goto(0)
  }

  initThree () {
    this.scene = new THREE.Scene()
    this.scene.background = 0x000000

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 300

    this.renderer = new THREE.WebGLRenderer({ canvas: this.app.element, antialias: true, alpha: true })

    this.clock = new THREE.Clock(true)
  }

  initParticles () {
    this.particles = new Particles(this)
    this.scene.add(this.particles.container)
  }

  update () {
    const delta = this.clock.getDelta()

    if (this.particles) {
      this.particles.update(delta)
    }
  }

  draw () {
    this.renderer.render(this.scene, this.camera)
  }

  goto (index) {
    if (this.currSample == null) {
      this.particles.init(this.samples[index])
    } else {
      this.particles.hide().then(() => {
        this.particles.init(this.samples[index])
      })
    }

    this.currSample = index
  }

  next () {
    if (this.currSample < this.samples.length -1) {
      this.goto(this.currSample + 1)
    } else {
      this.goto(0)
    }
  }

  resize () {
    if (!this.renderer) {
      return
    }

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    if (this.particles) {
      this.particles.resize()
    }
  }

  destroy () {
    this.particles.destroy()
    this.scene.dispose()
  }
}