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
		screenaim.html('ERROR!');
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
		screenaim.html(num);
	}
}
function btn_clear() {
	screenaim.html(0);
	screenemptyflag = true;
	errorflag = false;
	memory = null;
	memoryaim.removeClass('active');
	actionsign = null;
	actionargument = null;
	laststep = 'clear';
}
function btn_ce() {
	if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'point', 'sign', 'MR'].includes(laststep)) {
		screenaim.html(0);
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
		if (+newdigit || +screenaim.html()) {
			screenaim.html(newdigit);
			screenemptyflag = false;
		}
	} else if (screenaim.html().replace(/\D/g, '').length < 12) {
		screenaim.html(screenaim.html() + newdigit);
	}
	laststep = newdigit;
}
function btn_point() {
	if (screenaim.html().indexOf('.') === -1) {
		screenaim.html(screenaim.html() + '.');
		screenemptyflag = false;
	}
	laststep = 'point';
}
function btn_sign() {
	if (screenaim.html()[0] === '-') {
		screenaim.html(screenaim.html().slice(1));
	} else {
		screenaim.html('-' + screenaim.html());
	}
	laststep = 'sign';
}
function btn_simple(point) {
	let x = +screenaim.html();
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
	actionargument = +screenaim.html();
	screenemptyflag = true;
	laststep = point.dataset.action;
}
function btn_eval() {
	let res = +screenaim.html();
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
				memoryaim.removeClass('active');
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
		memory += +screenaim.html();
		memoryaim.addClass('active');
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
		memory -= screenaim.html();
		memoryaim.addClass('active');
		screenemptyflag = true;
		laststep = 'M-';
		break;
	}
}
$(function() {
	screenaim = $('.screen');
	memoryaim = $('.indicator');
	$(document).on('click', '.button', function(e) {
		if (btnflag) return;
		btnflag = true;
		if ($(e.target).hasClass('clear')) {
			btn_clear();
		} else if (!errorflag) {
			if ($(e.target).hasClass('ce')) {
				btn_ce();
			} else if ($(e.target).hasClass('memory')) {
				btn_memory(e.target);
			} else if ($(e.target).hasClass('simple')) {
				btn_simple(e.target);
			} else if ($(e.target).hasClass('digit')) {
				btn_digit(e.target);
			} else if ($(e.target).hasClass('action')) {
				btn_action(e.target);
			} else if ($(e.target).hasClass('sign')) {
				btn_sign();
			} else if ($(e.target).hasClass('point')) {
				btn_point();
			} else {
				btn_eval();
			}
		}
		btnflag = false;
	});
});