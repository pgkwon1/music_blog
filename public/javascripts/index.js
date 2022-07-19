    
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.play').forEach(btn => {
        btn.addEventListener('click', async(event) => {
            await stopAllFrame()
            let youtube_link = event.target.getAttribute("data-youtube")
            let playlist_index = event.target.getAttribute("data-playlist-index")
            let music_index = Number(event.target.getAttribute("data-music-index"))
            let sec = Number(event.target.getAttribute("data-sec"))
            let play_frame = document.querySelector(".play_frame"+playlist_index)
            let next_music = document.querySelectorAll('.play[data-playlist-index="'+playlist_index+'"]')[music_index+1]
            let list = event.target.parentNode.querySelectorAll('.play')
            changeIframe(youtube_link, playlist_index)
            play_frame.addEventListener('load', (event) => {
                const timeOutId = setTimeout(";");
                for (let i = 0 ; i < timeOutId ; i++) {
                    clearTimeout(i); 
                }
                play_frame.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                setTimeout(() => {
                    if (typeof next_music !== "undefined") {
                        next_music.dispatchEvent(new Event('click'))
                    }
                }, (sec+1)*1000)
            }, { once : true })
            for (let i=0; i<list.length; i++) {
                list[i].classList.remove("active")
            }
            event.target.classList.add("active")
        })
    })
    function changeIframe(url, index) {
        $(".play_frame"+index).attr("src", "https://www.youtube.com/embed/"+url+"?enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
        return true
    }

    async function stopAllFrame() {
        const list = document.querySelectorAll(".play_frame")
        list.forEach(play_frame => {
            play_frame.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        })
        const active = document.querySelectorAll(".active")
        for (let i=0; i<active.length; i++) {
            active[i].classList.remove("active")
        }
        return true
        
    }
})
