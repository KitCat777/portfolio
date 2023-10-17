function makeGallery(gallery) { // функция подключения галереи (аргумент - галерея, обернутая в jQuery)
	let galflag = false;
	let imgs = gallery.find('img');
	let step = imgs.eq(0).width() + parseFloat(imgs.eq(0).css('borderLeftWidth')) + parseFloat(imgs.eq(0).css('borderRightWidth')) + parseFloat(imgs.eq(0).css('marginLeft')) + parseFloat(imgs.eq(0).css('marginRight'));
	gallery.find('.gal_rail').css('width', step * imgs.length + 'px');
	if (gallery.find('.gal_rail').width() - gallery.find('.gal_window').width() >= step) {
		gallery.find('.gal_btn').on('click', function() {
			if (!$(this).hasClass('disabled')) {
				galleryMove(this);
			}
		});
	} else {
		gallery.find('.gal_btn').addClass('disabled');
	}
	imgs.on('click', function() { // подключение переключения главной картинки по клику на маленькую картинку в галерее
		galleryItemShow(this);
	})
	
	function galleryMove(btn) { // функция движения галереи влево/вправо
		if (galflag) return;
		galflag = true;
		let sign = '+=';
		if ($(btn).hasClass('right')) sign = '-=';
		gallery.find('.gal_rail').animate({left: sign + step}, 500, function() {
			gallery.find('.gal_btn.disabled').removeClass('disabled');
			if (gallery.find('.gal_rail').position().left == 0) {
				gallery.find('.gal_btn.left').addClass('disabled');
			} else if (gallery.find('.gal_rail').width() + gallery.find('.gal_rail').position().left - gallery.find('.gal_window').width() < step) {
				gallery.find('.gal_btn.right').addClass('disabled');
			}
			galflag = false;
		});
	}
}

function galleryItemShow(item) { // функция переключения главной картинки по клику на маленькую картинку в галерее
	//$('.mainimagedesk img').attr('src', item.dataset.image);
	$('.mainimagedesk img').attr('src', item.src.replace('_small.', '_mid.'));
}