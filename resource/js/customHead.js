// Lib

// Swipe - Start 
$.fn.touchwipe = function(settings) {
 var config = {
		min_move_x: 20,
		min_move_y: 20,
		wipeLeft: function() { },
		wipeRight: function() { },
		wipeUp: function() { },
		wipeDown: function() { },
		preventDefaultEvents: true
 };
 
 if (settings) $.extend(config, settings);

 this.each(function() {
	 var startX;
	 var startY;
	 var isMoving = false;

	 function cancelTouch() {
		 this.removeEventListener('touchmove', onTouchMove);
		 startX = null;
		 isMoving = false;
	 }	
	 
	 function onTouchMove(e) {
		 if(config.preventDefaultEvents) {
			 e.preventDefault();
		 }
		 if(isMoving) {
			 var x = e.touches[0].pageX;
			 var y = e.touches[0].pageY;
			 var dx = startX - x;
			 var dy = startY - y;
			 if(Math.abs(dx) >= config.min_move_x) {
				cancelTouch();
				if(dx > 0) {
					config.wipeLeft();
				}
				else {
					config.wipeRight();
				}
			 }
			 else if(Math.abs(dy) >= config.min_move_y) {
					cancelTouch();
					if(dy > 0) {
						config.wipeDown();
					}
					else {
						config.wipeUp();
					}
				 }
		 }
	 }
	 
	 function onTouchStart(e)
	 {
		 if (e.touches.length == 1) {
			 startX = e.touches[0].pageX;
			 startY = e.touches[0].pageY;
			 isMoving = true;
			 this.addEventListener('touchmove', onTouchMove, false);
		 }
	 }    	 
	 if ('ontouchstart' in document.documentElement) {
		 this.addEventListener('touchstart', onTouchStart, false);
	 }
 });

 return this;
};
// Swipe - End 

if(window.orientation){
	if(orientation == -90 || orientation == 90) {
		$('html').removeClass('orPortrait');
		$('html').addClass('orLandscape');
	}else{
		$('html').removeClass('orLandscape');
		$('html').addClass('orPortrait');
	}
}
window.addEventListener("orientationchange", function() {
	if(orientation == -90 || orientation == 90) {
		$('html').removeClass('orPortrait');
		$('html').addClass('orLandscape');
	}else{
		$('html').removeClass('orLandscape');
		$('html').addClass('orPortrait');
	}
}, false);

function show(){
	$('body').append('<div id="loadingMask"></div>').css('overflow','hidden');
	$('#loadingMask').fadeIn(300);
}
function hide(){
   $('#loadingMask').fadeOut(300 , function() {
		$('#loadingMask').remove();
		$('body').css('overflow-y','scroll');
	});
	return false;
}