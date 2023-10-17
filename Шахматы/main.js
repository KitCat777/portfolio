/* constants */
const FIGURESYMBOL = { // набор изображений фигур
	king: {
		white: '&#9812;',
		black: '&#9818;'
	},
	queen: {
		white: '&#9813;',
		black: '&#9819;'
	},
	rook: {
		white: '&#9814;',
		black: '&#9820;'
	},
	bishop: {
		white: '&#9815;',
		black: '&#9821;'
	},
	knight: {
		white: '&#9816;',
		black: '&#9822;'
	},
	pawn: {
		white: '&#9817;',
		black: '&#9823;'
	}
};
const FIGUREMOVE = { // набор ходов и боев фигур
	king(a, b) {
		return (Math.abs(a.x - b.x) <= 1) && (Math.abs(a.y - b.y) <= 1);
	},
	queen(a, b) {
		return FIGUREMOVE.rook(a, b) || FIGUREMOVE.bishop(a, b);
	},
	rook(a, b) {
		if ((a.x == b.x) || (a.y == b.y)) {
			if (Math.abs(a.x - b.x + a.y - b.y) == 1) {
				return true;
			}
			if (a.x == b.x) {
				if (a.y < b.y) {
					start = a.y + 1;
					stop = b.y;
				} else {
					start = b.y + 1;
					stop = a.y;
				}
				for (let i = start; i < stop; i++) {
					if (checkFigureInCell(getCellByIndex(a.x, i))) return false;
				}
			} else {
				if (a.x < b.x) {
					start = a.x + 1;
					stop = b.x;
				} else {
					start = b.x + 1;
					stop = a.x;
				}
				for (let i = start; i < stop; i++) {
					if (checkFigureInCell(getCellByIndex(i, a.y))) return false;
				}
			}
			return true;
		} else {
			return false;
		}
	},
	bishop(a, b) {
		if ((a.x + a.y == b.x + b.y) || (a.x - a.y == b.x - b.y)) {
			if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 2) {
				return true;
			}
			if (a.x + a.y == b.x + b.y) {
				if (a.x > b.x) {
					start = b.x + 1;
					stop = a.x;
				} else {
					start = a.x + 1;
					stop = b.x;
				}
				for (let i = start; i < stop; i++) {
					if (checkFigureInCell(getCellByIndex(i, a.x + a.y - i))) return false;
				}
			} else {
				if (a.x > b.x) {
					start = b.x + 1;
					stop = a.x;
				} else {
					start = a.x + 1;
					stop = b.x;
				}
				for (let i = start; i < stop; i++) {
					if (checkFigureInCell(getCellByIndex(i, i - b.x + b.y))) return false;
				}
			}
			return true;
		} else {
			return false;
		}
	},
	knight(a, b) {
		return ((Math.abs(a.x - b.x) == 1) && (Math.abs(a.y - b.y) == 2)) || ((Math.abs(a.x - b.x) == 2) && (Math.abs(a.y - b.y) == 1));
	},
	whitepawngo(a, b) {
		return false; // дописать
	},
	blackpawngo(a, b) {
		return false; // дописать
	},
	whitepawnbeat(a, b) {
		return false; // дописать
	},
	blackpawnbeat(a, b) {
		return false; // дописать
	},
	castling(a, b) { // при успешной проверке - здесь переставить ладью
		return false; // дописать
	},
};

/* variables */
let figureset = []; // коллекция фигур, стоящих сейчас на доске
let startpos = [ // описание начальной расстановки фигур (без пешек - дописать)
	['king','white','e1'],
	['king','black','e8'],
	['queen','white','d1'],
	['queen','black','d8'],
	['rook','white','a1'],
	['rook','black','a8'],
	['rook','white','h1'],
	['rook','black','h8'],
	['bishop','white','c1'],
	['bishop','black','c8'],
	['bishop','white','f1'],
	['bishop','black','f8'],
	['knight','white','b1'],
	['knight','black','b8'],
	['knight','white','g1'],
	['knight','black','g8']
]

/* main */
$(function() {
	startpos.forEach(item => { // расстановка фигур на доске
		let figure = new ChessFigure(...item);
		figure.render();
		figureset.push(figure); // выставленная фигура добавляется в коллекцию всех фигур на доске
	});
	$(document).on('click', 'td', function(e) { // обработка клика по полю на доске
		useCell(e.target);
	});
});

/* functions */
function getChessCoords(cell) { // получение шахматного имени клетки
	let x = 'abcdefgh'[$(cell).parent().find('td').index(cell)];
	let y = 9 - $('tr').index(cell.parentElement);
	return x + y;
}
function getCellIndex(cell) { // получение числовых координат клетки
	let x = $(cell.parentElement.children).index(cell);
	let y = $('tr').index(cell.parentElement);
	return {x: x, y: y};
}
function getCellByChessCoords(str) { // получение клетки по шахматному имени
	let x = 'abcdefgh'.indexOf(str[0]);
	let y = 9 - str[1];
	return $('tr').eq(y).find('td')[x];
}
function getCellByIndex(x, y) { // получение клетки по координатам
	return $('tr').eq(y).find('td')[x + 1];
}
function useCell(cell) { // обработчик клика по клетке
	if ($(cell).hasClass('cellfrom')) { // если клик по стартовому полю, то отмена хода
			$(cell).removeClass('cellfrom');
	} else if ($('.cellfrom').length) { // при наличии стартового поля
		if (canIMove(cell)) { // при возможности сделать ход
			getFigure($('.cellfrom')[0]).changePos(cell); // делаем ход
		}
		$('.cellfrom').removeClass('cellfrom'); // убирается пометка стартового поля
	} else { // при отсутствии стартового поля
		if (checkFigureInCell(cell)) $(cell).addClass('cellfrom'); // кликнутое поле становится стартовым, если на нем есть фигура
	}
}
function checkFigureInCell(cell) { // проверка, пуста ли клетка
	return !!$(cell).html();
}
function canIMove(cell) { // проверка, можно ли сюда делать ход (и бой)
	let figure = getFigure($('.cellfrom')[0]);
	let aim = getFigure(cell);
	if ((!aim) || (aim.color != figure.color)) { // если поле пустое или на нем фигура другого цвета
		if ((figure.name != 'pawn') && (figure.name != 'king')) {
			return FIGUREMOVE[figure.name](getCellIndex($('.cellfrom')[0]), getCellIndex(cell));
		}
		if (figure.name == 'king') {
			return FIGUREMOVE[figure.name](getCellIndex($('.cellfrom')[0]), getCellIndex(cell)) || FIGUREMOVE['castling'](getCellIndex($('.cellfrom')[0]), getCellIndex(cell));
		}
		if (figure.color == 'white') {
			return FIGUREMOVE['whitepawngo'](getCellIndex($('.cellfrom')[0]), getCellIndex(cell)) || FIGUREMOVE['whitepawnbeat'](getCellIndex($('.cellfrom')[0]), getCellIndex(cell));
		} else {
			return FIGUREMOVE['blackpawngo'](getCellIndex($('.cellfrom')[0]), getCellIndex(cell)) || FIGUREMOVE['blackpawnbeat'](getCellIndex($('.cellfrom')[0]), getCellIndex(cell));
		}
	}
	return false;
}
function getFigure(cell) { // получение фигуры из клетки (считается, что она там точно есть)
	return figureset.filter(item => item.position === getChessCoords(cell))[0];
}
function checkConvert(figure) { // функция превращения пешки
	if ((this.color = 'white') && (this.position[1] == '8') || (this.color = 'black') && (this.position[1] == '1')) {
		if (confirm('Ваша пешка достигла последней линии и может превратиться. Превращаем ее в ферзя?')) {
			this.name = 'queen';
		} else if (confirm('Превращаем ее в ладью?')) {
			this.name = 'rook';
		} else if (confirm('Превращаем ее в слона?')) {
			this.name = 'bishop';
		} else {
			alert('Ну значит будет конь.')
			this.name = 'knight';
		}
	}
}

/* classes */
class ChessFigure { // каждый объект класса - шахматная фигура (с названием, цветом, позицией на доске)
	constructor(name, color, position){
		this.name = name;
		this.color = color;
		this.position = position.toLowerCase();
		this.firststep = true;
	}
	render(){ // отрисовка фигуры на доске (если здесь стояла другая фигура, то она убирается)
		$(getCellByChessCoords(this.position)).html(FIGURESYMBOL[this.name][this.color]);
	}
	clear(){ // удаление фигуры с доски
		$(getCellByChessCoords(this.position)).html('');
	}
	changePos(cell){ // перестановка фигуры на новое поле (в том числе и с боем)
		this.firststep = false;
		this.clear();
		if (checkFigureInCell(cell)) {
			let aim = getFigure(cell);
			figureset = figureset.filter(item => item !== aim);
		}
		this.position = getChessCoords(cell);
		if (this.name == 'pawn') checkConvert(this);
		this.render();
	}
}
