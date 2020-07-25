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
				0.32, -0.5
			];

			this.vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW);

			// shader
			this.shadVtxTxt = rd("shad.vs");
			this.shadFragTxt = rd("shad.fs");

			this.shadVtx = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(this.shadVtx, this.shadVtxTxt);

			this.shadFrag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(this.shadFrag, this.shadFragTxt);

			gl.compileShader(this.shadVtx);
			if (!gl.getShaderParameter(this.shadVtx, gl.COMPILE_STATUS)) {
				console.error('Vertex error: ', gl.getShaderInfoLog(shadVtx));
			}

			gl.compileShader(this.shadFrag);
			if (!gl.getShaderParameter(this.shadFrag, gl.COMPILE_STATUS)) {
				console.error('Fragment error: ', gl.getShaderInfoLog(shadFrag));
			}

			/// program
			this.prog = gl.createProgram();
			gl.attachShader(this.prog, this.shadVtx);
			gl.attachShader(this.prog, this.shadFrag);

			gl.linkProgram(this.prog);
			if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
				console.error('Error linking program', gl.getProgramInfoLog(prog));
			}

			gl.validateProgram(this.prog);
			if (!gl.getProgramParameter(this.prog, gl.VALIDATE_STATUS)) {
				console.error('Error validating program', gl.getProgramInfoLog(prog));
			}

			// matrix
			this.model = new Float32Array(16);

			mat4.identity(this.model);

			this.id = new Float32Array(16);
			this.trans = new Float32Array(16);
			this.rot = new Float32Array(16);

			mat4.identity(this.id);

			// attribute
			this.attrPos = gl.getAttribLocation(this.prog, 'pos');
			gl.vertexAttribPointer(this.attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
			gl.enableVertexAttribArray(this.attrPos);

			// uniform
			this.uniModel = gl.getUniformLocation(this.prog, 'model');

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

			gl.useProgram(this.prog);
			gl.drawArrays(gl.LINE_LOOP, 0, 3);
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
