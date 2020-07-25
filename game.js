class Entity {
	constructor(vtc) {
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		// data
		this.vtc = vtc;

		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtc), gl.STATIC_DRAW);

		// program
		this.prog = new Prog("vec", "green");

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

		this.x = 0;
		this.y = 0;
		this.ang = 0;
	}

	draw() {
		gl.bindVertexArray(this.vao);
		gl.useProgram(this.prog.id);

		mat4.translate(this.trans, this.id, [0, this.y, 0]);
		mat4.rotate(this.rot, this.id, this.ang, [0, 0, 1]);
		mat4.mul(this.model, this.rot, this.id);
		mat4.mul(this.model, this.trans, this.model);
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		// draw
		gl.drawArrays(gl.LINE_LOOP, 0, this.vtc.length / 2);
	}
}

class Aste extends Entity {
	constructor() {
		let
			vtc = [],
			n = 7,
			step = (Math.PI * 2) / n;
		for (let i = 0; i < n; i++) {
			vtc.push(Math.cos(i * step));
			vtc.push(Math.sin(i * step));
		}

		super(vtc);

		this.dir = [
			Math.cos(Math.random() * (Math.PI * 2)) / 100,
			Math.sin(Math.random() * (Math.PI * 2)) / 100
		];
	}

	draw() {
		gl.bindVertexArray(this.vao);
		gl.useProgram(this.prog.id);

		mat4.translate(this.trans, this.id, [this.x, this.y, 0]);
		mat4.rotate(this.rot, this.id, this.ang, [0, 0, 1]);
		mat4.mul(this.model, this.rot, this.id);
		mat4.mul(this.model, this.trans, this.model);
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		// draw
		gl.drawArrays(gl.LINE_LOOP, 0, this.vtc.length / 2);

		this.x += this.dir[0];
		this.y += this.dir[1];
	}
};

class Laser extends Entity {
	constructor() {
		super([
			0.0, 0.0,
			0.0, 1.0
		]);
	}

	draw() {
		gl.bindVertexArray(this.vao);
		gl.useProgram(this.prog.id);

		mat4.translate(this.trans, this.id, [0, this.y, 0]);
		mat4.rotate(this.rot, this.id, this.ang, [0, 0, 1]);
		mat4.mul(this.model, this.rot, this.id);
		mat4.mul(this.model, this.trans, this.model);
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		// draw
		gl.drawArrays(gl.LINE_LOOP, 0, this.vtc.length / 2);

		this.y += 0.1;
	}
}
