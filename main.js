class Shad {
	constructor(name, i) {
		var ext;
		if (i) {
			ext = "fs"
		} else {
			ext = "vs";
		}

		this.shadTxt = rd(name + "." + ext);

		var type;
		if (i) {
			type = gl.FRAGMENT_SHADER;
		} else {
			type = gl.VERTEX_SHADER;
		}
		this.id = gl.createShader(type);
		gl.shaderSource(this.id, this.shadTxt);

		gl.compileShader(this.id);
		if (!gl.getShaderParameter(this.id, gl.COMPILE_STATUS)) {
			console.error('Error: ', gl.getShaderInfoLog(this.id));
		}
	}
}

class Prog {
	constructor(name) {
		this.shadVtx = new Shad(name, 0);
		this.shadFrag = new Shad(name, 1);

		this.id = gl.createProgram();
		gl.attachShader(this.id, this.shadVtx.id);
		gl.attachShader(this.id, this.shadFrag.id);

		gl.linkProgram(this.id);
		if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
			console.error('Error linking program', gl.getProgramInfoLog(prog));
		}

		gl.validateProgram(this.id);
		if (!gl.getProgramParameter(this.id, gl.VALIDATE_STATUS)) {
			console.error('Error validating program', gl.getProgramInfoLog(prog));
		}
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

	class Ship {
		constructor() {
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
			gl.drawArrays(gl.LINES, 0, 6);
		}
	};

	// ship
	ship = new Ship;

	function draw() {
		ship.draw();
	}

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

		requestAnimationFrame(draw);
	});

	requestAnimationFrame(draw);
});
