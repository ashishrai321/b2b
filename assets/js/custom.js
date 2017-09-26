// Iterate over each select element
$('.cusSelect select').each(function () {
	
	if($(window).width() < 768 && !$('.loginPane').length) {
		return;
	}

    var $this = $(this),
        numberOfOptions = $(this).children('option').length;

    $this.addClass('s-hidden');

    $this.wrap('<div class="select"></div>');

    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next('div.styledSelect'),
		getEq = (function(){
			if($this.children('option').filter("[selected]").index() > 0){
				return $this.children('option').filter("[selected]").index();
			}else{
				return 0;
			}
		})();
		
    $styledSelect.text($this.children('option').eq(getEq).text()); 

    var $list = $('<ul />', {
        'class': 'options'
    }).insertAfter($styledSelect);
	
    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val() 
        }).appendTo($list);
    }
	
	if($list.children('li').length >= 10){
		var filter = $('<input />', {
			'type':'text',
			'placeholder':'Search..'
		}).prependTo($this.siblings('ul.options'));
		
		filter.keyup(function(){
			var valThis = this.value.toLowerCase(),
				hasLength  = this.value.length;
		
			$list.children('li').each(function () {
				var text  = $(this).text(),
					textL = text.toLowerCase(),
					htmlR = '<span>' + text.substr(0, hasLength) + '</span>' + text.substr(hasLength);
				(textL.indexOf(valThis) == 0) ? $(this).html(htmlR).show() : $(this).hide();
			});
		});
	}

    var $listItems = $list.children('li');
	if(getEq){
		$listItems.eq(getEq).addClass('selected');
	}
    $styledSelect.click(function (e) {
        e.stopPropagation();		
        if($(this).hasClass('active')){
            $(this).removeClass('active').next('ul.options').hide();
			return;
        }
        $(this).toggleClass('active').next('ul.options').toggle();
    });
    $listItems.click(function (e) {
        e.stopPropagation();
		$listItems.removeClass('selected');
        $styledSelect.text($(this).addClass('selected').text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
    });

    $(document).click(function (e) {
		if (!$list.is(e.target) && $list.has(e.target).length === 0) {
			$styledSelect.removeClass('active');
			$list.hide();
			if($list.children('input').length){
				$list.children('input').val('').siblings('li').each(function(index, element) {
					var liText = $(element).text();
					$(element).text(liText);
				}).show(0);
			}
		}
    });

});

// For Popup ////////////////
var $win = $(window), defPad;
function popup_pos(panel, mask){
	if($(panel).hasClass('smFloat') && $win.width() < 768){
		$(panel).find('.popWrapper').css('height', $(panel).height());
	}else{
		$(panel).find('.popWrapper').css('height','');
		defPad = ($win.width() < 768 || $win.height() < 768) ? 20 : 100;
		$(panel).css('max-height', $win.height() - defPad)
		.find('.popWrapper').css('height', $(panel).height());
	}
	if($('#'+mask).length){return};
	$('body').append('<div id='+mask+'></div>');
	$('#'+mask).fadeIn(300, function(){
		if($(panel).hasClass('smFloat') && $win.width() < 768){
			$(panel).addClass('active')	
		}else{
			//alert('1');
			$(panel).fadeIn(1300, function(){
				$(panel).find('.popWrapper').css('overflow-y','');
				popup_pos(panel, mask);
			}).find('.popWrapper').css('overflow-y','hidden');			
		}
	});
	$('body').css('overflow-y', 'hidden');
}
function remove_mask(mask, contentBox){
	$(contentBox).removeClass('active');
	$(mask +','+ contentBox).fadeOut(300 , function() {
		$(mask).remove();
		$('body').css('overflow-y', 'auto');
		$(contentBox).removeAttr('style');
		if($(contentBox).find('.popWrapper').length){
			$(contentBox).find('.popWrapper').removeAttr('style');
		}
	});
}

$(window).on('resize', function() {
	if($('.popup-box').length && $('.popup-box:visible').length && ($('.popup-box').hasClass('active') || $('.popup-box').hasClass('default'))){
		popup_pos($('.popup-box:visible'), 'mask');
	}
});

(function escape_bg(mask, contentBox){
	$(document.body).keyup(function(e) {
		if(e.keyCode == 27  && $('.popup-box:visible').length){
			$('a.close').trigger('click'); 
		}
		//return false;
	})
})('#mask', '.popup-box')

$('body').on('click', '.popup', function(e){	
	defPad = ($win.width() < 768 || $win.height() < 768) ? 20 : 100;
	popup_pos($(this).attr('data-href'), 'mask');
	e.preventDefault();
	return false;
});	

$('a.close').on('click', function() { 
  remove_mask('#mask', '.popup-box:visible');
  return false;
});	

$('body').on('click', '#mask', function() { 
	$('a.close').trigger('click');
});
$('.popup-box').on('click', 'input[value=Cancel], .typeClose', function(){
	$('a.close').trigger('click');
})	

//(function($){
	$.fn.viewportChecker = function(useroptions){
	// Define options and extend with user
	var options = {
			classToAdd: 'visible',
			offset: 100,
			currIndex: 0,
			callbackFunction: function(elem){}
		};
	$.extend(options, useroptions);
	
	// Cache the given element and height of the browser
	var $elem = this,
		windowHeight = $(window).height();
	
		this.checkElements = function(){
			// Set some vars to check with
			var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html'),
				viewportTop = $(scrollElem).scrollTop(),
				viewportBottom = (viewportTop + windowHeight);
		
			$elem.each(function(index){
				
				var $obj = $(this);
				// If class already exists; quit
				if ($obj.hasClass(options.classToAdd)){
					
					return;
				}
				
				// define the top position of the element and include the offset which makes is appear earlier or later
				var elemTop = Math.round( $obj.offset().top ) + options.offset,
					elemBottom = elemTop + ($obj.height());
		
				// Add class if in viewport
				if ((elemTop < viewportBottom) && (elemBottom > viewportTop)){
					$obj.addClass(options.classToAdd);
					currIndex = index;
					// Do the callback function. Callback wil send the jQuery object as parameter
					options.callbackFunction($obj);
				}
			});
		};

	// Run checkelements on load and scroll
		$(window).scroll(this.checkElements);
		this.checkElements();
	
	// On resize change the height var
		$(window).resize(function(e){
			windowHeight = e.currentTarget.innerHeight;
		});
	};
//})(jQuery);


var isInt = function(n) { return parseInt(n) === n };
function runIncrement(start, end, duration, elem){
	
	var start = start || 0,
	end = end || 100,
	duration = duration || 10000,
	framerate = 55,
	elem = $(elem),
	toAdd = (( end - start ) * framerate ) / duration;
	var interval = setInterval(function() {
		var currentValue = Number(elem.html());
		if (currentValue >= end) {
			clearInterval(interval);
			currentValue = end;
			elem.html(isInt(currentValue)?parseInt(currentValue):currentValue.toFixed(1));
			
			return;
		}                                             
		elem.html(isInt(currentValue)?parseInt(currentValue + toAdd):(currentValue + toAdd).toFixed(1));        
	}, framerate);
}

$(document).ready(function() {
	var $typeDoc = $('.typeDoc');
		
	$typeDoc.find('dt').on('click', function(){
		var $this = $(this);
		if($this.hasClass('open')){
			if($this.hasClass('active')){
				$this.next('dd').slideToggle(400, function(){
					$this.removeClass('active');
				})
				return;
			}
			$this.next('dd').slideToggle(400, function(){
				$this.addClass('active');
			});
		}
	})
	
// Input Placeholder text
	$('input, textarea').each(function(index, element) {
		var placeholderText = $(element).attr('placeholder');
		$(element).on('focus', function(){
			$(element).attr('placeholder','');
		})
		$(element).on('blur', function(){
			$(element).attr('placeholder',placeholderText);
		})
	});
	
	if($("#defaultLocationMap").length){
		function initialize() {
		  var mapProp = {
			center:new google.maps.LatLng(28.7041,77.1025),
			zoom:12,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		  };
		  var map=new google.maps.Map(document.getElementById("defaultLocationMap"),mapProp);
		}
		google.maps.event.addDomListener(window, 'load', initialize);
	}
	
	if($("#denonHome").length){
		$("#denonHome").owlCarousel({
			items:1,
			loop:true,
			touchDrag:true,
			nav:true,
			dots:true,
			navText: ["<span class='icon-wrap'></span>","<span class='icon-wrap'></span>"],
			autoplay:true,
			autoplayTimeout:6000,
			animateOut:'fadeOut',			
		});
		$('#bnrBlank').hide(0);
	}
	if($(".itemSlider").length){
		$(".itemSlider").owlCarousel({
			items:4,
			margin:10,
			loop:true,
			touchDrag:true,
			nav:true,
			dots:true,
			navText: ["<span class='icon-wrap'></span>","<span class='icon-wrap'></span>"],
			autoplay:true,
			autoplayTimeout:6000,
			responsiveClass:true,
			responsive:{
				0:{
					items:1,
					loop:false
				},
				768:{
					items:2,
				},
				992:{
					items:3,
				},
				1400:{
					items:4,
				}
			}			
		});
	}
	
// DT collapse////////////////////////////////////////////////
	if($('dl').length){
		$('dd').addClass('hide');
		
		$('dt').each(function(index, element) {
			$(element).on('click', function(){
				if($(element).hasClass('active')){
					$(element).removeClass('active').next('dd').slideUp(600);
					return;
				}
				$(element)
					.addClass('active')
					.next('dd')
					.slideDown(600)
			})
		});
	}
	
	if($('section').length){
		$('section').not('section.auction').viewportChecker({
			classToAdd: 'animated fadeInBottom', // Class to add to the elements when they are visible
			//offset: 10
			callbackFunction: function(elem, action){
				if($('section.animated .counter').length){
					$('.counter').each(function(index, element){
						runIncrement($(element).data('start'), $(element).data('end'), $(element).data('duration'), element);
					});
				}
			}
		}); 
		$('section.auction .txt').viewportChecker({
			classToAdd: 'animated fadeInBottom', // Class to add to the elements when they are visible
			//offset: 10
		}); 
	}
	
	$('header.main').sticky();
	
	$('#btnMenu').on('click', function(){
		var $this = $(this);
		$this.toggleClass('active');
		/*var $this = $(this), $search = $('#topWrapper .search');
		$search.fadeOut(200, function(){
			$this.parent('nav.main').addClass('z5').css('z-index',5);
			$('body, html').css({
				'overflow':'hidden',
				'position':'fixed',
				'top':0,
				'bottom':0,
				'left':0,
				'right':0,
			});
			if($this.hasClass('active')){
				$('body, html').css({
					'overflow':'auto',
					'position':'relative'
				});
				$this.parent('nav.main').removeClass('z5');
				$search.delay(400).fadeIn(0, 'easeInOutQuad', function(){
					$this.parent('nav.main').css('z-index',3);
				})
				
			}
			$this.toggleClass('active');
		})*/
	})
	

})



