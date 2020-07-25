function rd(name) {
	var req = new XMLHttpRequest();
	req.open('GET', name, false);
	req.send(null);

	if (req.status == 200) {
		return req.responseText;
	}
}

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

	// data
	const vtc = [
		0.0, 0.32,
		-0.32, -0.5,
		0.32, -0.5
	];

	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtc), gl.STATIC_DRAW);

	// shader
	const
		shadVtxTxt = rd("shad.vs"),
		shadFragTxt = rd("shad.fs");

	var shadVtx = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shadVtx, shadVtxTxt);

	var shadFrag = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shadFrag, shadFragTxt);

	gl.compileShader(shadVtx);
	if (!gl.getShaderParameter(shadVtx, gl.COMPILE_STATUS)) {
		console.error('Vertex error: ', gl.getShaderInfoLog(shadVtx));
	}

	gl.compileShader(shadFrag);
	if (!gl.getShaderParameter(shadFrag, gl.COMPILE_STATUS)) {
		console.error('Fragment error: ', gl.getShaderInfoLog(shadFrag));
	}

	/// program
	var prog = gl.createProgram();
	gl.attachShader(prog, shadVtx);
	gl.attachShader(prog, shadFrag);

	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.error('Error linking program', gl.getProgramInfoLog(prog));
	}

	gl.validateProgram(prog);
	if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
		console.error('Error validating program', gl.getProgramInfoLog(prog));
	}

	// attribute
	var attrPos = gl.getAttribLocation(prog, 'pos');
	gl.vertexAttribPointer(attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(attrPos);

	// matrix
	var model = new Float32Array(16);

	mat4.identity(model);

	var
		id = new Float32Array(16),
		trans = new Float32Array(16),
		rot = new Float32Array(16);

	mat4.identity(id);

	// uniform
	var uniModel = gl.getUniformLocation(prog, 'model');

	var
		y = 0,
		ang = 0;
	document.addEventListener("keydown", function(e) {
		switch (e.keyCode) {
			case 37: // left
				e.preventDefault();

				ang += 0.1;

				break;

			case 39: // right
				e.preventDefault();

				ang -= 0.1;

				break;

			case 40: // down
				e.preventDefault();

				y -= 0.1;

				break;

			case 38: // up
				e.preventDefault();

				y += 0.1;

				break;
		}
	});

	function draw() {
		gl.uniformMatrix4fv(uniModel, gl.FALSE, model);

		mat4.translate(trans, id, [0, y, 0]);
		mat4.rotate(rot, id, ang, [0, 0, 1]);
		mat4.mul(model, trans, id);
		mat4.mul(model, rot, model);
		gl.uniformMatrix4fv(uniModel, gl.FALSE, model);

		// draw
		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(prog);
		gl.drawArrays(gl.LINE_LOOP, 0, 3);

		requestAnimationFrame(draw);
	}
	requestAnimationFrame(draw);
});
