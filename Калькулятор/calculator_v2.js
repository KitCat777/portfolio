let btnflag = false;
let laststep;
let errorflag = false;
let screenemptyflag = true;
let screenaim;
let memoryaim;
let memory = null;
let actionargument;
let actionsign;
function render(num) {
	if (isNaN(num) || (Math.abs(num) >= 1000000000000)) {
		errorflag = true;
		screenaim.innerHTML = 'ERROR!';
	} else {
		if (Math.abs(num) >= 1) {
			num = num.toPrecision(12);
		} else {
			num = num.toFixed(11);num;
		}
		while (num.match(/\.\d*0$/)) {
			num = num.slice(0, -1);
		}
		if (num.match(/\.$/)) {
			num = num.slice(0, -1);
		}
		screenaim.innerHTML = num;
	}
}
function btn_clear() {
	screenaim.innerHTML = 0;
	screenemptyflag = true;
	errorflag = false;
	memory = null;
	memoryaim.classList.remove('active');
	actionsign = null;
	actionargument = null;
	laststep = 'clear';
}
function btn_ce() {
	if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'point', 'sign', 'MR'].includes(laststep)) {
		screenaim.innerHTML = 0;
		screenemptyflag = true;
	} else if (['div', 'mul', 'min', 'plu'].includes(laststep)) {
		actionsign = null;
		actionargument = null;
	}
	laststep = 'ce';
}
function btn_digit(point) {
	let newdigit = point.innerHTML;
	if (screenemptyflag) {
		if (+newdigit || +screenaim.innerHTML) {
			screenaim.innerHTML = newdigit;
			screenemptyflag = false;
		}
	} else if (screenaim.innerHTML.replace(/\D/g, '').length < 12) {
		screenaim.innerHTML += newdigit;
	}
	laststep = newdigit;
}
function btn_point() {
	if (screenaim.innerHTML.indexOf('.') === -1) {
		screenaim.innerHTML += '.';
		screenemptyflag = false;
	}
	laststep = 'point';
}
function btn_sign() {
	if (screenaim.innerHTML[0] === '-') {
		screenaim.innerHTML = screenaim.innerHTML.slice(1);
	} else {
		screenaim.innerHTML = '-' + screenaim.innerHTML;
	}
	laststep = 'sign';
}
function btn_simple(point) {
	let x = +screenaim.innerHTML;
	switch(point.dataset.action) {
		case '1/x':
		x = 1 / x;
		break;
		case 'squ':
		x *= x;
		break;
		case 'sqr':
		x = Math.sqrt(x);
		break;
	}
	render(x);
	screenemptyflag = true;
	laststep = point.dataset.action;
}
function btn_action(point) {
	if (actionsign) {
		btn_eval();
	}
	actionsign = point.dataset.action;
	actionargument = +screenaim.innerHTML;
	screenemptyflag = true;
	laststep = point.dataset.action;
}
function btn_eval() {
	let res = +screenaim.innerHTML;
	switch(actionsign) {
		case 'plu':
		res += actionargument;
		break;
		case 'min':
		res = actionargument - res;
		break;
		case 'mul':
		res *= actionargument;
		break;
		case 'div':
		res = actionargument / res;
		break;
	}
	actionsign = null;
	actionargument = null;
	render(res);
	screenemptyflag = true;
	laststep = 'eval';
}
function btn_memory(point) {
	switch(point.innerHTML) {
		case 'MR':
		if (memory !== null) {
			if (laststep === 'MR') {
				memory = null;
				memoryaim.classList.remove('active');
			} else {
				render(memory);
				screenemptyflag = true;
			}
			laststep = 'MR';
		}
		break;
		case 'M+':
		if (actionsign) {
			btn_eval();
		}
		if (memory === null) {
			memory = 0;
		}
		memory += +screenaim.innerHTML;
		memoryaim.classList.add('active');
		screenemptyflag = true;
		laststep = 'M+';
		break;
		case 'M-':
		if (actionsign) {
			btn_eval();
		}
		if (memory === null) {
			memory = 0;
		}
		memory -= screenaim.innerHTML;
		memoryaim.classList.add('active');
		screenemptyflag = true;
		laststep = 'M-';
		break;
	}
}
document.addEventListener('DOMContentLoaded', function() {
	screenaim = document.querySelector('.screen');
	memoryaim = document.querySelector('.indicator');
	document.addEventListener('click', function(e) {
		if (btnflag) return;
		btnflag = true;
		if (e.target.classList.contains('button')) {
			if (e.target.classList.contains('clear')) {
				btn_clear();
			} else if (!errorflag) {
				switch(e.target.className.split(' ')[1]) {
					case 'ce':
					btn_ce();
					break;
					case 'memory':
					btn_memory(e.target);
					break;
					case 'simple':
					btn_simple(e.target);
					break;
					case 'digit':
					btn_digit(e.target);
					break;
					case 'action':
					btn_action(e.target);
					break;
					case 'sign':
					btn_sign();
					break;
					case 'point':
					btn_point();
					break;
					case 'eval':
					btn_eval();
					break;
				}
			}
		}
		btnflag = false;
	});
});