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
    const commType = Node.COMMENT_NODE
    const linkList_tme = document.querySelectorAll('p > a[href^="https://t.me/"]');

    linkList_tme.forEach((elemLink)=> {
        let pCNRange = [...elemLink.parentNode.childNodes];
        let eIndex = pCNRange.indexOf(elemLink);
        let linkRange = [];
        let prevSib = pCNRange[eIndex -1]?.nodeType == commType ? pCNRange[eIndex -2] : pCNRange[eIndex -1];
        let nextSib = pCNRange[eIndex +1]?.nodeType == commType ? pCNRange[eIndex +2] : pCNRange[eIndex +1];
        if (prevSib?.nodeType == textType) linkRange.push(prevSib);
        linkRange.push(elemLink);
        if (prevSib?.nodeType == textType) linkRange.push(prevSib);
        const span = document.createElement('span');
        span.className = 'hiddenLink';
        elemLink.after(span);
        span.append(...linkRange);
    });

})();
