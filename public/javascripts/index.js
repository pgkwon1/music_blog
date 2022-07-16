    
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.play').forEach(btn => {
        btn.addEventListener('click', event => {
            let youtube_link = event.target.getAttribute("data-youtube")
            let frame_index = event.target.getAttribute("data-frame-index")
            let music_index = Number(event.target.getAttribute("data-music-index"))
            let sec = Number(event.target.getAttribute("data-sec"))
            let play_frame = document.querySelectorAll(".play_frame")[frame_index]
            let next_music = document.querySelectorAll(".play")[music_index+1]
            let list = event.target.parentNode.querySelectorAll('.play')
            changeIframe(youtube_link, frame_index)
            
            play_frame.addEventListener('load', (event) => {
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
        $(".play_frame:eq("+index+")").attr("src", "https://www.youtube.com/embed/"+url+"?enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
        return true
    }
})
