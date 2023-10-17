/*
 * Функция дейтпикера в попапе (из jquery-набора point).
 * Выбранная дата отображается в поле ввода field.
 * Для попапа - getModalWindow из main.js.
 */
function makeDatepicker(point, field) {
	let today = new Date();
	let selectedday;
	const monthname = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	
	function showDatepicker() { // создание попапа с дейтпикером
		selectedday = new Date(field.val() ? field.val() : Date.now());
		getModalWindow('dp_popup');
		$('#dp_popup').append('<div></div>');
		renderDatepicker(selectedday.getMonth(), selectedday.getFullYear());
	}
	function dropDatepicker() { // отображение выбранного дня в поле ввода, закрытие дейтпикера вместе с попапом
		field.val(`${selectedday.getFullYear()}-${addZero(selectedday.getMonth() + 1)}-${addZero(selectedday.getDate())}`);
		dropModalWindow();
	}
	function renderDatepicker(month, year) {
		// определение месяца и года для кнопки "на месяц назад"
		let mprev = month - 1;
		let yprev = year;
		if (mprev < 0) {
			mprev += 12;
			yprev--;
		};
		// определение месяца и года для кнопки "на месяц вперед"
		let mnext = month + 1;
		let ynext = year;
		if (mnext > 11) {
			mnext -= 12;
			ynext++;
		}
		let prevdays = (new Date(year, month, 1).getDay() + 6) % 7; // количество дней в первой неделе до 1 числа
		let days = new Date(year, month + 1, 0).getDate(); // количество дней в текущем месяцев
		let weeks = Math.ceil((prevdays + days) / 7); // количество недель (+ неполные) в текущем месяце
		// HTML-строка с версткой календаря
		let hlpstr = '<table><tr class="dp_header"><th><</th><th colspan="5">';
		hlpstr += monthname[month] + ' ' + year;
		hlpstr += '</th><th>></th></th></tr><tr class="dp_week"><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>';
		// для недель - строки tr циклом
		for (let i = 0; i < weeks; i++) {
			hlpstr += '<tr>';
			// для дней в неделе - ячейки td циклом
			for (let j = 1; j < 8; j++) {
				let idx = i * 7 + j;
				if ((idx <= prevdays) || (idx > (prevdays + days))) { // если день не входит в текущий месяц
					hlpstr += '<td class="dp_out"></td>';
				} else { // если день входит в текущий месяц
					// разметка ячейки
					hlpstr += '<td class="dp_range';
					// проверка соответствия данного дня выбранному дню
					if ((selectedday.getFullYear() == year) && (selectedday.getMonth() == month) && (selectedday.getDate() == idx - prevdays)) hlpstr +=' selectedday';
					// проверка соответствия данного дня сегодняшнему
					if ((today.getFullYear() == year) && (today.getMonth() == month) && (today.getDate() == idx - prevdays)) hlpstr +=' today';
					// проверка соответствия данного дня 12 июня (ежегодная дата, год не проверяеется)
					if ((month == 5) && (idx - prevdays == 12)) hlpstr +=' holiday';
					// проверка соответствия данного дня субботе или воскресенью
					if ((j == 6) || (j == 7)) hlpstr +=' weekend';
					// закрытие открывающего тега ячейки
					hlpstr += '">';
					// вставка даты
					hlpstr += idx - prevdays;
					// завершение разметки ячейки
					hlpstr += '</td>';
				}
			}
			// завершение разметки строки
			hlpstr += '</tr>';
		}
		// добавление строки кнопок с фиксированными датами для быстрого выбора
		/* hlpstr += '<tr class="dp_fix"><th colspan="2">Сегодня</th><th colspan="3"></th><th colspan="2">1917-11-07</th></tr>'; */
		// завершение верстки календаря в строке
		hlpstr += '</table>';
		// вставка HTML-строки во вкладыш для календаря в попапе, уничтожение его предыдущего содержимого
		$('#dp_popup > div').html(hlpstr);
		// обработчики клика на кнопки "на месяц назад" и "на месяц вперед"
		$('.dp_header th:first-child').on('click', () => renderDatepicker(mprev, yprev));
		$('.dp_header th:last-child').on('click', () => renderDatepicker(mnext, ynext));
		// обработчики клика на кнопки быстрого выбора и ячейки с днями месяца
		$('.dp_fix th:first-child').on('click', function() { // фиксация выбранной даты и вызов функции скрытия дейтпикера
			selectedday = today;
			dropDatepicker();
		});
		$('.dp_fix th:last-child').on('click', function() { // фиксация выбранной даты и вызов функции скрытия дейтпикера
			selectedday = new Date('1917-11-07');
			dropDatepicker();
		});
		$('.dp_range').on('click', function() { // фиксация выбранной даты и вызов функции скрытия дейтпикера
			selectedday = new Date(year, month, this.innerHTML);
			//if (selectedday.getTime() < today.getTime()) selectedday = today;
			/*
			let hlpday = new Date(year, month, this.innerHTML);
			if (hlpday.getTime() < today.getTime()) {
				return;
			}
			selectedday = hlpday;
			*/
			dropDatepicker();
		});
	}
	
	point.on('click', showDatepicker); // по клику на кнопке или поле ввода - появление и скрытие дейтпикера
}