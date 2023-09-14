// ==UserScript==
// @name         Media Poistion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://2ch.hk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const obsElem = document.querySelector('div.mv');
    if (!obsElem) return;

    function mutCBTest(mutList) { console.log(mutList) };
    const mutObsTest = new MutationObserver(mutCBTest);

    function mediaStyleChange(elem){
        if (elem instanceof HTMLElement && elem.matches('.mv__main#js-mv-main')) {
            elem.style.left = '';
            elem.style.right = '3px';
        }
    }

    function mutDataMediaInfo(mutList) {
        for (let mut of mutList){
            if (mut.attributeName == 'data-mediainfo') {
                mediaStyleChange(mut.target);
                return;
            };
        }
    }
    const mutDMI = new MutationObserver(mutDataMediaInfo);

    function mutCallback(mutationList, observer) {
        for (let mut of mutationList) {
            for (let aNod of mut.addedNodes) {
                mediaStyleChange(aNod);
                mutDMI.observe(aNod, { attributes: true })
            }
        };
    };

    const mutObserver = new MutationObserver(mutCallback);
    mutObserver.observe(obsElem, { childList: true });


    // Your code here...
})();
