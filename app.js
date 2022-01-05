document.addEventListener("DOMContentLoaded", () => {
	const gridBoard = document.querySelector(".board");
	let width = 10;
	let squares = [];
	let flags = 0;
	let bombAmout = 15;
	let flagsLeft = bombAmout;
	let isGameOver = false;
	const resetFace = document.querySelector(".reset");
	const flagCounter = document.querySelector(".flags-count");

	flagCounter.innerHTML = flagsLeft;

	resetFace.addEventListener("click", function (e) {
		reset();
	});

	function createBoard() {
		const bombsArray = Array(bombAmout).fill("bomb");
		const emptyArray = Array(width * width - bombAmout).fill("valid");

		const gameArray = emptyArray.concat(bombsArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div");
			square.setAttribute("id", i);
			square.classList.add(shuffledArray[i]);
			gridBoard.appendChild(square);
			squares.push(square);

			square.addEventListener("click", function (e) {
				click(square);
			});

			square.oncontextmenu = function (e) {
				e.preventDefault();
				addFlag(square);
			};
		}

		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			//Positions to check
			//NW  N  NE
			//W      E
			//SW  S  SE

			if (squares[i].classList.contains("valid")) {
				//Checking NW
				if (i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb"))
					total++;
				//Checking N
				if (i > 9 && squares[i - width].classList.contains("bomb")) total++;
				//Checking NE
				if ((i > 9) & !isRightEdge && squares[i + 1 - width].classList.contains("bomb"))
					total++;
				//Checking W
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
				//Checking E
				if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
				//Checking SW
				if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb"))
					total++;
				//Checking S
				if (i < 90 && squares[i + width].classList.contains("bomb")) total++;
				//Checking SE
				if (i < 90 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb"))
					total++;

				squares[i].setAttribute("data", total);
			}
		}
	}

	createBoard();

	function addFlag(square) {
		if (isGameOver) return;
		if (!square.classList.contains("checked") && flags < bombAmout) {
			if (!square.classList.contains("flag")) {
				square.classList.add("flag");
				square.innerHTML = "🚩";
				flags++;
				increaseFlagCounter(false);
				checkForWin();
			} else {
				square.classList.remove("flag");
				square.innerHTML = "";
				flags--;
				increaseFlagCounter(true);
			}
		}
	}

	function increaseFlagCounter(increase) {
		if (increase) flagsLeft++;
		else flagsLeft--;

		flagCounter.innerHTML = flagsLeft;
	}

	function click(square) {
		if (isGameOver) return;
		if (square.classList.contains("checked") || square.classList.contains("flag")) return;

		if (square.classList.contains("bomb")) {
			gameOver(square);
		} else {
			let total = square.getAttribute("data");
			if (total != 0) {
				square.classList.add("checked");
				square.innerHTML = total;
				return;
			}

			checkSquare(square);
		}
		square.classList.add("checked");
	}

	function checkSquare(square) {
		let currentId = square.id;
		const isLeftEdge = currentId % width === 0;
		const isRightEdge = currentId % width === width - 1;

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 9 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 10) {
				const newId = squares[parseInt(currentId - width)].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 11 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 98 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 90 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 88 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 89) {
				const newId = squares[parseInt(currentId) + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
		}, 10);
	}

	function gameOver(square) {
		console.log("Fim de jogo");
		isGameOver = true;

		squares.forEach((square) => {
			if (square.classList.contains("bomb")) {
				square.innerHTML = "💣";
			}
		});
	}

	function checkForWin() {
		let matches = 0;
		for (let i = 0; i < squares.length; i++) {
			if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
				matches++;
			}
			if (matches === bombAmout) {
				alert("Você ganhou!");
				//Mudar
			}
		}
	}
});

function reset() {
	document.location.reload(true);
}
