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
    const obsAtt = {childList: true, subtree: true};
    const hiddenCl = 'hiddenLink';
    const notHiddenCl = 'notHiddenLink';
    const targetLinks = 't.me, aliclick.shop, gbest.by, lres.bz'

    const selector = targetLinks.split(',').map(item => `p > a[href*="${item.trim()}"]`).join(', ');

    function catchListOfLinks(node) {
        if (node.nodeType !== 1) return;
        const nodeArray = [];
        if (node.matches(selector)) nodeArray.push(node) ;
        const links = node.querySelectorAll(selector);
        nodeArray.push(...Array.from(links));
        nodeArray.forEach(hideLink);
    };

    function findBR(e) {return e.nodeName === 'BR'};

    function hideLink(elemLink) {
        if (elemLink.parentNode.matches('.' + hiddenCl)) return;

        let childArray = Array.from(elemLink.parentNode.childNodes);
        let eIndex = childArray.indexOf(elemLink);

        let leftIndex = childArray.slice(0, eIndex).findLastIndex(findBR);
        leftIndex = leftIndex >= 0 ? leftIndex + 1 : 0;

        let rightIndex = childArray.slice(eIndex + 1).findIndex(findBR);
        rightIndex = rightIndex >= 0 ? rightIndex + eIndex : childArray.length

        let linkRange = childArray.slice(leftIndex, rightIndex + 1);
        if (linkRange.length == 0) return;

        const span = document.createElement('span');
        span.className = hiddenCl;
        elemLink.after(span);
        span.append(...linkRange);
        span.addEventListener('click', toggleClass);
    };

    function toggleClass(e){
        const t = e.currentTarget.classList;
        t.toggle(notHiddenCl, !t.toggle(hiddenCl))
    };

    catchListOfLinks(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(catchListOfLinks);
      });
    });

    observer.observe(document.body, obsAtt);

})();
