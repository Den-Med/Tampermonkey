// ==UserScript==
// @name         Pikabu volumeScroll
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
    const palyerQ = '.player' //'.player__player'
    const volumeQ = '.player__volume-container';
    const lsVName = 'pkb_Ply_v';

    function handleVolumeS(event) {
        event.preventDefault(); // Предотвращаем скролл страницы
        const player = event.target.closest(palyerQ);
        const volumeDelta = 0.1 * Math.sign(event.deltaY) * -1;
        const jq = changeVloumeJQ(player, volumeDelta);
        //if (!jq) changeVloumeNative(player, volumeDelta)
    };

    function changeVloumeJQ(player, volumeDelta){
        const propList = Object.getOwnPropertyNames(player);
        for (let p of propList) {
            if (player[p]?._uiElement?.volume !== undefined){
                player[p]._uiElement.volume += volumeDelta;
                return true;
            } else {
                return false;
            }
        };
    };

    function changeVloumeNative(player, volumeDelta){
        const video = player.querySelector('video');
        video.volume = Math.min(Math.max(video.volume + volumeDelta, 0), 1); // Ограничиваем диапазон скорости (0 - 1)

        const lsV = window.localStorage.getItem(lsVName);
        if (lsV) {
            let volS = JSON.parse(lsV);
            if (volS.vo !== undefined) {volS.vo = video.volume};
            window.localStorage.setItem(lsVName, JSON.stringify(volS));
        }

        const slider = player.querySelector('.player__volume-amount')
        if (slider) {
            slider.style.transform = `translateY(${100 - (video.volume * 100)}%)`
        }
    }

     function catchHandlerNodes(node) {
        if (node.nodeType !== 1) return;
        let nodeArray = [];
        if (node.matches(volumeQ)) nodeArray.push(node) ;
        const nestedElements = node.querySelectorAll(volumeQ);
        nodeArray.push(...Array.from(nestedElements));
        nodeArray.forEach(e => e.addEventListener('wheel', handleVolumeS));
    }


    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(catchHandlerNodes);
      });
    });

    observer.observe(document.body, obsAtt);

})();
