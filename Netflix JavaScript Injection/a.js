/*
 * Subtitless Netflix Tweak: 
 *   1) Switch subtitles on/off on the Netflix controllers
 *   2) Automatic dismiss "Are you still watching" question. (Toogle on Netflix subtitle controllers)
 *   3) Automatic go to "Next episode" (without waiting or clicking on it)
 *
 * Created by Alex M. Sartin
 *
 */

if(window.jQuery){
	loadScript();
}
else{
	var jq = document.createElement('script'); 
	jq.type = 'text/javascript';
	jq.src = 'https://code.jquery.com/jquery-1.8.3.min.js';
	document.getElementsByTagName('head')[0].appendChild(jq);

	var timer0 = setInterval(function(){
		if(window.jQuery){
			clearInterval(timer0);
			loadScript();
		}
	}, 100);
}

function loadScript(){
	if ( typeof subtitles === 'undefined'){
		googleAnalytics();
		button='.player-timed-text-tracks lh:first';
		button2='.player-timed-text-tracks lh:eq(2)';
		ao='ol.AO';
		myTimer=0, countS=0, bound=0, subtitles=1, start=0, alwaysOn=0, wait=0;
		cor=["#0c345f", "#002349", "#782c2c", "#5f0c0c"];
		loadPopup();
		jQuery('head').append('<style>.toast-container{margin-top: 80px;position:fixed;top:0;left: 50%;z-index: 9999;font-size:18px;font-weight: bold;} \
		.toast{line-height: 30px;padding: 5px 10px 5px 10px;border: 1px solid transparent;border-radius: 10px;text-align: center;-webkit-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);-moz-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);-o-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);} \
		.toast.info{border-color: #d4e2ea;color: #307fa3;background-color: #d9edf7;} \
		.toast.danger{border-color: #B92D3F;color: #be4843;background-color: #f2dede;} \
		.toast.default {color: #333;background-color: #fff;border-color: #ccc;} \
		.toast.show {color: #333;background-color: #fff;border-color: #ccc;} \
		.AO{padding-left: 0px !important;padding-right: 0px !important;text-align: center !important;line-height: 2em !important;} \
		ol.AO{border-bottom: 3px solid #1e1e1e;} \
		#sub{line-height: 1.8em;}</style>');
		checkButton();
	}
	else if(bound){
		toggleElem(button2);
	}
}	

function checkButton() {
	if ( jQuery(button).length > 0 ) { 
		if(!bound){
			bound=1;
			$(document).off('DOMNodeInserted', '#player-menu-track-settings');
			wait=0;
			boundButton();
			if(!start){
				start=1;
				toggleElem(button2);
				toggleElem(ao);
			}
		}
	}
	else{
		setTimeout(function () { //wait a little to continue
			if ( jQuery(button).length == 0 ){ //double checking :)
				bound=false;
				console.log('Waiting for interface');
				if(!wait){
					wait=1;
					$(document).on('DOMNodeInserted', '#player-menu-track-settings', function () {
						checkButton();
					});
				}
			}
		}, 2000);
	}
}

function boundButton() {
	setInterval(function(){ checkButton(); }, 5000);
	console.log('Subtitle Tweak added');
	$('.player-next-episode').click(function() {
		showMessage('Next Episode...')
	});
	jQuery(button).text('');
	jQuery(button).prepend('<div id="sub">oi</div>');
	jQuery('ol.player-timed-text-tracks, ol.player-audio-tracks').css({"padding-bottom":"0px", "padding-top":"0px"});
	jQuery('.player-timed-text-tracks').find('lh:first').css({"display":"block", "text-align":"center"});
	jQuery('.player-timed-text-tracks').prepend('<ol class="AO"><lh class="AO">Still Watching </lh><lh class="AO status1"></lh></ol>');

	applyButton(button2, subtitles);
	applyButton(ao, alwaysOn);
			
	jQuery(button2).click(function() {
		subtitles=!subtitles;
		applyButton(button2, subtitles);
		if(subtitles){
			showMessageOn();
			jQuery('#hideSubs').remove();
		}
		else{
			showMessageOff();
			jQuery('head').append('<link href="https://alexsartin.pancakeapps.com/netflix/a.css" rel="stylesheet" id="hideSubs" />');
		}
	});
	
	jQuery(ao).click(function() {
		alwaysOn=!alwaysOn;
		applyButton(ao, alwaysOn);
		if(alwaysOn){
			$(document).on('DOMNodeInserted', '.player-autoplay-interrupter', function () {
				console.log('"Still here" Detected!')
				$('.continue-playing:first').click();
			});
			$(document).on('DOMNodeInserted', '.player-postplay-show-autoplay', function () {
				$('.player-postplay-still-hover-container').click();
				showMessage('Next Episode...');
			});
		}
		else{
			$(document).off('DOMNodeInserted', '.player-autoplay-interrupter');
			$(document).off('DOMNodeInserted','.player-postplay-show-autoplay');	
		}
	});
}

function applyButton(elem, opt) {
	if(elem==button2)
		$('#sub').html('Subtitles '+ (opt?'ON &nbsp':'OFF'));
	else if(elem==ao)
		$('lh.status1').html(opt?'ON &nbsp':'OFF');
	opt=opt?1:3;
	applyButtonColor(elem,opt);
	applyButtonRover(elem,opt-1,opt);	
}

function toggleElem(elem) {
	jQuery(elem).click();
	jQuery(elem).trigger('mouseleave');
}

function applyButtonColor(elem, index) {
	jQuery(elem).css({"background-color": cor[index]});
}

function applyButtonRover(elem, index1, index2) {
	jQuery(elem).hover(
		function() {
			jQuery(this).css({"background-color": cor[index1] });
		}, function() {
			jQuery(this).css({"background-color": cor[index2] });
		}
	);
}

function showMessageOff() {
	jQuery.toast.danger({
		text: 'Subtitles Off!',
		opacity: 0.6,
		duration: 2000,
		speed: 'slow'
	});
}

function showMessageOn() {
	jQuery.toast.info({
		text: 'Subtitles On!',
		opacity: 0.6,
		duration: 1500,
	});
}

function showMessage(str) {
	jQuery.toast.show({
		text: str,
		duration: 5500,
		speed: 'slow',
		opacity: 0.6,
		width: "180px",
	});
}

function googleAnalytics() {
	gdata =  "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){"+
			 "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"+
			 "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"+
			 "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');"+
			 "ga('create', 'UA-62460232-2', 'auto');"+
			 "ga('send', 'pageview');</script>";
			
	jQuery('head').append(gdata);
}

//*****************************************  eatoast.js  *****************************************//
function loadPopup(){
!function(a){function d(b){var d,c={duration:3e3,text:"",container:document.body,color:"#333",background:"#F5F5F5",border:"none",style:"",autoclose:!0,closeBtn:!1,width:"auto",animate:"fade",align:"top",speed:"fast",opacity:.9,position:"20%"};return b=a.isPlainObject(b)?a.extend(c,b):"string"===a.type(b)?a.extend(c,{text:b}):c,b.animate=b.animate.toLowerCase(),b.width="number"==typeof b.width?b.width+"px":b.width,b.align="top"===b.align.toLowerCase()?"top":"bottom",d=b.container===document.body?a(window).height:a(b.container).height(),"string"===a.type(b.position)?(-1===b.position.indexOf("%")&&(b.position=100*(parseInt(b.position)/d)>>0),b.position=isNaN(b.position)?"20%":b.position.toString()):a.isNumber(b.position)&&(b.position=100*(b.position/d)>>0),b}function e(a,b){var d,e,c=function(){};switch(b.animate){case"slide":d={opacity:0,top:"top"===b.align?0:"100%"},e={opacity:b.opacity,top:"top"===b.align?b.position:100-parseInt(b.position)+"%"},a.css(d).show().css({"margin-left":-a.width()/2+"px"}).animate(e,b.speed),c=function(){a.animate(d,b.speed,function(){a.remove()})};break;case"fade":default:a.css({opacity:0,top:"top"===b.align?b.position:100-parseInt(b.position)+"%"}).show().css({"margin-left":-a.width()/2+"px"}).animate({opacity:b.opacity}),c=function(){a.fadeOut(b.speed,function(){a.remove()})}}a.find(".close").click(function(){c()}),b.autoclose&&setTimeout(function(){c()},b.duration)}var b={},c='<div class="toast"><button class="close">&times;</button><span class="messageA">{{text}}</span></div>';b.show=function(b){b=d(b);var f=c.replace("{{text}}",b.text.toString()),g=a(f).appendTo(a(b.container)).hide(),h=g.wrap('<div class="toast-container"></div>').parent().hide();return b.style?g.addClass(b.style):g.css({color:b.color,background:b.background,border:b.border,width:b.width}),!b.closeBtn&&g.find(".close").hide(),g.show(),h.css(b.align,b.position),e(h,b),h},a.each(["default","success","info","warn","danger"],function(c,d){b[d]=function(c){var e;return a.isPlainObject(c)?(e=c,e.style=d):"string"===a.type(c)&&(e={style:d,text:c}),b.show(e)}}),a.extend({toast:b})}(jQuery);
}