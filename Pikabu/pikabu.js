// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @run-at        document-start
// ==/UserScript==

(function() {
    'use strict';
    const userStyleEl = document.createElement('style');
    document.head.appendChild(userStyleEl);
    userStyleEl.sheet.insertRule( '.story-block__title {color: #c2c4c6;}' );

    const root = document.querySelector(':root');
    root.style.setProperty('--color-black-940', '#c2c4c6');
    root.style.setProperty('--color-primary-900', '#679d47');
    root.style.setProperty('--color-black-800', '#8f939d');

})();
