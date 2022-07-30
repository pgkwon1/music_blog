/* eslint-disable no-undef */
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
            document.querySelector('#thumbnail'+playlistIndex).setAttribute('src',thumbnail)
            changeIframe(youtubeLink, playlistIndex)
            playFrame.addEventListener('load', () => {
                const timeOutId = setTimeout(() => {
                    ";"
                });
                for (let i = 0 ; i < timeOutId ; i++) {
                    clearTimeout(i); 
                }
                playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                const timerId = setTimeout(() => {
                    if (typeof nextMusic !== "undefined") {
                        clearTimeout(timerId)
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
    if (document.querySelector('#comment')) {
        document.querySelector('#comment').addEventListener("keydown", async event => {
            if (event.isComposing) {
                return false
            }
            if (window.event.keyCode === 13 && event.isComposing === false) {
                const comment = event.target.value
                const playlistId = event.target.getAttribute('data-playlist')
                const token = document.querySelector('[name="_csrf"]').value
                if (!comment) {
                    alertMessage('코멘트를 입력해주세요', 'error')
                    return false
                }

                let result = await fetch('/comment/store', {
                    headers : {
                        'Content-Type': 'application/json', 
                        'X-CSRF-Token': token

                    },
                    method : 'POST',
                    body : JSON.stringify({
                        comment,
                        playlistId
                    })
                })
                await result.JSON()
            }
        })
    }
})
