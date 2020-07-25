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
	constructor(nameVtx, nameFrag) {
		this.shadVtx = new Shad(nameVtx, 0);
		this.shadFrag = new Shad(nameFrag, 1);

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
