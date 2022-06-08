var mode = 'menu';

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
		ship = new Entity(
			[
				-0.6, -1.0,
				0.6, -1.0,
				0.0, 1.0
			]
		),

		laser = [];

	var aste = [];
	for (let i = 0; i < 3; i++) {
		aste.push(new Aste);
	}

	const
				title = new Str('tachyon'),
				opt = new Str('play');

	// HUD
	var
		num = 0,
		n = num.toString();

	var hud = new Str(n);

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode) {
			case 37: // left
				e.preventDefault();

				ship.theta += 0.1;

				break;

			case 39: // right
				e.preventDefault();

				ship.theta -= 0.1;

				break;

			case 40: // down
				e.preventDefault();

				ship.y -= 0.1;

				break;

			case 38: // up
				e.preventDefault();

				ship.y += 0.1;

				break;

			case 13: // Enter
				e.preventDefault();

				laser.push(new Laser(ship))

				num++;
				n = num.toString();

				hud = new Str(n);

				break;
		}
	});

	function draw() {
		gl.clearColor(0, 0.06, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		switch (mode) {
			case 'menu':
				title.draw();

				opt.draw();

				break;

			case 'game':
				// HUD
				hud.draw();

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
