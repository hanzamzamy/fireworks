import { Fireworks, Star } from './fireworks-js/fireworks.js';
const app = document.querySelector('#app');

const fireworks = new Fireworks(app);
for(var i = 0; i < 250; ++i){new Star(app);}

//setInterval(function() {fireworks.launch()}, 500);

app.addEventListener("mousedown", function() {fireworks.launch()});
//app.addEventListener("touchstart", function() {fireworks.launch()});
//aa
