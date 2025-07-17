// ==UserScript==
// @name         Download Merge Image
// @namespace    http://tampermonkey.net/
// @version      2025-07-17
// @description  crop and merge omic book
// @author       Fidgy
// @match        https://www.webtoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        none
// ==/UserScript==

(function() {
    const cssButton = `
        height: 50px;
        width: 50px;
        background-color: #8f8f8f;
        border: solid black 2px;
        position: fixed;
        top: 95px;
        right: 5px;
        z-index: 999;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        cursor: pointer;
    `;
    const imgSelector = '#_imageList > img';
    const globalMinImgRowsForCheck = 50
    const globalMaxPixelInRowForCheck = 10
    createButton();

    function createButton(){
        const vBox = document.querySelector('_viewerBox');
        //if (!vBox) return;
        const buttonElem = document.createElement('div');
        buttonElem.style.cssText = cssButton;
        buttonElem.textContent = '💾';
        buttonElem.addEventListener('click', buttonEvent);
        document.body.appendChild(buttonElem);
    }

    async function mergeImages(selector) {
        if (typeof selector !== 'string' && !selector) return;
        const imageElements = document.querySelectorAll(selector);
        if (imageElements.length === 0) {
            console.error("No images");
            alert('Изображения не найдены');
            return;
        };
        await prepareImg(imageElements);
        const imageUrls = Array.from(imageElements).map(img => img.src);

        try {
            const loadedImages = await loadImages(imageUrls);
            const canvas = document.createElement('canvas');

            //const croppedImages = loadedImages.map(img => cropImage(img));
            let croppedImages = loadedImages.map(img => getCropImageList(img));
            croppedImages = croppedImages.flat();

            // Рассчет размеров
            //const maxWidth = Math.max(...loadedImages.map(img => img.width));
            //const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0);
            const maxWidth = Math.max(...croppedImages.map(img => img.width));
            const totalHeight = croppedImages.reduce((sum, img) => sum + img.height, 0);

            canvas.width = maxWidth;
            canvas.height = totalHeight;

            const ctx = canvas.getContext('2d');
            let yPos = 0;



            // Отрисовка
            croppedImages.forEach(img => {
                ctx.drawImage(img, 0, yPos);
                yPos += img.height;
            });

            // Создание результата
            const resultImg = new Image();
            resultImg.src = canvas.toDataURL('image/png');
            return resultImg;

        } catch (error) {
            console.error("Ошибка загрузки изображений:", error);
            alert("Не удалось загрузить изображения. Проверьте CORS-настройки сервера.");
        }
    }

    async function prepareImg(imageElements){
        imageElements.forEach((e)=> {
            e.setAttribute('crossorigin', 'anonymous')
            let scrCheck = e.src.includes('bg_transparency.png')
            if (scrCheck) {e.src = e.attributes.getNamedItem('data-url').value};
        })
    }

    function loadImages(urls) {
        return Promise.all(
            urls.map(url => new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = url;
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
            }))
        );
    }

    function downloadImageDirect(imgElement, filename = 'image.png') {
        const link = document.createElement('a');
        link.href = imgElement.src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function buttonEvent(event) {
        const selector = window.gSelector || imgSelector;
        try {
            const imgElem = await mergeImages(selector);
            if (imgElem instanceof HTMLImageElement) {
                downloadImageDirect(imgElem);
            }
        } catch (err) {
            console.error(err);
        }
    }


//crop White spaces
    // Функция для проверки строки на "белизну"
    function isWhiteRow(imageData, width, y, threshold = 250) {
        const maxWidth = Math.min(globalMaxPixelInRowForCheck, width);
        const start = (y * width) * 4;

        for (let i = 0; i < maxWidth; i++) {
            const idx = start + (i * 4);
            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];
            const a = imageData[idx + 3];

            // Проверяем, что пиксель не белый (учитывая альфа-канал)
            if (r < threshold || g < threshold || b < threshold || a < 255) {
                return false;
            }
        }
        return true;
    }

// Функция для обрезки белых полос
    function cropImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let crop = findCrop(canvas, data);

        return getCroppedCanvas(img, crop);
    }

    function getCropImageList(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let cropList = getCropList(canvas, data);
        let canvasList = [];
        cropList.forEach((e)=>{
            canvasList.push(getCroppedCanvas(img, {top: e.start, bottom: e.end}))
        })
        return canvasList;
    }

    function getCroppedCanvas(img, crop){
        //const cropHeight = img.height - crop.top - crop.bottom;
        const cropHeight = crop.bottom - crop.top; // +1 ;
        if (crop.top === 0 && crop.bottom === 0) return img;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = img.width;
        croppedCanvas.height = Math.max(0, cropHeight);
        const croppedCtx = croppedCanvas.getContext('2d');

        croppedCtx.drawImage(
            img,
            0, crop.top, // Начало области обрезки (X, Y)
            img.width, cropHeight, // Ширина и высота области обрезки
            0, 0, // Размещение на новом canvas
            img.width, cropHeight
        );

        return croppedCanvas;
    }

    function findCrop(canvas, data){
        const minHeight = globalMinImgRowsForCheck;
        let crop = {top: 0, bottom: 0}
        for (let y = 0; y < canvas.height; y++) {
            if (!isWhiteRow(data, canvas.width, y)) break;
            crop.top = y + 1;
        }

        // Определяем обрезку снизу
        for (let y = canvas.height - 1; y >= 0; y--) {
            if (!isWhiteRow(data, canvas.width, y)) break;
            crop.bottom = canvas.height - y;
        }
        crop.top = crop.top >= minHeight ? crop.top : 0;
        crop.bottom = crop.bottom >= minHeight ? crop.bottom : 0;
        return crop;
    }

//     function getCropList(canvas, data){
//         const minRows = globalMinImgRowsForCheck;
//         let cropList = new ImgCropList(minRows);
//         for (let y = 0; y < canvas.height; y++) {
//             if (isWhiteRow(data, canvas.width, y)) {
//                 cropList.closeCurrentOn(y);
//             } else {
//                 cropList.setValue(y);
//             }
//         }
//         cropList.closeCurrent();
//         return cropList.$;
//     }

    function getCropList(canvas, data){
        const minRows = globalMinImgRowsForCheck;
        const cropList = [{start: null, end: 0}];
        for (let y = 0; y < canvas.height; y++) {
            let e = cropList.at(-1)
            if (isWhiteRow(data, canvas.width, y)) {
                let diff = y - e.end;
                if (e.start !== null && diff >= minRows) {
                    cropList.push({start: null, end: 0})
                }
            } else {
                if (e.start === null) {
                    e.start = y;
                    e.end = y + 1;
                } else {
                    e.end = y;
                }
            }
        }
        return cropList.filter(e=> e.start !== null);
    }

    class ImgCropList {
        constructor(threshold) {
            this.entries = [this.#createNullObj()];
            this.minSet = threshold;
        }
        #createNullObj() {
            return { start: null, end: 0, isClosed: false };
        }
        get currentEntry() {
            return this.entries.at(-1);
        }
        closeCurrentOn(value) {
            const e = this.currentEntry;
            //let diff = e.end - e.start;
            let diff = value - e.end;
            if (e.start !== null && diff >= this.minSet) {
                e.isClosed = true;
            }
        }
        closeCurrent(){
            this.currentEntry.isClosed = true
        }
        setValue(value) {
            const e = this.currentEntry;
            if (e.isClosed) {
                const entry = this.#createNullObj();
                entry.start = value;
                this.entries.push(entry);
                return;
            }
            if (e.start === null) {
                e.start = value;
                e.end = value + 1;
            } else {
                e.end = value;
            }
        }
        get $(){
            return this.entries.filter(e=> e.start !== null && e.isClosed === true);
        }
    }

})();
