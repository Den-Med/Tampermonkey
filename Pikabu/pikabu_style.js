// ==UserScript==
// @name         Pikabu style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        GM_addStyle
// @run-at        document-start
// ==/UserScript==

(function() {
    '***';
    const userStyleEl = document.createElement('style');
    document.head.appendChild(userStyleEl);

    GM_addStyle(`
                  .image-lazy.image-lazy-processed {
                    border-color: #00000000;
                  }
                  .image-lazy.image-lazy-processed .avatar__default,
                  .image-lazy.image-lazy-processed img {
                    outline: none;
                  }
    `); //avatar_level


    GM_addStyle( 'button.carousel__scroll.button {height: 100%; border-radius: 0%; border: none; width: 40px; background-color: var(--cariusel_bgc); box-shadow: none;}' );
    GM_addStyle( 'button.carousel__scroll_right {right: 0px;}' );
    GM_addStyle( 'button.carousel__scroll_left {left: 0px;}' );
    GM_addStyle( 'p.story-block__title {color: var(--color-black-940);}' );
    GM_addStyle( 'a[href*="dQw4w9WgXcQ"] {color: #8e9900;}' );
    GM_addStyle( `
                  p:has(a[href^="https://t.me/"]):hover   {visibility: visible;}
                  p:has(a[href^="https://t.me/"])::before {content: "➖"; visibility: visible; }
                  p:has(a[href^="https://t.me/"])         {visibility: hidden;}
               ` );
    GM_addStyle( '.pkb-highlight-block {padding: 5px;}' );

    //GM_addStyle( '.story-skeleton { display: none; }' ); // крашит страницу поиска


    const root = document.querySelector(':root');
    root.style.setProperty('--color-black-940', '#c2c4c6');
    root.style.setProperty('--color-primary-900', '#679d47');
    root.style.setProperty('--color-black-800', '#8f939d');
    root.style.setProperty('--cariusel_bgc', '#31313191');

})();
