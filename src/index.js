import { Fireworks, Star } from './fireworks-js/fireworks.js';
const app = document.querySelector('#app');
const sky = document.querySelector('#sky');
const hud = document.querySelectorAll('.hud');
const dD = document.querySelector('#dD');
const dH = document.querySelector('#dH');
const dM = document.querySelector('#dM');
const dS = document.querySelector('#dS');
const tT = document.querySelector('#tT');
const tY = document.querySelector('#tY');

function st(){
    const current = new Date();
    const delta = target.getTime() - current.getTime();
    
    if(delta >= 0){
        tT.innerHTML = 'Time Relative to';
    }else{
        tT.innerHTML = 'Time Elapsed in';
    }
    delta = Math.abs(delta);
    
    dS.innerHTML = Math.floor((delta / (1000)) % 60);
    dM.innerHTML = Math.floor((delta / (60000)) % 60);
    dH.innerHTML = Math.floor((delta / (3600000)) % 24);
    dD.innerHTML = Math.floor((delta / (86400000)));
}

function sk(){
    const current = new Date();
    
    var gauss = Math.exp(-(Math.pow(((current.getHours() * 60 + current.getMinutes()) - 720), 2) / (2 * Math.pow((60 * Math.PI), 2))));
    var txc = Math.floor(255 - 255 * gauss);
    sky.style.opacity = gauss;
    hud.forEach((item, index) => {item.style.color = 'rgb('+txc+','+txc+','+txc+')'});
}

const fireworks = new Fireworks(app);
for(var i = 0; i < 250; ++i){new Star(app);}
const param = new URLSearchParams(window.location.search);
var year;

if(param.has('y')){
    year = param.get('y');
}else{
    year = new Date().getFullYear() + 1;
}

const target = new Date(year + "-01-01T00:00:00");
st();
sk();
tY.innerHTML = year;
document.title = year + '年の花火 | 0x52525A';

if((Date.now() >= target)){setInterval(function() {fireworks.launch(2)}, 500);}

setInterval(st,1000);
setInterval(sk,60000);

app.addEventListener("mousedown", function() {fireworks.launch()});
//app.addEventListener("touchstart", function() {fireworks.launch()});

