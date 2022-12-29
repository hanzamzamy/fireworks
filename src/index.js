import { Fireworks, Star } from './fireworks-js/fireworks.js';
const app = document.querySelector('#app');
const fireworks = new Fireworks(app);
const param = new URLSearchParams(window.location.search);

if(param.has('s')){for(var i = 0; i < param.get('s'); ++i){new Star(app);}}

app.addEventListener("mousedown", function() {fireworks.launch()});
app.addEventListener("touchstart", function() {fireworks.launch()});
