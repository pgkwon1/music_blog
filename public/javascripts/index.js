/* eslint-disable no-undef */
function changeIframe(url, index) {
    document.querySelector(".footer-play_frame").setAttribute("src", "https://www.youtube.com/embed/"+url+"?start=1&enablejsapi=1&version=3&playerapiid=ytplayer&modestbranding=1&controls=0&showinfo=0")
    return true
}

document.addEventListener("DOMContentLoaded", () => {
    let player = null
    let playerInstance
    let state = 'play'
    let nextMusic
    let prevMusic
    let isPause = false
    let timer

    const controlButton = queryAll('.control-music > i')
    const volumeElem = query('#footer-range')
    const playFrame = document.querySelector(".footer-play_frame")

    queryAll('.play').forEach(async btn => {
        btn.addEventListener('click', async(event, isNext = false) => {
            const target = (isNext === false) ? event.currentTarget : event.target
            const youtubeLink = target.getAttribute("data-youtube")
            const playlistIndex = target.getAttribute("data-playlist-index")
            const musicIndex = Number(target.getAttribute("data-music-index"))
            const thumbnail = target.getAttribute('data-thumbnail')
            const title = target.getAttribute('data-title')
            const hour = target.getAttribute('data-hour')
            const min = target.getAttribute('data-min')
            const sec = target.getAttribute('data-sec')
            const secondText = (hour === "00") ? `${min}:${sec}` : `${hour}:${min}:${sec}`
            nextMusic = document.querySelectorAll('.play[data-playlist-index="'+playlistIndex+'"]')[musicIndex+1]
            prevMusic = document.querySelectorAll('.play[data-playlist-index="'+playlistIndex+'"]')[musicIndex-1]
            query('.next-music').disabled = true
            query('.prev-music').disabled = true

            await setYoutubeIframeApi({ // playerInstance 할당
                youtubeLink,
            })
            setTrackTime(0)
            const list = target.parentNode.querySelectorAll('.play')

            document.querySelector('#footer-thumbnail').setAttribute('src',thumbnail)
            document.querySelector('#footer-sec').innerHTML = secondText
            document.querySelector('#total-time').innerHTML = secondText
            document.querySelector('#footer-title').innerHTML = title

            document.querySelector('#nowPlaying').value = youtubeLink
            changeIframe(youtubeLink, playlistIndex)
            playFrame.addEventListener('load', () => {
                query('#current-time').innerHTML = `00:00`
                playMusic() //음악재생
                volumeElem.disabled = false
                if (nextMusic instanceof HTMLElement) { // 다음 음악이 있으면 비활성화 해제
                    query('.next-music').disabled = false
                }
                if (prevMusic instanceof HTMLElement) { // 이전 음악이 있으면 비활성화 해제
                    query('.prev-music').disabled = false
                }
                changeControlButton() // 재생 중지 이모티콘 변경
            }, { once : true })
            for (let i=0; i<list.length; i++) {
                list[i].classList.remove("active")
            }
            target.classList.add("active")
        })
    })

    queryAll('.like').forEach(btn => {
        btn.addEventListener("click", async event => {
            const target = event.currentTarget
            const playlistIndex = target.getAttribute("data-playlist-index")
            const likeElem = target.childNodes[3]
            const likeCount = Number(likeElem.innerHTML)

            const result = await fetchData('/playlist/like', 'POST', {
                playlistIndex
            })

            if (result.result === false) {
                alertMessage(result.message, "error")
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
    
    query('#footer-range').addEventListener("input", event => {
        const volume = event.target.value
        player.setVolume(volume)
    })
    
    query('.prev-music').addEventListener("click", () => {
        playPrevMusic()
    })

    query('.control-music').addEventListener("click", () => {
        (state === 'play') ? pauseMusic() : playMusic()
        changeControlButton()
    })

    query('.next-music').addEventListener("click", () => {
        playNextMusic()
    })
    
    function setYoutubeIframeInit({playFrame, event}) {
        player = event.target
        const nowVolume = player.getVolume()
        volumeElem.value = nowVolume
        volumeElem.innerHTML = nowVolume
        volumeElem.disabled = false
    }

    async function playMusic() {
        state = 'play'
        // 간헐적으로 playerInstance에 메소드들이 없는 경우가 있어서 아래처럼 처리
        if (typeof playerInstance.playVideo !== 'function') {
            playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
        } else {
            playerInstance.playVideo()
        }
        isPause = false
        if (!timer) {
            setTrackTime(1)
        }
    }

    async function pauseMusic() {
        state = 'pause'
        // 간헐적으로 playerInstance에 메소드들이 없는 경우가 있어서 아래처럼 처리
        if (typeof playerInstance.pauseVideo !== 'function') {
            playFrame.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        } else {
            playerInstance.pauseVideo()
        }
        isPause = true

    }
    
    async function playNextMusic() {
        // 재생시간 초기화
        setTrackTime(0)
        if (nextMusic) {
            nextMusic.dispatchEvent(new Event("click"), true)
        }
    }

    async function playPrevMusic() {
        // 재생시간 초기화
        setTrackTime(0)
        if (prevMusic) {
            prevMusic.dispatchEvent(new Event("click"), true)
        }

    }
    async function setYoutubeIframeApi(data) {
        const { youtubeLink } = data
        // eslint-disable-next-line no-new
        playerInstance = null
        playerInstance = await new YT.Player(playFrame, {
            videoId : youtubeLink,
            events : {
                'onReady' : event => {
                    state = 'play'
                    setYoutubeIframeInit({
                        playFrame,
                        event
                    })
                },
                'onStateChange' : event => {
                    if (event.data === 0) {
                        state = 'pause'
                        setTrackTime(0)
                        changeControlButton()
                        if (typeof nextMusic !== "undefined") {
                            nextMusic.dispatchEvent(new Event("click"), true)
                        }
                    }
                }
            }
        })
        return true
    }

    function changeControlButton() {
        if (state === 'pause') {
            controlButton[0].classList.remove("d-none")
            controlButton[1].classList.add("d-none")
        } else if (state === 'play') {
            controlButton[0].classList.add("d-none")
            controlButton[1].classList.remove("d-none")
        }
        return true

    }

    function setTrackTime(mode) {
        if (mode === 1) {
            const totalTime = query('#footer-sec').innerHTML.split(":")
            let hour = 0
            let min = 0
            let sec = 0
            let hourText = '00'
            let minText = '00'
            let secText = 0

            timer = setInterval(() => {
                if (isPause === false) {

                    secText = ( sec < 10) ? `0${sec++}` : sec++
                    if (sec >= 60) {
                        sec = 0
                        min++
                        minText = ( min < 10 ) ? `0${min}` : min
                    }
                    
                    if (min >= 60) {
                        sec = 0
                        min = 0
                        hour++
                        hourText = ( hour < 10 ) ? `0${hour}` : hour
                    }
                    query('#current-time').innerHTML = (totalTime.length > 2) ? `${hourText}:${minText}:${secText}` : `${minText}:${secText}`
                }

            },1000)
        } else if (mode === 0) {
            clearInterval(timer)
            timer = null
        }
    }
})
