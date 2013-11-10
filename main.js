enchant();

const CELL_WIDTH=4;		// セルの幅(px)
const CELL_NUM_X=100;	// セルの数(横)
const CELL_NUM_Y=100;	// セルの数(縦)
const BOARD_WIDTH_X=CELL_WIDTH*CELL_NUM_X;
const BOARD_WIDTH_Y=CELL_WIDTH*CELL_NUM_Y;

// 初期のセルの2次元配列を作成する
function createCells(cells){
	cells = [];
	for (var x=0; x<CELL_NUM_X; x++){
		cells[x] = [];
		for (var y=0; y<CELL_NUM_Y; y++){
			cells[x][y] = false;
		}
	}
	return cells;
}

// グローバルなセル。初期化もする。
var cells = createCells();
/*
cells[2][3] = true;
cells[3][3] = true;
cells[3][4] = true;
cells[7][4] = true;
cells[8][4] = true;
cells[9][4] = true;
cells[8][2] = true;
*/
cells[1][3] = true;
cells[2][3] = true;
cells[2][1] = true;
cells[4][2] = true;
cells[5][3] = true;
cells[6][3] = true;
cells[7][3] = true;

// グローバル変数のcellsを次の局面にすすめる関数
var nextCells = function(){
	// srcの複製を返す
	var cloneCells = function(src){
		dest = [];
		for (var x=0; x<CELL_NUM_X; x++){
			dest[x] = [];
			for (var y=0; y<CELL_NUM_Y; y++){
				dest[x][y] = src[x][y];
			}
		}	
		return dest;
	}

	// 集計用の現在盤面(変更前)
	var oldCells = cloneCells(cells);
	// 全てのセルについて
	for (var x=0; x<CELL_NUM_X; ++x){
		for (var y=0; y<CELL_NUM_Y; ++y){
			// 周辺の生死をカウントする
			var liveCount = 0;
			var dX = [-1, 0,+1,-1,+1,-1, 0,+1];
			var dY = [-1,-1,-1, 0, 0,+1,+1,+1];
			for(var i=0; i<8; ++i){
				// 盤面の端はループさせる
				var X=(x+dX[i] + CELL_NUM_X)%CELL_NUM_X;
				var Y=(y+dY[i] + CELL_NUM_Y)%CELL_NUM_X;
				if (oldCells[X][Y]){
					liveCount++;
				}
			}
			// cellsを次のターンの盤面にする
			if(liveCount==3){
				// 誕生
				cells[x][y] = true;
			}else if(liveCount==2 || liveCount==3 ){
				// 生存
			}else if(liveCount<=1){
				// 過疎
				cells[x][y] = false;
			}else if(liveCount>=4){
				// 過密
				cells[x][y] = false;
			}
		}
	}
}

window.onload = function(){
	var game = new Game(BOARD_WIDTH_X,BOARD_WIDTH_Y);
	game.fps = 30;
	game.onload = function(){

		var Board = Class.create(Sprite,{
			initialize: function(){
				Sprite.call(this,BOARD_WIDTH_X,BOARD_WIDTH_Y);
				var scene = game.rootScene;
				scene.backgroundColor = "pink";
				this.x = 0;
				this.y = 0;
				// Surfaceオブジェクトを生成しスプライトに連結
				var surface = new Surface(BOARD_WIDTH_X,BOARD_WIDTH_Y);
				this.image = surface;

				this.on('enterframe',function(){
					// 関数：1つのセルを描画
					var drowCell = function(x,y,isLive){
						// 生死で色を変える
						surface.context.fillStyle = isLive?'green':'red';
						var W = CELL_WIDTH;
						var d = 1;
						surface.context.fillRect(x*W,y*W,W-d,W-d);
					};

					// 全てのセルを実際に描画する
					for(var x=0; x<CELL_NUM_X; ++x){
						for(var y=0; y<CELL_NUM_Y; ++y){
							drowCell(x,y,cells[x][y]);
						}
					}

					// 次のステップにする
					nextCells();
				})
				// 追加
				game.rootScene.addChild(this);
			}
		});
		var board = new Board();
	}
	game.start();
};