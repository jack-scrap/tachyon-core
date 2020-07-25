class Entity {
	constructor() {
		// data
		this.vtc = [
			0.0, 0.0,
			0.0, 0.0
		];

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW);

		this.prog = new Prog("shad");

		// matrix
		this.model = new Float32Array(16);

		mat4.identity(this.model);

		this.id = new Float32Array(16);
		this.trans = new Float32Array(16);
		this.rot = new Float32Array(16);

		mat4.identity(this.id);

		// attribute
		this.attrPos = gl.getAttribLocation(this.prog.id, 'pos');
		gl.vertexAttribPointer(this.attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(this.attrPos);

		// uniform
		this.uniModel = gl.getUniformLocation(this.prog.id, 'model');

		this.y = 0;
		this.ang = 0;
	}

	draw() {
		mat4.translate(this.trans, this.id, [0, this.y, 0]);
		mat4.rotate(this.rot, this.id, this.ang, [0, 0, 1]);
		mat4.mul(this.model, this.rot, this.id);
		mat4.mul(this.model, this.trans, this.model);
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		// draw
		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.prog.id);
		gl.drawArrays(gl.LINES, 0, 2);
	}
};

class Laser extends Entity {
	constructor() {
		super();

		// data
		this.vtc = [
			0.0, -0.5,
			0.0, 0.5
		];

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW);

		this.prog = new Prog("shad");

		// matrix
		this.model = new Float32Array(16);

		mat4.identity(this.model);

		this.id = new Float32Array(16);
		this.trans = new Float32Array(16);
		this.rot = new Float32Array(16);

		mat4.identity(this.id);

		// attribute
		this.attrPos = gl.getAttribLocation(this.prog.id, 'pos');
		gl.vertexAttribPointer(this.attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(this.attrPos);

		// uniform
		this.uniModel = gl.getUniformLocation(this.prog.id, 'model');

		this.y = 0;
		this.ang = 0;
	}
};

class Ship extends Entity {
	constructor() {
		super();

		// data
		this.vtc = [
			0.0, 0.32,
			-0.32, -0.5,

			-0.32, -0.5,
			0.32, -0.5,

			0.32, -0.5,
			0.0, 0.32
		];

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW);

		this.prog = new Prog("shad");

		// matrix
		this.model = new Float32Array(16);

		mat4.identity(this.model);

		this.id = new Float32Array(16);
		this.trans = new Float32Array(16);
		this.rot = new Float32Array(16);

		mat4.identity(this.id);

		// attribute
		this.attrPos = gl.getAttribLocation(this.prog.id, 'pos');
		gl.vertexAttribPointer(this.attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(this.attrPos);

		// uniform
		this.uniModel = gl.getUniformLocation(this.prog.id, 'model');

		this.y = 0;
		this.ang = 0;
	}

	draw() {
		mat4.translate(this.trans, this.id, [0, this.y, 0]);
		mat4.rotate(this.rot, this.id, this.ang, [0, 0, 1]);
		mat4.mul(this.model, this.rot, this.id);
		mat4.mul(this.model, this.trans, this.model);
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		// draw
		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.prog.id);
		gl.drawArrays(gl.LINES, 0, 2);
	}
};

document.addEventListener("DOMContentLoaded", function() {
	// initialize
	var
		canvas = document.getElementById('disp');
		gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('Initialization error: WebGL not supported; falling back on experimental');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Initialization error: WebGL not supportd in browser');
	}

	// ship
	ship = new Ship;
	laser = new Laser;

	document.addEventListener("keydown", function(e) {
		switch (e.keyCode) {
			case 37: // left
				e.preventDefault();

				ship.ang += 0.1;

				break;

			case 39: // right
				e.preventDefault();

				ship.ang -= 0.1;

				break;

			case 40: // down
				e.preventDefault();

				ship.y -= 0.1;

				break;

			case 38: // up
				e.preventDefault();

				ship.y += 0.1;

				break;
		}
	});

	function draw() {
		// ship.draw();
		laser.draw();

		requestAnimationFrame(draw);
	}
	requestAnimationFrame(draw);
});
