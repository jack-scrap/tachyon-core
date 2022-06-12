var
	mode = 'menu',
	m = 0;

document.addEventListener('DOMContentLoaded', function() {
	// initialize
	var
		canvas = document.getElementById('disp');
		gl = canvas.getContext('webgl2');

	if (!gl) {
		console.log('Initialization error: WebGL not supported; falling back on experimental');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Initialization error: WebGL not supportd in browser');
	}

	// game
	var
		ship = new Ship(),

		laser = [];

	var aste = [];
	for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
		let inst = new Aste();

		mat4.rotate(inst.model, inst.model, Math.floor(Math.random() * Math.PI * 2), [0, 0, 1]);
		mat4.translate(inst.model, inst.model, [Math.random() * (1.0 - -1.0) + -1.0, Math.random() * (1.0 - -1.0) + -1.0, Math.random() * (1.0 - -1.0) + -1.0]);

		inst.prog.use();

		gl.uniformMatrix4fv(inst.uniModel, gl.FALSE, inst.model);

		inst.prog.unUse();

		aste.push(inst);
	}

	const
		title = new Str('tachyon', 0.0, 0.0),
		opt = [
			new Str('play', 0.0, -0.2),
			new Str('scoreboard', 0.0, -(0.2 + 0.1))
		],
		curs = new Entity([
			0.0, 0.0,
			1.0, 1.0,
			0.0, 2.0
		], [
			-0.8, -(0.2 + (m * 0.1))
		]);

	// HUD
	var
		num = 0,
		n = num.toString();

	var hud = new Str(n, -0.8, 0.8);

	document.addEventListener('keydown', function(e) {
		switch (mode) {
			case 'menu':
				switch (e.keyCode) {
					case 40: // down
						e.preventDefault();

						if (m < 1) {
							m++;
						}

						mat4.identity(curs.model);
						mat4.translate(curs.model, curs.model, [-0.8, -(0.2 + (m * 0.1)), 0.0]);

						curs.prog.use();

						gl.uniformMatrix4fv(curs.uniModel, gl.FALSE, curs.model);

						curs.prog.unUse();

						break;

					case 38: // up
						e.preventDefault();

						if (m) {
							m--;
						}

						mat4.identity(curs.model);
						mat4.translate(curs.model, curs.model, [-0.8, -(0.2 + (m * 0.1)), 0.0]);

						curs.prog.use();

						gl.uniformMatrix4fv(curs.uniModel, gl.FALSE, curs.model);

						curs.prog.unUse();

						break;

					case 13: // Enter
						e.preventDefault();

						switch (m) {
							case 0:
								mode = 'game';

								break;

							case 1:
								mode = 'score';

								break;
						}

						break;
				}

				break;

			case 'game':
				switch (e.keyCode) {
					case 37: // left
						e.preventDefault();

						ship.prog.use();

						mat4.rotate(ship.model, ship.model, 0.1, [0, 0, 1]);

						gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

						ship.prog.unUse();

						break;

					case 39: // right
						e.preventDefault();

						ship.prog.use();

						mat4.rotate(ship.model, ship.model, -0.1, [0, 0, 1]);

						gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

						ship.prog.unUse();

						break;

					case 40: // down
						e.preventDefault();

						break;

					case 38: // up
						e.preventDefault();

						ship.speed = 0.015;

						break;

					case 13: // Enter
						e.preventDefault();

						inst = new Laser()

						mat4.copy(inst.model, ship.model)

						inst.prog.use();

						gl.uniformMatrix4fv(inst.uniModel, gl.FALSE, inst.model);

						inst.prog.unUse();

						laser.push(inst)

						num++;
						n = num.toString();

						hud = new Str(n, -0.8, 0.8);

						break;
				}

				break;
		}
	});

	document.addEventListener('keyup', function(e) {
		switch (mode) {
			case 'game':
				switch (e.keyCode) {
					case 38: // up
						e.preventDefault();

						ship.speed = 0.003;

						break;
				}

				break;
		}
	});

	function draw() {
		gl.clearColor(0, 0.06, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		switch (mode) {
			case 'menu':
				title.draw();

				for (let _ of opt) {
					_.draw();
				}

				curs.draw();

				break;

			case 'game':
				// HUD
				hud.draw();

				mat4.translate(ship.model, ship.model, [
					0.0,
					ship.speed,
					0.0
				]);

				ship.prog.use();

				gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

				ship.prog.unUse();

				ship.draw();

				for (let _ of aste) {
					mat4.translate(_.model, _.model, [
						0.0,
						0.001,
						0.0
					]);

					_.prog.use();

					gl.uniformMatrix4fv(_.uniModel, gl.FALSE, _.model);

					_.prog.unUse();

					_.draw();
				}
				for (let _ of laser) {
					mat4.translate(_.model, _.model, [
						0.0,
						0.03,
						0.0
					]);

					_.prog.use();

					gl.uniformMatrix4fv(_.uniModel, gl.FALSE, _.model);

					_.prog.unUse();

					_.draw();
				}

				break;
		}

		requestAnimationFrame(draw);
	}
	requestAnimationFrame(draw);
});
