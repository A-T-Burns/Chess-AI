const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

function lerp(a, b, t) {
    return a*(1-t)+b*t;
    }
class Particle{

    constructor(){
        this.x = Math.random()*$(document).width()*2-$(document).width()
        this.y = Math.random()*$(document).height()*2-$(document).height()
        this.direction = Math.random()*2*Math.PI
        this.speed = Math.random()*6+1
        this.color = `rgba(${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256})`
        this.size = Math.random()*40+1
        Particle.particles.push(this)
    }

    draw(){
        context.beginPath()
        context.fillStyle = this.color
        context.arc(this.x, this.y, this.size, 0, 2*Math.PI)
        context.fill()
    }

    move(){
        this.x += Math.sin(this.direction)*this.speed
        this.y += Math.cos(this.direction)*this.speed
        if (this.x >= canvas.width) {
          this.x = 1
        }
        if (this.y >= canvas.height) {
          this.y = 1
        }
        if (this.x <= 0) {
          this.x = canvas.width - 1
        }
        if (this.y <= 0) {
          this.y = canvas.height - 1
        }
    }
    colorTransition = null

    changeColor(){
        this.oldr = this.r || 0
        this.oldg = this.g || 0
        this.oldb = this.b || 0
        this.olda = this.a || 0
        this.colorTransitionAmount = 0
        this.colorTransitionSpeed = Math.random()*.001
        this.r = Math.random()*256
        this.g = Math.random()*256
        this.b = Math.random()*256
        this.a = Math.random()*256
        this.color = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
        this.colorTransition = setInterval(this.transitionColor, 10)
    }

    transitionColor() {
        this.colorTransitionAmount += this.colorTransitionSpeed
        this.r = lerp(this.oldr, this.r, this.colorTransitionAmount)
        this.g = lerp(this.oldg, this.g, this.colorTransitionAmount)
        this.b = lerp(this.oldb, this.b, this.colorTransitionAmount)
        this.a = lerp(this.olda, this.a, this.colorTransitionAmount)
        if (this.colorTransitionAmount >= 1) {
            clearInterval(this.colorTransition)
            this.colorTransition = null
        }
    }

    remove(){
        particles.splice(particles.findIndex(this), 1)
    }
    static particles = []

    static Tick() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        Particle.particles.forEach(particle => {
            particle.move()
            if (Math.random() < .01) {
                particle.changeColor()
            }
            particle.draw()
        })
    }
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Redraw everything after resizing the window 
  }
  function drawParticles(){
      for (let i = 0; i < 20; i++) {
          new Particle().draw()
      }
      setInterval(Particle.Tick, 10)
  }
  
  resizeCanvas();
  drawParticles()
  window.addEventListener('resize', resizeCanvas, false);