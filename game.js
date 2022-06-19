class Entity {
	constructor(vtc, loc = [
		0.0,
		0.0
	]) {
		this._loc = loc;

		this._vao = gl.createVertexArray();
		gl.bindVertexArray(this._vao);

		// data
		this._vtc = vtc;

		this._vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vtc), gl.STATIC_DRAW);

		// program
		this.prog = new Prog('vec', 'green');

		// matrix
		this.model = new Float32Array(16);
		mat4.identity(this.model);

		mat4.translate(this.model, this.model, [this._loc[0], this._loc[1], 0]);

		this.prog.use();

		// attribute
		this._attrPos = gl.getAttribLocation(this.prog.id, 'pos');
		gl.vertexAttribPointer(this._attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(this._attrPos);

		// uniform
		this.uniModel = gl.getUniformLocation(this.prog.id, 'model');
		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		this.prog.unUse();
	}

	draw() {
		gl.bindVertexArray(this._vao);
		this.prog.use();

		gl.drawArrays(gl.LINE_LOOP, 0, this._vtc.length / 2);

		gl.bindVertexArray(null);
		this.prog.unUse();
	}
}

class Ship extends Entity {
	speed = 0.003;

	constructor() {
		super([
			-0.6, -1.0,
			0.6, -1.0,
			0.0, 1.0
		]);
	}
}

class Aste extends Entity {
	constructor() {
		let
			vtc = [],
			n = 7,
			step = (Math.PI * 2) / n;
		for (let i = 0; i < n; i++) {
			vtc.push(Math.cos(i * step) + Math.random());
			vtc.push(Math.sin(i * step) + Math.random());
		}

		super(vtc);

		this._dir = [
			Math.cos(Math.random() * Math.PI * 2) / 100,
			Math.sin(Math.random() * Math.PI * 2) / 100
		];
		this._spin = Math.random() * (Math.PI * 2) / 100;
	}
};

class Laser extends Entity {
	constructor() {
		super([
			0.0, 0.0,
			0.0, 1.0
		]);
	}
};
