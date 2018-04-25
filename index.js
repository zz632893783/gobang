let gobangGame = {
	player: 'user',
	color: 'black',
	outerContainer: null,
	canvas: null,
	ctx: null,
	canvasSize: 0,
	colRowCount: 15,
	chessList: [],
	chessArrList: [],
	gameOver: false,
	init: function (selector) {
		this.outerContainer = document.querySelector(selector);
		if (!this.outerContainer) {
			return alert('所选择的容器不存在');
		}
		this.createContainer();
		this.setRem();
		this.initChessList();
		this.draw();
		this.setClickAction();
		this.gameOver = false;
	},
	createContainer: function () {
		let canvas = document.createElement('canvas');
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.outerContainer.appendChild(this.canvas);
	},
	setRem: function () {
		let that = this;
		this.canvasSize = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
		this.canvasSize = parseInt(this.canvasSize * 0.9);
		this.canvas.width = this.canvas.height = this.canvasSize;
		document.documentElement.style.fontSize = that.canvasSize / 20 + 'px'
	},
	draw: function () {
		this.clearChessBoard();
		this.drawChessBoard();
		this.drawChess();
	},
	clearChessBoard: function () {
		this.ctx.clearRect(0, 0, parseInt(this.canvas.width), parseInt(this.canvas.height));
	},
	drawChessBoard: function () {
		let unit = this.canvasSize / this.colRowCount;
		this.ctx.lineWidth = 1;
		this.ctx.fillStyle = 'black';
		this.ctx.shadowBlur = 0;
		for (let i = 0; i < this.colRowCount; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo((i + 0.5) * unit, 0.5 * unit);
			this.ctx.lineTo((i + 0.5) * unit, this.canvasSize - 0.5 * unit);
			this.ctx.stroke();
			this.ctx.closePath();
		}
		for (let i = 0; i < this.colRowCount; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0.5 * unit, (i + 0.5) * unit);
			this.ctx.lineTo(this.canvasSize - 0.5 * unit, (i + 0.5) * unit);
			this.ctx.stroke();
			this.ctx.closePath();
		}
		let dotList = [{ x: 3.5, y: 3.5 }, { x: 11.5, y: 3.5 }, { x: 3.5, y: 11.5 }, { x: 11.5, y: 11.5 }, { x: 7.5, y: 7.5 }];
		for (let i = 0; i < dotList.length; i++) {
			this.ctx.beginPath();
			this.ctx.arc(dotList[i].x * unit, dotList[i].y * unit, unit / 8, 0, 360, false);
			this.ctx.fill();
			this.ctx.closePath();
		}
	},
	chess: function () {},
	initChessList: function () {},
	setClickAction: function () {
		let that = this;
		let unit = this.canvasSize / this.colRowCount;
		// this.canvas.addEventListener(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 'touchstart' : 'mousedown', function (event) {
		this.canvas.addEventListener('click', function (event) {
			let x = Math.round((event.offsetX - 0.5 * unit) / unit);
			let y = Math.round((event.offsetY - 0.5 * unit) / unit);
			x = Math.abs(x);
			y = Math.abs(y);
			let result = false;
			for (let i = 0; i < that.chessList.length; i++) {
				if (that.chessList[i].x === x && that.chessList[i].y === y) {
					result = true;
					break;
				}
			}
			if (!result) {
				that.action(x, y);
			}
		});
	},
	chess: function (x, y, color, player) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.player = player;
		this.point = 0;
	},
	action: function (x, y) {
		if (this.gameOver) {
			return;
		}
		let chessObj = new this.chess(x, y, this.color, this.player);
		this.chessList.push(chessObj);
		this.color = this.color === 'black' ? 'white' : 'black';
		this.player = this.player === 'user' ? 'ai' : 'user';
		this.draw();
		this.outcome();
		if (this.player === 'ai' && !this.gameOver) {
			this.computeBest();
		}
	},
	drawChess: function () {
		let unit = this.canvasSize / this.colRowCount;
		for (let i = 0; i < this.chessList.length; i++) {
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = 'black';
			this.ctx.fillStyle = this.chessList[i].color;
			this.ctx.beginPath();
			this.ctx.arc((this.chessList[i].x + 0.5) * unit, (this.chessList[i].y + 0.5) * unit, unit * 0.35, 0, 360, false);
			this.ctx.closePath();
			this.ctx.fill();
		}
		let lastChess = this.chessList[this.chessList.length - 1];
		if (lastChess) {
			this.ctx.beginPath();
			this.ctx.moveTo(lastChess.x * unit, (lastChess.y + 0.3) * unit);
			this.ctx.lineTo(lastChess.x * unit, lastChess.y * unit);
			this.ctx.lineTo((lastChess.x + 0.3) * unit, lastChess.y * unit);
			this.ctx.moveTo((lastChess.x + 0.7) * unit, lastChess.y * unit);
			this.ctx.lineTo((lastChess.x + 1) * unit, lastChess.y * unit);
			this.ctx.lineTo((lastChess.x + 1) * unit, (lastChess.y + 0.3) * unit);
			this.ctx.moveTo((lastChess.x + 1) * unit, (lastChess.y + 0.7) * unit);
			this.ctx.lineTo((lastChess.x + 1) * unit, (lastChess.y + 1) * unit);
			this.ctx.lineTo((lastChess.x + 0.7) * unit, (lastChess.y + 1) * unit);
			this.ctx.moveTo((lastChess.x + 0.3) * unit, (lastChess.y + 1) * unit);
			this.ctx.lineTo(lastChess.x * unit, (lastChess.y + 1) * unit);
			this.ctx.lineTo(lastChess.x * unit, (lastChess.y + 0.7) * unit);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	},
	outcome: function () {
		for (let i = 0; i < this.chessArrList.length; i++) {
			let userChessCount = 0;
			let aiChessCount = 0;
			for (let j = 0; j < this.chessArrList[i].length; j++) {
				if (this.chessArrList[i][j].player === 'user') {
					userChessCount++;
				} else if (this.chessArrList[i][j].player === 'ai') {
					aiChessCount++;
				}
			}
			if (userChessCount === 5) {
				alert('恭喜您获胜了');
				this.gameOver = true;
			} else if (aiChessCount === 5) {
				alert('很抱歉，您输了');
				this.gameOver = true;
			}
		}
	},
	computeBest: function () {
		let list = [];
		for (let i = 0; i < this.colRowCount; i++) {
			let temp = [];
			for (let j = 0; j < this.colRowCount; j++) {
				temp.push({
					x: j,
					y: i,
					point: 0
				})
			}
			list.push(temp);
		}
		for (let i = 0; i < list.length; i++) {
			for (let j = 0; j < list[i].length; j++) {
				for (let k = 0; k < this.chessList.length; k++) {
					if (this.chessList[k].x ===  list[i][j].x && this.chessList[k].y ===  list[i][j].y) {
						list[i][j].player = this.chessList[k].player;
					}
				}
			}
		}
		// 数组
		this.chessArrList = [];
		for (let i = 0; i < this.colRowCount - 4; i++) {
			for (let j = 0; j < this.colRowCount; j++) {
				let temp = [];
				for (let k = 0; k < 5; k++) {
					temp.push(list[j][i + k]);
				}
				this.chessArrList.push(temp);
			}
		}
		for (let i = 0; i < this.colRowCount; i++) {
			for (let j = 0; j < this.colRowCount - 4; j++) {
				let temp = [];
				for (let k = 0; k < 5; k++) {
					temp.push(list[j + k][i]);
				}
				this.chessArrList.push(temp);
			}
		}
		for (let i = 0; i < this.colRowCount - 4; i++) {
			for (let j = 0; j < this.colRowCount - 4; j++) {
				let temp = [];
				for (let k = 0; k < 5; k++) {
					temp.push(list[j + k][i + k]);
				}
				this.chessArrList.push(temp);
			}
		}
		for (let i = 4; i < this.colRowCount; i++) {
			for (let j = 0; j < this.colRowCount - 4; j++) {
				let temp = [];
				for (let k = 0; k < 5; k++) {
					temp.push(list[j + k][i - k]);
				}
				this.chessArrList.push(temp);
			}
		}
		// 便利候选表，计算分数
		for (let i = 0; i < this.chessArrList.length; i++) {
			let userChessCount = 0;
			let aiChessCount = 0;
			let blackCount = 0;
			for (let j = 0; j < this.chessArrList[i].length; j++) {
				if (this.chessArrList[i][j].player === 'user') {
					userChessCount++;
				} else if (this.chessArrList[i][j].player === 'ai') {
					aiChessCount++;
				} else {
					blackCount++;
				}
			}
			let arrPoint;
			// 该五元组之内同时含有两种颜色棋子，得分为0
			if (userChessCount && aiChessCount) {
				arrPoint = 0;
			} else if (blackCount === 5) {
				arrPoint = 7;
			} else if (userChessCount === 1) {
				arrPoint = 35;
			} else if (userChessCount === 2) {
				arrPoint = 800;
			} else if (userChessCount === 3) {
				arrPoint = 15000;
			} else if (userChessCount === 4) {
				arrPoint = 800000;
			} else if (aiChessCount === 1) {
				arrPoint = 15;
			} else if (aiChessCount === 2) {
				arrPoint = 400;
			} else if (aiChessCount === 3) {
				arrPoint = 1800;
			} else if (aiChessCount === 4) {
				arrPoint = 100000;
			} else {
				arrPoint = 0;
			}
			for (let j = 0; j < this.chessArrList[i].length; j++) {
				this.chessArrList[i][j].point = this.chessArrList[i][j].point + arrPoint;
			}
		}
		let maxPoint = 0;
		for (let i = 0; i < list.length; i++) {
			for (let j = 0; j < list[i].length; j++) {
				if (!list[i][j].player && maxPoint < list[i][j].point) {
					maxPoint = list[i][j].point;
				}
			}
		}
		let selectChessList = [];
		for (let i = 0; i < list.length; i++) {
			for (let j = 0; j < list[i].length; j++) {
				if (list[i][j].point === maxPoint) {
					selectChessList.push(list[i][j]);
				}
			}
		}
		let randomChess = selectChessList[parseInt(selectChessList.length * Math.random())];
		randomChess.player = 'ai';
		this.action(randomChess.x, randomChess.y);
	}
};
gobangGame.init('#gobang');