var p;

var parts = [];

var pos;

var color1 = 63;
var color2 = 40;
var color3 = 100;

var backgroundColor = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    colorMode(HSB);

    parts.push(new Particule());
    parts.push(new Soleil());
}

function draw() {
    background(200, 100, backgroundColor);

    for (let i = 0; i < parts.length; i++) {
        parts[i].update();
    }

    for (let i = 0; i < parts.length; i++) {

        parts[i].draw();
    }

    detectCollision();

}

class Particule {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.vit = createVector(random(-10, 10), random(-10, 10));
        // this.teinte = random(255);
        this.rayon = 50;
        this.acc = createVector(random() * 0.1, random() * 0.1)

        this.mplitude = 25.0;
        this.xAmp = 0;

        this.old_pos = [];
        this.n_pos = 50;

        for (let i = 0; i < this.n_pos; i++) {
            this.old_pos.push({
                'vec': createVector(0, 0),
                'taille': random(10, 30)
            })
        }
    }
    update() {

        this.vit.add(this.acc);
        this.pos.add(this.vit);

        for (let i = this.n_pos - 2; i > -1; i--) {
            this.old_pos[i + 1].vec = this.old_pos[i].vec.copy();
        }

        this.old_pos[0].vec = this.pos.copy();

        // console.log(this.old_pos[0]);
        if (this.pos.x - this.rayon > width || this.pos.x + this.rayon < 0) {
            // this.vit.x = -this.vit.x;
            if (this.pos.x + this.rayon < 0) {
                this.pos.x = width;
            } else {
                this.pos.x = 0;
            }
            // this.teinte = random(255)%50;
        }
        if (this.pos.y - this.rayon > height || this.pos.y + this.rayon < 0) {
            // this.vit.y = -this.vit.y;
            // this.teinte = random(255)%50;
            if (this.pos.y + this.rayon < 0) {
                this.pos.y = height;
            } else {
                this.pos.y = 0;
            }
        }

        if ((frameCount % 100) == 0) {
            this.acc = createVector(random() * 0.5 - 0.25, random() * 0.5 - 0.25);
        }

        this.vit.x = min(max(this.vit.x, -5), 5);
        this.vit.y = min(max(this.vit.y, -5), 5);


        if (mouseIsPressed) {
            if (mouseButton === LEFT) {
                this.vit = createVector(-(this.pos.x - mouseX) / 100, -(this.pos.y - mouseY) / 100);
            }
        }
    }
    draw() {

        for (let i = 0; i < this.n_pos; i++) {
            if (i % 3 == 0) {
                this.xAmp += 0.01;
                push();
                // fill(this.teinte, 255, 255);
                noStroke();
                translate(this.old_pos[i].vec);
                rotate(this.vit.heading());
                ellipse(0, sin(this.xAmp + 0.1 * i) * (0.7 * i) / (0.5 * this.vit.mag()), (this.rayon * 2) - i / (this.n_pos / (this.rayon * 2)));
                pop()
            }
        }

        push();
        ellipse(this.pos.x, this.pos.y, this.rayon * 2);
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
            if (x + 50 > partsCopy[i].pos.x + 50 || x - 50 > partsCopy[i].pos.x - 50) {
                parts[i].vit = createVector(random(-10, 10), random(-10, 10));
            }
        }

    }
}

//Soleil
class Soleil {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.vit = createVector(1, 0);
        this.angle = 270;
        this.vit_angle = 1;
        this.angle_min = 180;
        this.angle_max = 360;
    }

    update() {
        
        this.angle = 180 + (frameCount / 5) % 180;
        
        if ((this.pos.x > width) || (this.pos.x < 0)) {
            this.vit.x = -this.vit.x;
        }
        if ((this.pos.y > height / 3) || (this.pos.y < 0)) {
            this.vit.y = -this.vit.y;
        }

        if (this.angle < 240) {
            color2 = color2 + 1;

        } else {
            color2 = color2 - 1;
        }

        if (this.angle < 240) {
            backgroundColor = backgroundColor + 1;
        } else {
            backgroundColor = backgroundColor - 1;
        }
    }

    draw() {
        push();
        //translate(this.pos);
        translate(width / 2 + height * 1.9 * cos(radians(this.angle)), height * 2 + 1.9 * height * sin(radians(this.angle)));
        stroke(color1, color2, color3);
        strokeWeight(random(3, 10));
        fill(color1, color2, color3);

        for (var j = 0; j < width; j = j + random(50, 80)) {
            var pt = createVector(j, 0);
            var vec = pt.copy().sub(this.pos).normalize().mult(random(100, 200));
            line(0, 0, vec.x, vec.y);

            var pt4 = createVector(j, height);
            var vec4 = pt4.copy().sub(this.pos).normalize().mult(random(100, 200));
            line(vec4.x, vec4.y, 0, 0);

        }

        for (var k = 0; k < height; k = k + random(50, 80)) {

            var pt2 = createVector(0, k);
            var vec2 = pt2.copy().sub(this.pos).normalize().mult(random(100, 200));
            line(0, 0, vec2.x, vec2.y);

            var pt3 = createVector(width, k);
            var vec3 = pt3.copy().sub(this.pos).normalize().mult(random(100, 200));
            line(vec3.x, vec3.y, 0, 0);

        }
        ellipse(0, 0, 150);

        pop();
    }
}