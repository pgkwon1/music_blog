/* eslint-disable no-undef */
document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', async(event) => {
        const youtubeLink = event.target.parentNode.querySelector('.youtubeLink').value
        const playlistId = event.target.getAttribute('data-playlist')
        const token = document.querySelector('[name="_csrf"]').value

        if (!youtubeLink) { 
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
                youtubeLink,
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
document.querySelectorAll('.more').forEach(btn => {
    btn.addEventListener('click', async (event) => {
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
    btn.addEventListener('click', async (event) => {
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
    btn.addEventListener('click', async (event) => {
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

    })       
})