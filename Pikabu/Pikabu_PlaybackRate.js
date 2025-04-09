// ==UserScript==
// @name         Pikabu PlaybackRate
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  try to take over the world!
// @author       Fidgy
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// ==/UserScript==

(function() {
    const obsAtt = {childList: true, subtree: true};
    const w3svg = 'http://www.w3.org/2000/svg';
    const stylePR = document.createElement('style');
    const palyerConSel = 'div.player__controls-wrapper';
    const circleAtt = {fill: '#0000', cx: 10, cy:10, r: 7, 'stroke-width': 3, stroke: '#fff'};

    stylePR.textContent = `.player__playbackRate {cursor: pointer; padding: 16px 5px 16px 1px;}
    .playbackValue {display: none; position: absolute; bottom: 50%; padding: 4px;}
    .player__playbackRate:hover > .playbackValue {display: block;}`;
    document.head.appendChild(stylePR);


    function createDivPR(){
        const divPlaybackRate = document.createElement('div');
        divPlaybackRate.className = 'player__playbackRate';
        //divPlaybackRate.style.cssText = 'cursor: pointer; padding: 16px 5px 16px 1px';

        const divPRVal = document.createElement('div');
        divPRVal.className = 'playbackValue'
        divPRVal.textContent = '1.0'

        const svgElem = document.createElementNS(w3svg, 'svg');
        svgElem.style.cssText = 'width: 25px; height: 20px';

        const ellipseElem = document.createElementNS(w3svg, 'circle');
        Object.entries(circleAtt).forEach(attr => ellipseElem.setAttribute(...attr));

        svgElem.appendChild(ellipseElem);
        divPlaybackRate.appendChild(svgElem);
        divPlaybackRate.appendChild(divPRVal);

        return divPlaybackRate;
    }

    function handleWheelPR(event) {
      event.preventDefault(); // Предотвращаем скролл страницы
      const playbackRateDelta = 0.1 * Math.sign(event.deltaY) * -1;
      const video = event.target.closest('.player__player').querySelector('video');
      video.playbackRate += playbackRateDelta;
      video.playbackRate = Math.min(Math.max(video.playbackRate, 0.1), 3); // Ограничиваем диапазон скорости (0.1 - 3)
      const divPRVal = event.target.querySelector('.playbackValue');
      divPRVal.textContent = video.playbackRate.toFixed(1);
    };

    function prepareHandlerWPR(element) {
        const divPR = createDivPR(); //divPlaybackRate.cloneNode(true)
        element.lastElementChild.appendChild(divPR);
        divPR.addEventListener('wheel', handleWheelPR);
    }

    function catchHandlerNodes(node) {
        if (node.nodeType !== 1) return;
        let nodeArray = [];
        if (node.matches(palyerConSel)) nodeArray.push(node) ;
        const nestedElements = node.querySelectorAll(palyerConSel);
        nodeArray.push(...Array.from(nestedElements));
        nodeArray.forEach(prepareHandlerWPR);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(catchHandlerNodes);
      });
    });

    observer.observe(document.body, obsAtt);

})();
