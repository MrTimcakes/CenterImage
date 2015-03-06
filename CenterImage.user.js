// ==UserScript==
// @name          Center Image
// @namespace     CenterImage
// @author        MrTimcakes AKA Ducky <Ducke.uk>
// @version       2.0
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

var images = document.images;
if(!images || images.length !== 1 || images[0].src !== location.href){return false;}

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

document.head.innerHTML = "<style>html{overflow:auto!important}body{background:url(data:image/png;base64,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) repeat scroll 0 0 #222!important;text-align:center!important;color:#EEE!important}img{border:medium solid #272727!important;margin:0 auto!important;position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important}img.zoom-in{cursor:-moz-zoom-in;cursor:-webkit-zoom-in!important;cursor:zoom-in}img.zoom-out{cursor:-moz-zoom-out;cursor:-webkit-zoom-out!important;cursor:zoom-out}img.drag{cursor:move!important}</style>"; // center image