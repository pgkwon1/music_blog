document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', async(event) => {
        let youtube_link = event.target.parentNode.querySelector('.youtube_link').value
        let playlist = event.target.getAttribute('data-playlist')
        let token = document.querySelector('[name="_csrf"]').value
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
                youtube_link : youtube_link,
                playlist : playlist
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
        let list = event.target.parentNode.querySelectorAll('.hide')
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
        let playlist = event.target.getAttribute('data-playlist')
        
        let result = await fetch('/')
    })
})
