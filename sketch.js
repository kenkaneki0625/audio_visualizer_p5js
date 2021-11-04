var song
var fft
var particles = []

function preload() {
  song = loadSound('Not This Time – Di Young.mp3')
  img = loadImage('stockbg.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.2)
  textFont(40);
  textSize(40);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0)
  translate(width/2, height/2)
  fft.analyze()
  amp = fft.getEnergy(20,300)

  push()
  if(amp>230){
    rotate(random(-0.5,0.5))
  }
  image(img, 0, 0, width+50, height+50)
  pop()

  var alpha = map(amp,0,255,180,150)
  fill(0, alpha)
  noStroke()
  rect(0,0,width,height)

  stroke(255)
  strokeWeight(3)
  noFill()
  var wave = fft.waveform()
  
  for(var t= -1; t<=1; t+=2){
    beginShape()
    fill(255,0,0,70);
    
    for( var i = 0; i<=180; i+=0.5){

      var index = floor(map(i,0,180, 0, wave.length-1))
  
      var r = map(wave[index], -1, 1, 150, 350)
  
      var x = r * sin(i) *t
      var y = r * cos(i)
      vertex(x,y)
    }
    endShape()
  }

  var p = new Particle()
  particles.push(p)

  for( var i=particles.length-1; i>=0 ; i--){
    if(!particles[i].edges()){
      particles[i].update(amp > 230)
      particles[i].show()
    }else{
      particles.splice(i,1)
    }
    
  }
  
  if(!song.isPlaying()){
    fill(255);
    text('Click to play', 0, 0);
  }
  
}

function mouseClicked() {
  if(song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}

class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0,0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
    this.w = random(5,10)
    this.color = [random(200,255), random(200,255), random(200,255)]
  }
  edges(){
    if(this.pos.x < -width/2 || this.pos.x > width /2 ||
      this.pos.y < -height/2 || this.pos.y>height/2){
        return true
      }else{
        return false
      }
  }
  update(condition){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(condition){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}