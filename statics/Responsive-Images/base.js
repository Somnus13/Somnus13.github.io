//
function getDeviceDpr() {
	return window.devicePixelRatio;
}
function getDeviceViewport(){
	return "Width: " + window.innerWidth +" , Height: "+ window.innerHeight;
}
function init(){
	document.querySelector('.device_msg').innerHTML = "Device DPR: "+getDeviceDpr()+'<br>'+ getDeviceViewport();
}
init();
