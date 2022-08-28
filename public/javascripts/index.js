/* eslint-disable no-undef */
function changeIframe(url, index) {
    document.querySelector(".play_frame"+index).setAttribute("src", "https://www.youtube.com/embed/"+url+"?start=1&enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
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
    let player = null
    document.querySelectorAll('.play').forEach(btn => {
        btn.addEventListener('click', async(event, isNext = false) => {
            const target = (isNext === false) ? event.currentTarget : event.target
            await stopAllFrame()
            const youtubeLink = target.getAttribute("data-youtube")
            const playlistIndex = target.getAttribute("data-playlist-index")
            const musicIndex = Number(target.getAttribute("data-music-index"))
            const thumbnail = target.getAttribute('data-thumbnail')
            const playFrame = document.querySelector(".play_frame"+playlistIndex)
            const nextMusic = document.querySelectorAll('.play[data-playlist-index="'+playlistIndex+'"]')[musicIndex+1]
            setYoutubeIframeApi({
                playFrame,
                youtubeLink,
                nextMusic
            })
            const list = target.parentNode.querySelectorAll('.play')
            console.log(playlistIndex)
            document.querySelector('#thumbnail'+playlistIndex).setAttribute('src',thumbnail)
            document.querySelector('#nowPlaying'+playlistIndex).value = youtubeLink
            changeIframe(youtubeLink, playlistIndex)
            playFrame.addEventListener('load', () => {
                playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            }, { once : true })
            for (let i=0; i<list.length; i++) {
                list[i].classList.remove("active")
            }
            target.classList.add("active")
        })
    })
    document.querySelectorAll('.more').forEach(btn => {
        btn.addEventListener('click', event => {
            for (let i=0; i < 5; i++) {
                const hide = event.currentTarget.parentNode.querySelector('.hide')
                if (!hide) {
                    event.target.remove()
                    return false
                }
                hide.classList.remove("hide", "d-none")
            }
        })
    })

    document.querySelectorAll('.like').forEach(btn => {
        btn.addEventListener("click", async event => {
            const target = event.currentTarget
            const playlistIndex = target.getAttribute("data-playlist-index")
            const token = document.querySelector('[name="_csrf"]').value
            const likeElem = target.childNodes[3]
            const likeCount = Number(likeElem.innerHTML)
            let result = await fetch('/playlist/like', {
                method : "POST",
                headers : {
                    'Content-Type': 'application/json', 
                    'X-CSRF-Token': token
                },
                body : JSON.stringify({
                    playlistIndex
                })
            })
            result = await result.json()
            if (result.result === false) { 
                if (typeof result.message === "object") {
                    alertMessage("예기치 않은 오류가 발생하였습니다 관리자에게 문의해주세요.", "error")
                } else {
                    alertMessage(result.message, "error")
                }
            } else if (result.like === true) {
                target.classList.remove("btn-light")
                target.classList.add("btn-primary")
                likeElem.innerHTML = likeCount + 1
            } else if (result.like === false) {
                target.classList.remove("btn-primary")
                target.classList.add("btn-light")
                likeElem.innerHTML = likeCount - 1
            }


        })
    })

    document.querySelectorAll('.volume').forEach(btn => {
        btn.addEventListener("input", event => {
            const volume = event.target.value
            player.setVolume(volume)
            event.target.nextElementSibling.innerHTML = volume
        })
     })

     function setYoutubeIframeInit({playFrame, event}) {
        player = event.target
        const nowVolume = player.getVolume()
        document.querySelectorAll('.volume').forEach(vol => { vol.disabled = true })
        playFrame.nextElementSibling.value = nowVolume
        playFrame.nextElementSibling.nextElementSibling.innerHTML = nowVolume
        playFrame.nextElementSibling.disabled = false
    }

     function setYoutubeIframeApi(data) {
        const { playFrame, youtubeLink, nextMusic } = data
        // eslint-disable-next-line no-new
        new YT.Player(playFrame, {
            videoId : youtubeLink,
            events : {
                'onReady' : event => {
                    setYoutubeIframeInit({
                        playFrame,
                        event
                   })

                },
                'onStateChange' : event => {
                    if (event.data === 0 && typeof nextMusic !== "undefined") {
                        nextMusic.dispatchEvent(new Event('click'), true)
                    }
                }
            }
        })
        return true
    }
})
