// ==UserScript==
// @name          Center Image
// @namespace     CenterImage
// @author        MrTimcakes AKA Ducky <Ducke.uk>
// @version       1.2
// @updateURL     https://openuserjs.org/install/MrTimcakes/Center_Image.user.js
// @downloadURL   https://openuserjs.org/install/MrTimcakes/Center_Image.user.js
// @homepage      https://github.com/MrTimcakes/CenterImage
// @description   Centers images in both directions when opened directly in the browser.
// @icon          https://raw.githubusercontent.com/MrTimcakes/CenterImage/master/Icon48.png
// @icon64        https://raw.githubusercontent.com/MrTimcakes/CenterImage/master/Icon64.png
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @noframes
// @run-at        document-start
// @include       *
// @include       file:///*
// ==/UserScript==

function $(id) {return document.getElementById(id);}

"undefined"!==typeof GM_registerMenuCommand&&GM_registerMenuCommand("Center Image Configuration",cfg,"c");

function cfg(){
	if(typeof GM_setValue !== "undefined")
	{
		function saveCfg()
		{
			GM_setValue("bgColor", $("bgColor").value);
			GM_setValue("fitBoth", $("fitBoth").checked);
			GM_setValue("fitEither", $("fitEither").checked);
			GM_setValue("fitSmaller", $("fitSmaller").checked);
			GM_setValue("js", $("customJs").value);
			alert("Configuration Saved");
			if($("bgColor").value){document.body.bgColor = $("bgColor").value;}else{document.body.removeAttribute("bgColor");}
		}
		if(img){img.removeEventListener("click", rescale, true);}
		window.removeEventListener("keydown", onkeydown, true);
		if(document.head){document.head.innerHTML = "";}
		document.body.innerHTML = '<style>@import "http://fonts.googleapis.com/css?family=Raleway";body{background-color:#DDD}main{background-color:#64C8FA;border:1px solid #AAA;font-family:"Raleway",sans-serif;text-align:center;margin:0 auto;padding:0 50px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}#options{text-align:left}input{display:inline-block}p{margin-bottom:2.5px}label[for="customJs"]{display:block;text-align:center}textarea{display:block;margin:0 auto;margin-bottom:5px}#save{display:block;text-align:center;margin:0 auto;margin-bottom:5px}</style><main>\n<h1>Configuration</h1>\n<div id="options">\n<label for="bgColor">Background Color: </label><input id="bgColor" type="color" /><br>\n<p>Fit images to window if:</p>\n<input type="checkbox" id="fitBoth" /><label for="fitBoth">Larger than window in both width and height</label><br>\n<input type="checkbox" id="fitEither" /><label for="fitEither">Larger than window in width or height</label><br>\n<input type="checkbox" id="fitSmaller" /><label for="fitSmaller">Smaller than window</label><br>\n<label for="customJs">Custom javascript:</label>\n<textarea id="customJs" cols="45" rows="5"></textarea>\n<button id="save">Save Configuration</button>\n</div>\n</main>';
      
		$("bgColor").value = GM_getValue("bgColor", "");
		$("fitBoth").checked = GM_getValue("fitBoth", true);
		$("fitEither").checked = GM_getValue("fitEither", true);
		$("fitSmaller").checked = GM_getValue("fitSmaller");
		$("customJs").value = GM_getValue("js", "");
		$("save").addEventListener("click", saveCfg, true);
	}
	else{
		alert("Sorry, Chrome userscripts in native mode can't have configurations! Install TamperMonkey extension. (it's very good)");
	}
}

var bgColor;
var fitBoth = true;
var fitEither = true;
var fitSmaller;
var customJs;
if(typeof GM_getValue !== "undefined")
{
	bgColor = GM_getValue("bgColor");
	fitBoth = GM_getValue("fitBoth", true);
	fitEither = GM_getValue("fitEither", true);
	fitSmaller = GM_getValue("fitSmaller");
	customJs = GM_getValue("js", "");
}

var images = document.images;
if(!images || images.length !== 1 || images[0].src !== location.href){return false;}
var rescaled = false;
var iot = 0, iol = 0;
var img = images[0];

function makeimage()
{
	if(bgColor){
		document.body.bgColor = bgColor;
		if(document.head){document.head.innerHTML = "";} // remove FireFox background
	}
	document.body.innerHTML = "<style>img { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }</style>"; // center image
	img.id = "resizing";
	img.style.margin = "auto"; // center image
	document.body.style.margin = "0px";
	document.body.appendChild(img);
	img.addEventListener("mousedown", onmousedown, true);
	img.addEventListener("click", rescale, true);
	window.addEventListener("keydown", onkeydown, true);
	window.addEventListener("resize", onresize, true);
	autoresize();
}

function onresize(){
	if(rescaled)
	{
		rescaled = false;
		rescale();
	}
}

function changecursor(){
	img.style.margin = "auto";
	var root = document.compatMode=='BackCompat'? document.body : document.documentElement;
	var CH = root.clientHeight;
	if(CH == 0){CH = document.compatMode=='BackCompat'? document.documentElement.clientHeight : document.body.clientHeight;} // StupidFox
	if(!rescaled && ((img.naturalHeight == CH) || (img.naturalWidth == root.clientWidth)) && ((CH == root.scrollHeight) && (root.clientWidth == root.scrollWidth)) ){
		img.style.cursor = "";
	}
	if((img.naturalHeight > CH) || (img.naturalWidth > root.clientWidth)){
		if(rescaled){
			img.style.cursor = "-moz-zoom-in";
			img.style.cursor = "-webkit-zoom-in";
		}
		else{
			img.style.cursor = "-moz-zoom-out";
			img.style.cursor = "-webkit-zoom-out";
		}
	}else{
		if(rescaled){
			img.style.cursor = "-moz-zoom-out";
			img.style.cursor = "-webkit-zoom-out";
		}
		else{
			img.style.cursor = "-moz-zoom-in";
			img.style.cursor = "-webkit-zoom-in";
		}
	}
}

function onmousedown(event){
	if(img.offsetLeft > 0){iol = img.offsetLeft;}
	if(img.offsetTop > 0){iot = img.offsetTop;}
}

function rescale(event){
	if(rescaled)
	{
		rescaled = false;
		var scale;
		if(event != 0)
		{
			if(typeof event.y === "undefined") // Firefox
			{
				ex = event.clientX;
				ey = event.clientY;
			}
			else{
				ex = event.x;
				ey = event.y;
			}
			ex -= iol;
			ey -= iot;
			scale = Math.min((window.innerWidth / img.naturalWidth), (window.innerHeight / img.naturalHeight));
		}
		img.removeAttribute("style");
		img.removeAttribute("width");
		img.removeAttribute("height");
		changecursor();
		if(event != 0){
			window.scrollTo(ex / scale - window.innerWidth / 2, ey / scale - window.innerHeight / 2);
		}
	}
	else{
		img.removeAttribute("width");
		img.removeAttribute("height");
		img.removeAttribute("style");
		if(img.naturalWidth != window.innerWidth)
		{
			img.style.width = window.innerWidth + "px";
			rescaled = true;
		}
		var root = document.compatMode=='BackCompat'? document.body : document.documentElement;
		if((root.scrollHeight != root.clientHeight) || (root.scrollWidth != root.clientWidth))
		{
			img.removeAttribute("style");
			if(img.naturalHeight != window.innerHeight)
			{
				img.style.height = window.innerHeight + "px";
				rescaled = true;
			}
		}
		changecursor();
	}
}

function autoresize(){
	if(img.naturalWidth != 0) // stupidfox
	{
		var link = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = img.src;
		document.head.appendChild(link); // favicon
		var title = img.src.substr(img.src.lastIndexOf("/")+1);
		if(title.indexOf("?") != -1){
			title = title.substr(0, title.indexOf("?"));
		}
		document.title = title + " (" + img.naturalWidth + "x" + img.naturalHeight + ")"; // title
		
		var root = document.compatMode=='BackCompat'? document.body : document.documentElement;
		if(img.naturalHeight > root.clientHeight && img.naturalWidth > root.clientWidth){
			rescaled = true;
			if(!fitBoth){
				rescale(0);
			}
			else{
				changecursor();
			}
		}
		else if(img.naturalHeight > root.clientHeight || img.naturalWidth > root.clientWidth){
			rescaled = true;
			if(!fitEither){
				rescale(0);
			}
			else{
				changecursor();
			}
		}
		else{
			if(fitSmaller){
				rescale(0);
			}
			else{
				changecursor();
			}
		}
		if(customJs){eval(customJs);}
	}
	else{
		setTimeout(function() { autoresize(); }, 10);
	}
}

// hotkeys
if(typeof KeyEvent === "undefined"){
	var KeyEvent = {
		DOM_VK_SPACE: 32,
		DOM_VK_LEFT: 37,
		DOM_VK_UP: 38,
		DOM_VK_RIGHT: 39,
		DOM_VK_DOWN: 40,
		DOM_VK_A: 65,
		DOM_VK_D: 68,
		DOM_VK_P: 80,
		DOM_VK_Q: 81,
		DOM_VK_S: 83,
		DOM_VK_W: 87,
		DOM_VK_NUMPAD2: 98,
		DOM_VK_NUMPAD4: 100,
		DOM_VK_NUMPAD5: 101,
		DOM_VK_NUMPAD6: 102,
		DOM_VK_NUMPAD8: 104
	};
}

function cancelEvent(a){
	a = a ? a : window.event;
	if(a.stopPropagation){
		a.stopPropagation();
	}
	if(a.preventDefault){
		a.preventDefault();
	}
	a.cancelBubble = true;
	a.cancel = true;
	a.returnValue = false;
	return false;
}

function scroll_space(a, b){
	var by = Math.round((b ? window.innerHeight : window.innerWidth) * 0.50 * (a ? -1 : 1));
	if(!b)
	{
		window.scrollBy(0, by);
	}
	else{
		window.scrollBy(by, 0);
	}
}

function onkeydown(b){
	var a = (window.event) ? b.keyCode : b.which;
	
	if(a != KeyEvent.DOM_VK_SPACE && (b.altKey || b.ctrlKey || b.metaKey))
	{
		return;
	}
	
	var by = Math.round(window.innerHeight * 0.10);
	
	switch (a)
	{
	case KeyEvent.DOM_VK_RIGHT:
	case KeyEvent.DOM_VK_D:
	case KeyEvent.DOM_VK_NUMPAD6:
		window.scrollBy(by, 0);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_LEFT:
	case KeyEvent.DOM_VK_A:
	case KeyEvent.DOM_VK_NUMPAD4:
		window.scrollBy(by * -1, 0);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_W:
	case KeyEvent.DOM_VK_NUMPAD8:
		window.scrollBy(0, by * -1);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_S:
	case KeyEvent.DOM_VK_NUMPAD2:
		window.scrollBy(0, by);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_SPACE:
		scroll_space(b.shiftKey, b.ctrlKey);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_Q:
	case KeyEvent.DOM_VK_NUMPAD5:
		rescale(0);
		cancelEvent(b);
		break;
	case KeyEvent.DOM_VK_P:
		cfg();
		cancelEvent(b);
	}
}
	
makeimage();