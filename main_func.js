enchant();

// 初期のセルの2次元配列を作成する
function createCells(cells) {
	cells = [];
	for (var x = 0; x < CELL_NUM_X; x++) {
		cells[x] = [];
		for (var y = 0; y < CELL_NUM_Y; y++) {
			cells[x][y] = false;
		}
	}
	return cells;
}

// グローバル変数のcellsを次の局面にすすめる関数
var nextCells = function() {
	// srcの複製を返す
	var cloneCells = function(src) {
		dest = [];
		for (var x = 0; x < CELL_NUM_X; x++) {
			dest[x] = [];
			for (var y = 0; y < CELL_NUM_Y; y++) {
				dest[x][y] = src[x][y];
			}
		}
		return dest;
	}

	// 集計用の現在盤面(変更前)
	var oldCells = cloneCells(cells);
	// 全てのセルについて
	for (var x = 0; x < CELL_NUM_X; ++x) {
		for (var y = 0; y < CELL_NUM_Y; ++y) {
			// 周辺の生死をカウントする
			var liveCount = 0;
			var dX = [-1, 0, +1, -1, +1, -1, 0, +1];
			var dY = [-1, -1, -1, 0, 0, +1, +1, +1];
			for (var i = 0; i < 8; ++i) {
				// 盤面の端はループさせる
				var X = (x + dX[i] + CELL_NUM_X) % CELL_NUM_X;
				var Y = (y + dY[i] + CELL_NUM_Y) % CELL_NUM_X;
				if (oldCells[X][Y]) {
					liveCount++;
				}
			}
			// cellsを次のターンの盤面にする
			if (liveCount == 3) { // 誕生
				cells[x][y] = true;
			} else if (liveCount == 2 || liveCount == 3) { // 生存
			} else if (liveCount <= 1) { // 過疎
				cells[x][y] = false;
			} else if (liveCount >= 4) { // 過密
				cells[x][y] = false;
			}
		}
	}
}


// ライフゲームを動かすシーンを作り、返す関数
var createGameScene = function() {
	var scene = new Scene();
	scene.backgroundColor = 'yellow';
	var board = new Board(scene);

	// スタート・ストップボタン	
	var startstopBtn = new Button("START",0,BOARD_HEIGHT,BUTTON_WIDTH,BUTTON_HEIGHT);
	scene.addChild(startstopBtn);
	startstopBtn.ontouchstart = function(){
		console.log("クリック:START・STOP");
		// フレーム毎にセルをすすめる
		if(isRunning){
			// 実行中のときは、停止する(ので表示はSTARTにする)
			scene.onenterframe = null;
			startstopBtn.text = "START";
			isRunning = false;
		}else{
			// 停止中のときは、開始する(ので表示はSTOPにする)
			scene.onenterframe = nextCells;
			startstopBtn.text = "STOP";
			isRunning = true;
		}
	}
	// リセットボタン
	var resetBtn = new Button("RESET",0,BOARD_HEIGHT+BUTTON_HEIGHT,BUTTON_WIDTH,BUTTON_HEIGHT);
	scene.addChild(resetBtn);
	resetBtn.ontouchstart = function(){
		console.log("クリック:リセット");
		cells = createCells();
	}
	return scene;
}

// ぼたんクラス
var Button = Class.create(Label, {
	initialize: function(str,x,y,w,h) {
		Label.call(this, str);
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.font = "8px";
		this.color = "red";
		this.backgroundColor = "black";
		this.textAlign = "center";
	}
})

// セルが集まった盤面クラス
var Board = Class.create(Sprite, {
	initialize: function(parent_scene) {
		Sprite.call(this, BOARD_WIDTH, BOARD_HEIGHT);
		// セルを保持する二次元配列用
		this.cellSpriteList = [];
		// ライフゲームのセルを作る
		for (var x = 0; x < CELL_NUM_X; ++x) {
			this.cellSpriteList[x] = [];
			for (var y = 0; y < CELL_NUM_Y; ++y) {
				this.cellSpriteList[x][y] = new Cell(x, y, parent_scene);
			}
		}
		//
	},
	draw: function() {
		for (var x = 0; x < CELL_NUM_X; ++x) {
			for (var y = 0; y < CELL_NUM_Y; ++y) {
				this.cellSpriteList[x][y].draw();
			}
		}
	}
})

// ライフゲームのセルのクラス
var Cell = Class.create(Sprite, {
	// x座標、y座標,親のシーン
	initialize: function(pX, pY, parent_scene) {
		Sprite.call(this, CELL_WIDTH, CELL_WIDTH);
		// セルの位置
		this.pX = pX;
		this.pY = pY;
		// 描画場所
		this.x = CELL_WIDTH * pX;
		this.y = CELL_WIDTH * pY;
		// Surfaceオブジェクトを生成しスプライトに連結
		var surface = new Surface(CELL_WIDTH, CELL_WIDTH);
		this.image = surface;
		// 追加
		parent_scene.addChild(this);
		// 毎フレーム再描画する
		this.onenterframe = this.draw;

		// クリック時はセルの生死を入れ替える
		this.ontouchstart = function(){
			cells[this.pX][this.pY] = !cells[this.pX][this.pY];
			this.draw();
		}
	},
	draw: function() {
		// 生死で色を変えるて、描画する
		this.image.context.fillStyle = cells[this.pX][this.pY] ? 'green' : 'red';
		this.image.context.fillRect(0, 0, CELL_WIDTH - 1, CELL_WIDTH - 1);
	}
}); // end of Cell class.