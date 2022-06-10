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
		this.prog = new Prog('vec', 'green');

		// matrix
		this.model = new Float32Array(16);
		mat4.identity(this.model);

		this.prog.use();

		// attribute
		this.attrPos = gl.getAttribLocation(this.prog.id, 'pos');
		gl.vertexAttribPointer(this.attrPos, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(this.attrPos);

		// uniform
		this.uniModel = gl.getUniformLocation(this.prog.id, 'model');

		gl.uniformMatrix4fv(this.uniModel, gl.FALSE, this.model);

		this.prog.unUse();

		this.x = 0;
		this.y = 0;
		this.loc = [
			0.0, 0.0
		];
	}

	draw() {
		gl.bindVertexArray(this.vao);
		this.prog.use();

		gl.drawArrays(gl.LINE_LOOP, 0, this.vtc.length / 2);

		gl.bindVertexArray(null);
		this.prog.unUse();
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

		this.dir = [
			Math.cos(Math.random() * (Math.PI * 2)) / 100,
			Math.sin(Math.random() * (Math.PI * 2)) / 100
		];
		this.spin = Math.random() * (Math.PI * 2) / 100;
	}
};

class Laser extends Entity {
	constructor(ship) {
		super([
			0.0, 0.0,
			0.0, 1.0
		]);
	}
}
