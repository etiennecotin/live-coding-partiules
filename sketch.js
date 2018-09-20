var p;

var parts = [];

var pos;

//declaration musique
var song, analyzer;
var fft, // Allow us to analyze the song
    numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
    song,
    rms; // The p5 sound object

// Load our song
var loader = document.querySelector(".loader");
document.getElementById("audiofile").onchange = function(event) {
    if(event.target.files[0]) {
        if(typeof song != "undefined") { // Catch already playing songs
            song.disconnect();
            song.stop();
        }

        console.log("ok");
        // Load our new song
        song = loadSound(URL.createObjectURL(event.target.files[0]));
        loader.classList.add("loading");
    }
};

function setup() {
    createCanvas(windowWidth, windowHeight);

    colorMode(HSB, 100);

    parts.push(new Particule());


}

// function preload() {
//     file = document.getElementById("thefile");
//     audio = document.getElementById("audio");
//     song = audio;
//     // song = loadSound('rone-bye-bye_macadam.mp3');
//
//     fft = new p5.FFT();
//     peakDetect = new p5.PeakDetect();
// }

function draw() {
    background(0);


    if(typeof song != "undefined" && song.isLoaded() && !song.isPlaying()) {
        loader.classList.remove("loading");
        song.play();
        song.setVolume(0.5);

        fft = new p5.FFT();
        fft.waveform(numBars);
        fft.smooth(0.85);
    }

    if(typeof fft != "undefined") {
        var spectrum = fft.analyze();
        peakDetect = new p5.PeakDetect();
        peakDetect.update(fft);
        rms = peakDetect.penergy*10;
    }


    for (let i = 0; i < parts.length; i++) {
        parts[i].update();
    }

	for (let i = 0; i < parts.length; i++) {

        parts[i].draw();
  	}

    detectCollision();

}

class Particule{
	constructor() {
	  this.pos = createVector(width/2, height/2);
	  this.vit = createVector(random(-10, 10),random(-10, 10));
	  // this.teinte = random(255);
	  this.rayon = 50;
	  this.acc = createVector(random()*0.1, random()*0.1)

      this.mplitude = 25.0;
	  this.xAmp = 0;

	  this.old_pos = [];
	  this.n_pos = 50;

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
                    // fill(this.teinte, 255, 255);
                    noStroke();
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
	parts.push(new Particule);
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
