// ==UserScript==
// @name         Pikabu hiddenLink
// @namespace    http://tampermonkey.net/
// @version      2025-03-01
// @description  try to take over the world!
// @author       You
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// ==/UserScript==

(function() {
    // check CSS rule in "Pikabu style"
    const textType = Node.TEXT_NODE;
    const linkList_tme = document.querySelectorAll('p > a[href^="https://t.me/"]');

    linkList_tme.forEach((elemLink)=> {
        let linkRange = [];
        if (elemLink.previousSibling?.nodeType == textType) linkRange.push(elemLink.previousSibling);
        linkRange.push(elemLink);
        if (elemLink.nextSibling?.nodeType == textType) linkRange.push(elemLink.nextSibling);
        const span = document.createElement('span');
        span.className = 'hiddenLink';
        elemLink.after(span);
        span.append(...linkRange);
    });
    

})();
