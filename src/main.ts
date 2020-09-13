function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({game: g.game});

	scene.loaded.add(() => {
		
		// 以下にゲームのロジックを記述します。
		const player = new g.FilledRect({
			scene: scene,
			cssColor: "#ff0000",
			width: 32,
			height: 32,
			x: g.game.width / 3,
			y: g.game.height - 100
		});

		player.update.add(() => {

		});

		let bullet: g.E;
		scene.pointDownCapture.add(() => {
			if (bullet == null) {
				bullet = shoot(scene, player);
				scene.append(bullet);
			}
		})

		let enemy: g.E;
		scene.update.add(() => {
			const value = Math.floor(g.game.random.generate() * 10);
			if (enemy == null && value > 8) {
				enemy = generateEnemy(scene);
				scene.append(enemy);
			}

			if (bullet?.destroyed()) {
				bullet = null;
			}

			if (enemy && bullet) {
				const hit = g.Collision.intersectAreas(enemy, bullet);
				if (hit) {
					bullet.destroy();
					bullet = null;
					enemy.destroy();
					enemy = null;
				}
			}
		});

		scene.append(player);
	});
	g.game.pushScene(scene);
}

function shoot(scene: g.Scene, player: g.E): g.E {
	const bullet = new g.FilledRect({
		scene: scene,
		cssColor: "#0000FF",
		width: 20,
		height: 5,
		x: player.x + player.width,
		y: player.y + player.height / 2
	});

	bullet.update.add(() => {
		if (bullet.x > g.game.width) {
			bullet.x = 0;
			bullet.destroy();
			return;
		}
		bullet.x += 5;
		bullet.modified();
	});

	return bullet;
}

function generateEnemy(scene: g.Scene) {
	const enemy = new g.FilledRect({
		scene: scene,
		cssColor: "#00FF00",
		width: 32,
		height: 32,
		x: g.game.width - 100,
		y: g.game.height - 100
	})
	
	return enemy;
}

export = main;
