// JavaScript Documentmobile

 (function (doc, win) { 
   var docEl = doc.documentElement, 
resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', 
recalc = function () { 

var clitWidth="";

var clientWidth = docEl.clientWidth; 

  


if (!clientWidth) return;

 if(clientWidth>640) {
	 
	clitWidth=640;
 }
  if(clientWidth<320) {
	 
	clitWidth=320;
 }
 
 if(clientWidth<=640 && clientWidth>=320) {
	 
	clitWidth=clientWidth;
 }
	   


 docEl.style.fontSize = 10*(clitWidth / 320) + 'px'; };
 
  if (!doc.addEventListener) return; 
  win.addEventListener(resizeEvt, recalc, false); 
  doc.addEventListener('DOMContentLoaded', recalc, false); })(document, window);
  
  