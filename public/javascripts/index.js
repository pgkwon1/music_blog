function changeIframe(url, index) {
    document.querySelector(".play_frame"+index).setAttribute("src", "https://www.youtube.com/embed/"+url+"?enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
    return true
}

function stopAllFrame() {
    const list = document.querySelectorAll(".play_frame")
    list.forEach(playFrame => {
        playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    })
    const active = document.querySelectorAll(".active")
    for (let i=0; i<active.length; i++) {
        active[i].classList.remove("active")
    }
    return true  
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.play').forEach(btn => {
        btn.addEventListener('click', async(event, isNext = false) => {
            const target = (isNext === false) ? event.currentTarget : event.target
            await stopAllFrame()
            const youtubeLink = target.getAttribute("data-youtube")
            const playlistIndex = target.getAttribute("data-playlist-index")
            const musicIndex = Number(target.getAttribute("data-music-index"))
            const sec = Number(target.getAttribute("data-sec"))
            const thumbnail = target.getAttribute('data-thumbnail')
            const playFrame = document.querySelector(".play_frame"+playlistIndex)
            const nextMusic = document.querySelectorAll('.play[data-playlist-index="'+playlistIndex+'"]')[musicIndex+1]

            const list = target.parentNode.querySelectorAll('.play')
            document.querySelectorAll('#thumbnail')[playlistIndex-1].setAttribute('src',thumbnail)
            changeIframe(youtubeLink, playlistIndex)
            playFrame.addEventListener('load', () => {
                const timeOutId = setTimeout(";");
                for (let i = 0 ; i < timeOutId ; i++) {
                    clearTimeout(i); 
                }
                playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                setTimeout(() => {
                    if (typeof nextMusic !== "undefined") {
                        nextMusic.dispatchEvent(new Event('click'), true)
                    }
                }, (sec+1)*1000)
            }, { once : true })
            for (let i=0; i<list.length; i++) {
                list[i].classList.remove("active")
            }
            target.classList.add("active")
        })
    })
    document.querySelectorAll('.more').forEach(btn => {
        btn.addEventListener('click', (event) => {
            for (let i=0; i < 5; i++) {
                let hide = event.currentTarget.parentNode.querySelector('.hide')
                if (!hide) {
                    event.target.remove()
                    return false
                }
                hide.classList.remove("hide", "d-none")
            }
        })
    })
})
