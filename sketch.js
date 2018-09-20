var p;

var parts = [];

var pos;

var min_nb_queue = 20;
var max_nb_queue = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);

  colorMode(HSB, 100);

  parts.push(new Particule(random(min_nb_queue, max_nb_queue)));
}

function draw() {
    background(0);

    for (let i = 0; i < parts.length; i++) {
        parts[i].update();
    }

	for (let i = 0; i < parts.length; i++) {

        parts[i].draw();
  	}

    detectCollision();
    if(frameCount > 100 && frameCount < 130) {
        for (let i = 0; i < 1; i++) {
            //parts.push(new Particule(random(min_nb_queue, max_nb_queue)));
        }
        
    }

}

class Particule{
	constructor(nb_queue) {
        
	  this.pos = createVector(width/2, height/2);
	  this.vit = createVector(random(-10, 10),random(-10, 10));
	  // this.teinte = random(255);
	  this.rayon = 50;
	  this.acc = createVector(random()*0.1, random()*0.1)

      this.mplitude = 25.0;
	  this.xAmp = 0;

	  this.old_pos = [];
      this.n_pos = round(nb_queue);
      
	  for (let i = 0; i < this.n_pos; i++){
	      this.old_pos.push({ 'vec' :createVector(0,0), 'taille' :random(10, 30)})
      }
	}
	update() {        
	    this.vit.add(this.acc);
	    this.pos.add(this.vit);

        for (let i = this.n_pos-2; i > -1; i--){
            this.old_pos[i+1].vec = this.old_pos[i].vec.copy();
        }

        this.old_pos[0].vec = this.pos.copy();

        // console.log(this.old_pos[0]);
        if(this.pos.x-this.rayon > width || this.pos.x+this.rayon < 0) {
		    // this.vit.x = -this.vit.x;
		    if (this.pos.x+this.rayon < 0){
                this.pos.x = width;
            } else {
                this.pos.x = 0;
            }
		    // this.teinte = random(255)%50;
	  	}
	  	if(this.pos.y-this.rayon > height || this.pos.y+this.rayon < 0) {
		    // this.vit.y = -this.vit.y;
		    // this.teinte = random(255)%50;
            if (this.pos.y+this.rayon < 0){
                this.pos.y = height;
            } else {
                this.pos.y = 0;
            }
	  	}

	  	if ((frameCount%100) == 0) {
            this.acc = createVector(random()*0.5-0.25, random()*0.5-0.25);
        }

        this.vit.x = min(max(this.vit.x, -5), 5);
        this.vit.y = min(max(this.vit.y, -5), 5);


	  	if(mouseIsPressed) {
	  		if (mouseButton === LEFT) {
			  	this.vit = createVector(-(this.pos.x - mouseX)/100, -(this.pos.y - mouseY)/100);
			}	
		}
	}
	draw() {

	    for (let i = 0; i < this.n_pos; i++){
	        if (i%3 == 0){
                this.xAmp += 0.01;
                push();
                    fill(100);
                    //noStroke();
                    translate(this.old_pos[i].vec);
                    rotate(this.vit.heading());
                    ellipse(0, sin(this.xAmp + 0.1*i)*(0.7*i)/(0.5*this.vit.mag()) , (this.rayon*2)-i/(this.n_pos/(this.rayon*2)));
                pop()
            }
        }

		push();
		  	ellipse(this.pos.x, this.pos.y, this.rayon*2);
	  	pop();
	}

}
function doubleClicked() {
	parts.push(new Particule(random(min_nb_queue, max_nb_queue)));
}
function mouseReleased() {
	for (var i = 0; i < parts.length; i++) {
	    parts[i].vit = createVector(random(-10, 10), random(-10, 10));
	}
}

function detectCollision() {
    for (let i = 0; i < parts.length; i++) {
        let x = parts[i].pos.x;
        let y = parts[i].pos.y;

        let partsCopy = parts.slice();
        // partsCopy.splice(i, 1);
        // console.log(partsCopy);
        for (let j = 0; j < partsCopy.length; j++) {
            if (x+50 > partsCopy[i].pos.x+50 || x-50 > partsCopy[i].pos.x-50){
                parts[i].vit = createVector(random(-10, 10), random(-10, 10));
            }
        }

    }
}
