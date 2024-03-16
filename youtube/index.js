'use strict'

let minutes = 0;
let seconds = 0;
let interval;

async function indexJSON(requestURL) {
    const request = new Request(requestURL);
    const response = await fetch(request);
    const jsonIndex = await response.text();
    const index = JSON.parse(jsonIndex);
    playJSON(index);
}

function playJSON(obj) {
    const main = document.querySelector("main")
    const cover = document.querySelector('#cover')
    const h1B = document.querySelector('h1 strong')
    const h1I = document.querySelector('h1 i')
    const title = document.querySelector('#title')
    const by = document.querySelector('#by')
    const startButton = document.querySelector('h1')
    const showTime = document.querySelector('#title button')

    if (obj.title) {
        h1B.innerHTML = obj.title[0];
        h1I.innerHTML = obj.title[1];
        by.innerHTML = obj.by;
    }

    main.style.backgroundImage = `url(${obj.cover})`;

    showTime.textContent = ('00' + obj.endMin).slice(-2) + ':' + ('00' + obj.endSec).slice(-2);

    let countTime = () => {
        seconds++;
        if (seconds % 60 === 0) {
            minutes++;
            seconds = 0;
        } else if (minutes == obj.endMin && seconds == obj.endSec) {
            clearInterval(interval)
            minutes = 0;
            seconds = 0;
            cover.hidden = false;
            title.hidden = true;
            main.style.backgroundImage = `url(${obj.cover})`;
            const allFrame = document.querySelectorAll("iframe")
            allFrame.forEach((eachFlame) => {
                eachFlame.remove()
            })
            showTime.textContent = ('00' + obj.endMin).slice(-2) + ':' + ('00' + obj.endSec).slice(-2);
        }


        if (obj.youtube && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const contentAll = obj.youtube;
            for (const content of contentAll) {
                if (minutes == content.openMin && seconds == content.openSec) {
                    let iframe = document.createElement('iframe')
                    iframe.src = `https://www.youtube.com/embed/${content.id}?${content.startEnd}&autoplay=1&controls=0`;
                    iframe.style.top = content.top;
                    iframe.style.left = content.left;
                    iframe.style.width = content.width;
                    iframe.style.height = content.height;
                    iframe.style.zIndex = content.zIndex;
                    main.appendChild(iframe)

                    window.setTimeout(function () {
                        iframe.remove()
                    }, content.setTimeout);
                }
            }
        } else {
            if (minutes == 0 && seconds == 1) {
                let iframe = document.createElement('iframe')
                iframe.src = `https://www.youtube.com/embed/${obj.id}?autoplay=1&controls=0`;
                iframe.id = 'player';
                iframe.style.top = '50%';
                iframe.style.left = '50%';
                iframe.style.zIndex = '1';
                main.appendChild(iframe)
            }
        }

        showTime.textContent = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
    }

    startButton.addEventListener('click', () => {
        showTime.classList.toggle('stop')
        interval = setInterval(countTime, 1000)
        cover.hidden = true;
        title.hidden = false;
        main.style.backgroundImage = `url()`;
    })

    showTime.addEventListener('click', () => {
        showTime.classList.toggle('stop')
        if (showTime.className === 'stop') {
            interval = setInterval(countTime, 1000)
        } else {
            clearInterval(interval)
            minutes = 0;
            seconds = 0;
            cover.hidden = false;
            title.hidden = true;
            main.style.backgroundImage = `url(${obj.cover})`;
            const allFrame = document.querySelectorAll("iframe")
            allFrame.forEach((eachFlame) => {
                eachFlame.remove()
            })
            showTime.textContent = ('00' + obj.endMin).slice(-2) + ':' + ('00' + obj.endSec).slice(-2);
        }
    })
}