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
    const cover = document.querySelector('#cover')
    const h1B = document.querySelector('h1 strong')
    const h1I = document.querySelector('h1 i')
    const title = document.querySelector('#title')
    const startButton = document.querySelector('h1')
    const showTime = document.querySelector('#title button')

    if (obj.title) {
        h1B.innerHTML = obj.title[0];
        h1I.innerHTML = obj.title[1];
    }

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
        }

        const contentAll = obj.youtube;
        for (const content of contentAll) {
            if (minutes == content.openMin && seconds == content.openSec) {
                const main = document.querySelector("main")
                const iframe = document.createElement('iframe')
                iframe.src = `http://www.youtube.com/embed/${content.id}?${content.startEnd}&autoplay=1`;
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

        showTime.textContent = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
    }

    startButton.addEventListener('click', () => {
        interval = setInterval(countTime, 1000)
        cover.hidden = true;
        title.hidden = false;
    })

    showTime.addEventListener('click', () => {
        showTime.classList.toggle('stop')
        if (showTime.className === 'stop') {
            clearInterval(interval)
            minutes = 0;
            seconds = 0;
            showTime.textContent = '00:00';

            const allFrame = userList.querySelectorAll("iframe")
            allFrame.forEach((eachFlame) => {
                eachFlame.remove()
            })
        } else {
            interval = setInterval(countTime, 1000)
        }

    })
}