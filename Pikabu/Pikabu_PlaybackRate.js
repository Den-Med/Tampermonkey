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
    let divPlaybackRate = document.createElement('div');
    divPlaybackRate.className = 'player__playbackRate';
    divPlaybackRate.style.cssText = 'cursor: pointer; padding: 16px 5px 16px 1px';

    let svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElem.style.cssText = 'width: 25px; height: 20px';

    let ellipseElem = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    [['fill', '#0000'],['cx', 10],['cy', 10],['rx', 7],['ry', 7],['stroke-width', 3],['stroke', '#fff']].forEach(attr => ellipseElem.setAttribute(...attr));

    svgElem.appendChild(ellipseElem);
    divPlaybackRate.appendChild(svgElem);

    function handleWheelPR(event) {
      event.preventDefault(); // Предотвращаем скролл страницы
      const playbackRateDelta = 0.1 * Math.sign(event.deltaY) * -1;
      const video = event.target.closest('.player__player').querySelector('video');
      video.playbackRate += playbackRateDelta;
      video.playbackRate = Math.min(Math.max(video.playbackRate, 0.1), 3); // Ограничиваем диапазон скорости (0.1 - 3)
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('div.player__controls-wrapper')) {
                prepareHandlerWPR(node);
            }

            const nestedElements = node.querySelectorAll('div.player__controls-wrapper');
            nestedElements.forEach((element) => {
                prepareHandlerWPR(element);
            });
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    function prepareHandlerWPR(element) {
        const divPR = divPlaybackRate.cloneNode(true)
        element.lastElementChild.appendChild(divPR);
        divPR.addEventListener('wheel', handleWheelPR);
    }
})();
