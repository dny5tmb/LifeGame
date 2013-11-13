enchant();

const CELL_WIDTH = 10; // セルの幅(px)
const CELL_NUM_X = 20; // セルの数(横)
const CELL_NUM_Y = 20; // セルの数(縦)
const BOARD_WIDTH  = CELL_WIDTH * CELL_NUM_X;
const BOARD_HEIGHT = CELL_WIDTH * CELL_NUM_Y;

const BUTTON_AREA = 20;
const GAME_WIDTH  = BOARD_WIDTH;
const GAME_HEIGHT = BOARD_HEIGHT + BUTTON_AREA;
const BUTTON_WIDTH  = 40;
const BUTTON_HEIGHT = 10;

var game;	// enchant.jsのゲームはグローバルにする
var isRunning = false;

// グローバルなセル。初期化もする。
var cells = createCells();

window.onload = function() {
	game = new Game(GAME_WIDTH, GAME_HEIGHT);
	game.fps = 10;

	game.onload = function() {
		game.replaceScene(createGameScene());
	}

	game.start();
	//game.pause();
};