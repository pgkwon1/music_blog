document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('#comment')) {
        document.querySelector('#comment').addEventListener("keydown", async event => {
            if (event.isComposing) {
                return false
            }
            if (window.event.keyCode === 13 && event.isComposing === false) {
                const comment = event.target.value
                const playlistId = event.target.getAttribute('data-playlist')

                if (!comment) {
                    alertMessage('코멘트를 입력해주세요', 'error')
                    return false
                }

                let result = await fetchData('/comment/store', 'POST', {
                    comment,
                    playlistId
                })

                if (result.result === true) {
                    location.reload()
                } else {
                    alertMessage(result.message, "error")
                }
            }
        })
    }
})