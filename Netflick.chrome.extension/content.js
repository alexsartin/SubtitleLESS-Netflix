chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      loadScript();
    }
  }
);

$(document).on('DOMNodeInserted', '#netflix-player-font-wrapper', function () {
	$(document).off('DOMNodeInserted', '#netflix-player-font-wrapper');
	showMessage('Netflick activated!'); 
});

console.log("Loading Netflick")
loadScript();

function loadScript(){
	if ( typeof subtitles === 'undefined'){
		googleAnalytics();
		button='.player-timed-text-tracks lh';
		button2='.player-timed-text-tracks lh:eq(2)';
		ao='ol.AO';
		myTimer=0, countS=0, bound=false, subtitles=1, alwaysOn=0, start=0, wait=0;
		cor=["#0c345f", "#002349", "#782c2c", "#5f0c0c"];
		setMyInterval(checkButton, 7000);
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
	console.log('Subtitle Tweak added');
	$('.player-next-episode').click(function(){ showMessage('Next Episode...') });
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
			jQuery('head').append('<link href='+ chrome.extension.getURL('a.css') +' rel="stylesheet" id="hideSubs">');
		}
	});
	
	jQuery(ao).click(function() {
		alwaysOn=!alwaysOn;
		applyButton(ao, alwaysOn);
		if(alwaysOn){
			$(document).on('DOMNodeInserted', '.player-autoplay-interrupter', function () {
				alert('"Still here" Detected!')
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

function setMyInterval(callback, delayms) {
	myTimer=setInterval(function(){ callback(); }, delayms);
}

function googleAnalytics() {
	gdata =  "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){"+
			"(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"+
			"m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"+
			"})(window,document,'script','//www.google-analytics.com/analytics.js','ga');"+
			"ga('create', 'UA-62460232-3', 'auto');"+
			"ga('send', 'pageview');</script>";
	jQuery('head').append(gdata);
}