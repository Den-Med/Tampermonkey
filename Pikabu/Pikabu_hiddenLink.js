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
    const elemType = Node.ELEMENT_NODE
    const telegramLinks = document.querySelectorAll('p > a[href^="https://t.me/"]');

    telegramLinks.forEach((elemLink)=> {
        let childArray = Array.from(elemLink.parentNode.childNodes);

        let eIndex = childArray.indexOf(elemLink);

        let leftIndex = childArray.slice(0,eIndex).findLastIndex((e)=> e.nodeType == elemType );
        leftIndex = leftIndex >= 0 ? leftIndex + 1 : 0;

        let rightIndex = childArray.slice(eIndex + 1, childArray.length + 1).findLastIndex((e)=> e.nodeType == elemType );
        rightIndex = rightIndex >= 0 ? rightIndex - 1 : childArray.length

        let linkRange = childArray.slice(leftIndex, rightIndex + 1);

        const span = document.createElement('span');
        span.className = 'hiddenLink';
        elemLink.after(span);
        span.append(...linkRange);
    });

})();
