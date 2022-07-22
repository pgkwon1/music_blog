document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', async(event) => {
        const youtube_link = event.target.parentNode.querySelector('.youtube_link').value
        const playlist = event.target.getAttribute('data-playlist')
        const token = document.querySelector('[name="_csrf"]').value
        let frame_index = event.target.getAttribute('data-frame-index')

        if (!youtube_link) { 
            alert("URL을 입력해주세요")
            return false
        }
        let result = await fetch('/music/store', {
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRF-Token': token
            },
            method : 'POST',
            body: JSON.stringify({
                youtube_link,
                playlist
            }),
        })
        result = await result.json()
        if (result.result === true) {
            alert('성공적으로 등록되었습니다.')
            location.reload()
        } else {
            alert(result.message)
        }
    })
})
document.querySelectorAll('.more').forEach(btn => {
    btn.addEventListener('click', async (event) => {
        for (let i=0; i < 5; i++) {
            let hide = event.target.parentNode.querySelector('.hide')
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
        let frame_index = event.target.getAttribute('data-frame-index')
        console.log(event.target)
        let token = document.querySelector('[name="_csrf"]').value
        let playlist = event.target.parentNode.parentNode.getAttribute('data-playlist')

        let result = await fetch('/music/delete', {
            method : 'DELETE',
            headers : {
                'Content-type' : 'application/json',
                'X-CSRF-Token' : token
            },
            body : JSON.stringify({
                'index' : frame_index,
                'playlist' : playlist
            })
        })
        result = await result.json()
        if (result.result === true) {
            event.target.parentNode.remove()
        } else {
            alert(result.message)

        }
    })
    
})

document.querySelectorAll('.playlist-delete').forEach(btn => {
    btn.addEventListener('click', async (event) => {
        let playlist_id = event.target.getAttribute('data-playlist-id')
        let token = document.querySelector('[name="_csrf"]').value

        let result = await fetch('/playlist/delete', {
            method : 'DELETE',
            headers : {
                'Content-Type': 'application/json', 
                'X-CSRF-Token': token
            },
            body : JSON.stringify({
                playlist_id : playlist_id
            })
        })
        result = await result.json()
        if (result.result === true) {
            alert("삭제되었습니다.")
            location.reload()
        } else {
            (typeof result.message === "object") 
            ? alert("예기치 않은 오류가 발생하였습니다 관리자에게 문의해주세요.")
            : alert(result.message)
        }

    })
})
