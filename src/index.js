// css load
require('./main.css');

// js load
import { io } from 'socket.io-client';
import {titleScreen} from "./Screens/title-screen";

// load html DOM elements
const Background_canvas = document.getElementById('background');
const Background_ctx = Background_canvas.getContext('2d');
const UI_canvas = document.getElementById('ui');
const UI_ctx = UI_canvas.getContext('2d');

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
Screen.popupAlert.data = [];
Screen.popupAlert.draw = function () {};
let socket = {};
const Settings = {};
const InGameData = {};

// Set Screen Rendering Loop
setInterval( function () {
    Screen.currentScreen.draw(Background_ctx, UI_ctx, Screen);
    Screen.popupAlert.draw(Background_ctx, UI_ctx, Screen.popupAlert.data);
    Screen.currentScreen.check(Screen.userMouse, Screen.userKeyboard, Screen.currentScreen.checkUIList);
}, (1000 / 30));

window.onload = function () {
    socket = io();
    Screen.currentScreen = titleScreen;
    Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
}

// Socket Event Listeners