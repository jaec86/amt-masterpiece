import WebGLView from './webglview'

export default class Visualizer {
  constructor (element) {
    this.element = element
  }

  init () {
    this.initWebGL()
    this.addListeners()
    this.animate()
    this.resize()
  }

  initWebGL () {
    this.webgl = new WebGLView(this)
  }

  addListeners () {
    this.handlerAnimate = this.animate.bind(this)

    this.handlerResize = this.resize.bind(this)
    window.addEventListener('resize', this.handlerResize)

    this.handlerClick = this.click.bind(this)
    document.addEventListener('click', this.handlerClick)
  }

  animate () {
    this.update()
    this.draw()

    this.raf = requestAnimationFrame(this.handlerAnimate)
  }

  update () {
    if (this.webgl) {
      this.webgl.update()
    }
  }

  draw () {
    if (this.webgl) {
      this.webgl.draw()
    }
  }

  resize () {
    if (this.webgl) {
      this.webgl.resize()
    }
  }

  click () {
    this.webgl.next()
  }

  destroy () {
    window.removeEventListener('resize', this.handlerResize)

    document.removeEventListener('click', this.handlerClick)

    this.webgl.destroy()
  }
}