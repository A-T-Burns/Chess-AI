const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
class Particle{

    constructor(){
        this.x = Math.random()*$(document).width()*2-$(document).width()
        this.y = Math.random()*$(document).height()*2-$(document).height()
        this.direction = Math.random()*2*Math.PI
        this.speed = Math.random()*9+1
        this.color = `rgba(0, 0, 255, ${Math.random()*256})`
        this.color = `blue`
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

    remove(){
        particles.splice(particles.findIndex(this), 1)
    }
    static particles = []

    static Tick() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        Particle.particles.forEach(particle => {
            particle.move()
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