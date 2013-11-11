enchant();

const CELL_WIDTH = 10; // セルの幅(px)
const CELL_NUM_X = 10; // セルの数(横)
const CELL_NUM_Y = 10; // セルの数(縦)
const BOARD_WIDTH_X = CELL_WIDTH * CELL_NUM_X;
const BOARD_WIDTH_Y = CELL_WIDTH * CELL_NUM_Y + 40;
var game;	// enchant.jsのゲームはグローバルにする

// グローバルなセル。初期化もする。
var cells = createCells();
cells[1][3] = true;
cells[2][3] = true;
cells[2][1] = true;
cells[4][2] = true;
cells[5][3] = true;
cells[6][3] = true;
cells[7][3] = true;


window.onload = function() {
	game = new Game(BOARD_WIDTH_X, BOARD_WIDTH_Y);
	game.fps = 10;

	game.onload = function() {
		game.replaceScene(createSettingScene());
	}
	game.start();
};