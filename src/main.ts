function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({game: g.game});

	scene.loaded.add(() => {
		
		// プレイヤーの作成
		const player = new g.FilledRect({
			scene: scene,
			cssColor: "#ff0000",
			width: 32,
			height: 32,
			x: g.game.width / 3, // 初期位置 x
			y: g.game.height - 100 // 初期位置 y
		});

		// プレイヤーでは何もしない
		player.update.add(() => {

		});

		// 弾を管理するための変数
		let bullet: g.E;
		// 画面内でクリックしたら弾を飛ばしたいため
		scene.pointDownCapture.add(() => {
			if (bullet == null) {
				// 弾を作成して、シーンに登録する（見えるようにする）
				bullet = shoot(scene, player);
				scene.append(bullet);
			}
		})

		// 敵を管理するための変数
		let enemy: g.E;
		/**
		 * 毎フレーム以下のことを行う
		 * 敵をランダムで出現させる（1体しか出ないようにする）
		 * 敵と弾が出ていたら、当たり判定を行う
		 * 判定の結果、敵と弾が当たっていたらどちらも削除する
		 */
		scene.update.add(() => {
			// 乱数の作成（0 ~ 9 の範囲）
			const value = Math.floor(g.game.random.generate() * 10);
			// 敵がいなくて、9 が出たら敵を出現させる
			if (enemy == null && value > 8) {
				enemy = generateEnemy(scene);
				scene.append(enemy);
			}

			// 敵と弾が出現していたらあたり判定を行う
			if (enemy && bullet) {
				// 2者の位置から重なっていれば当たっていると判定する（true が返ってくる）
				const hit = g.Collision.intersectAreas(enemy, bullet);
				// 当たっていたらどちらも削除する
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

// 弾を作成する処理
function shoot(scene: g.Scene, player: g.E): g.E {
	const bullet = new g.FilledRect({
		scene: scene,
		cssColor: "#0000FF",
		width: 20,
		height: 5,
		x: player.x + player.width, // プレイヤーの目の前に出す x
		y: player.y + player.height / 2　// プレイヤーの目の前に出す y
	});

	// 弾は出現中、まっすぐ進む（毎フレーム 5pixel 進む）
	bullet.update.add(() => {
		// 画面の外に出ると消える
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

// 敵を作成する
function generateEnemy(scene: g.Scene) {
	const enemy = new g.FilledRect({
		scene: scene,
		cssColor: "#00FF00",
		width: 32,
		height: 32,
		x: g.game.width - 100, // プレイヤーの正面に表示 x
		y: g.game.height - 100 // プレイヤーの正面に表示 y
	})
	
	return enemy;
}

export = main;
