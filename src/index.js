// css load
require('./main.css');

// js load
import { io } from 'socket.io-client';
import {titleScreen} from "./Screens/title-screen";
import {agreementSoundScreen} from "./Screens/agreement-sound-screen";
import {tooManyUserScreen} from "./Screens/too-many-user-screen";

// load html DOM elements
const Background_canvas = document.getElementById('background');
const Background_ctx = Background_canvas.getContext('2d');
const UI_canvas = document.getElementById('ui');
const UI_ctx = UI_canvas.getContext('2d');
const Popup_canvas = document.getElementById('popup');
const Popup_ctx = Popup_canvas.getContext('2d');

// Set Data
const Screen = {};
Screen.userMouse = {
    x: 0,
    y: 0,
    click: false,
};
Screen.userKeyboard = new Array(100).fill(false);
Screen.scale = 1;
Screen.currentScreen = {};
Screen.currentScreen.draw = function () {};
Screen.currentScreen.checkUIList = [];
Screen.popupAlert = {};
Screen.popupAlert.data = undefined;
Screen.popupAlert.draw = function () {
    if(Screen.popupAlert.data){
        Popup_canvas.style.zIndex = 2;
    }else{
        Popup_canvas.style.zIndex = 0;
    }
};
Screen.X0real = 0;
Screen.Y0real = 0;

// Set Screen Rendering Loop
setInterval( function () {
    Screen.currentScreen.draw(Background_ctx, UI_ctx, Screen);
    Screen.popupAlert.draw(Popup_ctx, Screen.popupAlert.data);
    Screen.currentScreen.check(Screen.userMouse, Screen.userKeyboard, Screen.currentScreen.checkUIList);
}, (1000 / 30));

window.onload = function () {
    Screen.currentScreen = agreementSoundScreen;
    Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    canvasResize();
}


// Event Listeners
window.addEventListener('resize', function() {
    canvasResize();
})

UI_canvas.addEventListener('mousemove', function(e) {
    Screen.userMouse.x = (e.offsetX / Screen.scale) - Screen.X0real;
    Screen.userMouse.y = (e.offsetY / Screen.scale) - Screen.Y0real;
})

UI_canvas.addEventListener('click', function(e) {
    Screen.userMouse.click = true;
})

// Socket Event Listeners
window.addEventListener("doSocketConnect", function () {
    Screen.socket = io();

    Screen.socket.on('connected', function (ClientId) {
        Screen.ClientId = ClientId;
        Screen.currentScreen = titleScreen;
        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    });

    Screen.socket.on('server full', function () {
        Screen.currentScreen = tooManyUserScreen;
        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    })
});

// functions
function canvasResize() {
    if (window.innerWidth * 9 < window.innerHeight * 16) {
        Screen.scale = window.innerWidth / 1920 * 0.9;
    } else {
        Screen.scale = window.innerHeight / 1080 * 0.9;
    }
    Background_canvas.width = 1920 * Screen.scale;
    Background_canvas.height = 1080 * Screen.scale;
    UI_canvas.width = 1920 * Screen.scale;
    UI_canvas.height = 1080 * Screen.scale;
    Popup_canvas.width = 1920 * Screen.scale;
    Popup_canvas.height = 1080 * Screen.scale;
    Background_canvas.style.top = '50%';
    Background_canvas.style.left = '50%';
    Background_canvas.style.transform = 'translate(-50%, -50%)';
    UI_canvas.style.top = '50%';
    UI_canvas.style.left = '50%';
    UI_canvas.style.transform = 'translate(-50%, -50%)';
    Popup_canvas.style.top = '50%';
    Popup_canvas.style.left = '50%';
    Popup_canvas.style.transform = 'translate(-50%, -50%)';
    Background_ctx.scale(Screen.scale, Screen.scale);
    UI_ctx.scale(Screen.scale, Screen.scale);
    Popup_ctx.scale(Screen.scale, Screen.scale);
    Screen.currentScreen.redrawBackground(Background_ctx);
}