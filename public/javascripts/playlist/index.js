/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.add').forEach(btn => {
        btn.addEventListener('click', async event => {
            const playlistId = event.target.getAttribute('data-playlist')
            const token = document.querySelector('[name="_csrf"]').value
            const query = event.target.parentNode.querySelector('.youtubeLink').value
            
            if (!query) { 
                alertMessage("URL을 입력해주세요", "error")
                return false
            }
            let result = await fetch('/music/store', {
                headers: {
                    'Content-Type': 'application/json', 
                    'X-CSRF-Token': token
                },
                method : 'POST',
                body: JSON.stringify({
                    query,
                    playlistId
                }),
            })
            result = await result.json()
            if (result.result === true) {
                alertMessage('성공적으로 등록되었습니다.', "message")
                location.reload()
            } else {
                alertMessage(result.message, "error")
            }
        })
    })
    document.querySelectorAll('.search').forEach(btn => {
        btn.addEventListener("click", async event => {
            const playlistId = event.target.getAttribute('data-playlist')
            const token = document.querySelector('[name="_csrf"]').value
            const query = event.target.parentNode.querySelector('.youtubeTitle').value
            if (!query) { 
                alertMessage("제목을 입력해주세요", "error")
                return false
            }
            let result = await fetch('/music/searchByTitle', {
                headers: {
                    'Content-Type': 'application/json', 
                    'X-CSRF-Token': token
                },
                method : 'POST',
                body: JSON.stringify({
                    query,
                    playlistId
                }),
            })
            result = await result.json()

            if (result.result === true) {
                const parentElem = event.target.parentNode.parentNode
                const searchResultElem = parentElem.querySelector('.search_result')
                searchResultElem.classList.remove("d-none")
                const searchListElem = parentElem.querySelector('.search_result > ul')
                searchListElem.innerHTML = ""
                result.data.forEach(music => {
                    const { videoId } = music.id
                    const { title } = music.snippet
                    const list = document.createElement("li")
                    const button = document.createElement("button")
                    list.classList.add("list-group-item", "d-flex", "justify-content-between", "searchMusic")
                    button.classList.add("btn", "btn-success", "btn-sm", "ml-auto", "searchAdd")
                    button.setAttribute("data-youtube", videoId)
                    button.innerHTML = "+"
                    list.append(title)
                    list.append(button)
                    searchListElem.append(list)
                    searchListElem.classList.remove("d-none")
                })
            } else {
                alertMessage(result.message, "error")
            }
        })
    })

    document.querySelectorAll('.more').forEach(btn => {
        btn.addEventListener('click', event => {
            for (let i=0; i < 5; i++) {
                const hide = event.target.parentNode.querySelector('.hide')
                if (!hide) {
                    event.target.remove()
                    return false
                }
                hide.classList.remove("hide", "d-none")
            }
        })
    })

    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', async event => {
            const musicId = event.target.getAttribute('data-music-index')
            const token = document.querySelector('[name="_csrf"]').value
            const playlistId = event.target.parentNode.parentNode.getAttribute('data-playlist')

            let result = await fetch('/music/delete', {
                method : 'DELETE',
                headers : {
                    'Content-type' : 'application/json',
                    'X-CSRF-Token' : token
                },
                body : JSON.stringify({
                    musicId,
                    playlistId
                })
            })
            result = await result.json()
            if (result.result === true) {
                event.target.parentNode.remove()
            } else {
                alertMessage(result.message, "error")

            }
        })
        
    })

    document.querySelectorAll('.playlist-delete').forEach(btn => {
        btn.addEventListener('click', async event => {
            const playlistId = event.target.getAttribute('data-playlist-id')
            const token = document.querySelector('[name="_csrf"]').value

            let result = await fetch('/playlist/delete', {
                method : 'DELETE',
                headers : {
                    'Content-Type': 'application/json', 
                    'X-CSRF-Token': token
                },
                body : JSON.stringify({
                    playlistId
                })
            })
            result = await result.json()
            if (result.result === true) {
                alertMessage("삭제되었습니다.", "message")
                location.reload()
            } else {
                (typeof result.message === "object") 
                ? alertMessage("예기치 않은 오류가 발생하였습니다 관리자에게 문의해주세요.", "error")
                : alertMessage(result.message, "error")
            }

        })
    })

    document.querySelectorAll('.search_result').forEach(btn => {
        btn.addEventListener("click", async event => {
            if (event.target.classList.contains("searchAdd")) {
                const youtubeId = event.target.getAttribute("data-youtube")
                const token = document.querySelector('[name="_csrf"]').value
                const playlistId = event.target.parentNode.parentNode.getAttribute("data-playlist")
                let result = await fetch('/music/store', {
                    method : "POST",

                    headers : {
                        "Content-Type" : "application/json",
                        "X-CSRF-TOKEN" : token    
                    },

                    body : JSON.stringify({
                        query : `https://youtube.com/watch?v=${youtubeId}`,
                        playlistId
                    })
                })
                result = await result.json()

                if (result.result === true) {
                    location.reload() 
                } else {
                    alertMessage("등록에 실패하였습니다 관리자에게 문의해주세요", "error")
                }

            }
        })
    })
    document.querySelectorAll('.title_update').forEach(btn => {
        btn.addEventListener("click", async event => {
            const playlistId = event.target.getAttribute('data-playlist')
            const title = event.target.previousElementSibling.value

            const token = document.querySelector('[name="_csrf"]').value
            let result = await fetch('/playlist/update', {
                method : "PATCH",
                headers : {
                    "Content-Type" : "application/json",
                    "X-CSRF-TOKEN" : token
                },
                body : JSON.stringify({
                    data : {
                        title
                    },
                    playlistId
                })
            })

            result = await result.json()

            if (result.result === true) {
                location.reload()
            } else {
                alertMessage("제목 수정에 실패하였습니다 관리자에게 문의해주세요", "error")
            }
        })       
    })

    document.querySelectorAll('.searchType').forEach(radio => {
        radio.addEventListener("click", event => {
            const searchType = event.target.value
            const searchFormWrap = event.target.parentNode.parentNode.nextElementSibling
            const urlElem = searchFormWrap.querySelector('.searchUrl')
            const titleElem = searchFormWrap.querySelector('.searchTitle')
            if (searchType === "url") {
                titleElem.classList.add("d-none")
                urlElem.classList.remove("d-none")
            } else {
                titleElem.classList.remove("d-none")
                urlElem.classList.add("d-none")

            }
        })
    })
})