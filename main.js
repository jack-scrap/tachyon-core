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
		ship = new Entity([
			-0.6, -1.0,
			0.6, -1.0,
			0.0, 1.0
		]),

		laser = [];

	var aste = [];
	for (let i = 0; i < 3; i++) {
		aste.push(new Aste);
	}

	const
	title = new Str('tachyon', 0),
		opt = [
			new Str('play', -0.2),
			new Str('scoreboard', -(0.2 + 0.1))
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

	var hud = new Str(n);

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

						ship.prog.use();

						mat4.translate(ship.model, ship.model, [0.0, -0.1, 0.0]);

						gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

						ship.prog.unUse();

						break;

					case 38: // up
						e.preventDefault();

						ship.prog.use();

						mat4.translate(ship.model, ship.model, [0.0, 0.1, 0.0]);

						gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

						ship.prog.unUse();

						break;

					case 13: // Enter
						e.preventDefault();

						laser.push(new Laser())

						num++;

						hud = new Str(num.toString());

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
					0.003,
					0.0
				]);

				ship.prog.use();

				gl.uniformMatrix4fv(ship.uniModel, gl.FALSE, ship.model);

				ship.prog.unUse();

				ship.draw();

				for (let _ of aste) {
					if (_.y < 1.0) {
						_.draw();
					} else {
						_ = null;
					}
				}
				for (let _ of laser) {
					if (_.y < 1.0) {
						_.draw();
					} else {
						_ = null;
					}
				}

				break;
		}

		requestAnimationFrame(draw);
	}
	requestAnimationFrame(draw);
});
