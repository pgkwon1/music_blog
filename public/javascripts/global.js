// query selector shortcut
const query = document.querySelector.bind(document)
const queryAll = document.querySelectorAll.bind(document)

document.addEventListener("DOMContentLoaded", () => {

    const menuList = queryAll(".nav-link")
    const link = window.location.pathname
    menuList.forEach(menu => {
        menu.classList.remove("active")
    })
    const activeLink = query(".nav-link[href='" + link + "'")
    if (activeLink !== null) {
        activeLink.classList.add("active")
    }
    document.querySelector('.navbar-toggler').addEventListener("click", event => {
        const navbar = query('#navbarNav')
        if (typeof navbar !== "undefined") {
            if (navbar.style.display === '' || navbar.style.display === "none") {
                navbar.style.display = 'block'

            } else if (navbar.style.display === "block") {
                navbar.style.display = 'none'
            }
        }
    })

    if (query('.footer-player') instanceof HTMLElement) {
        document.addEventListener("scroll", () => {
            const elem = query("footer");
            const player = query(".footer-player");

            const rect = elem.getBoundingClientRect();
            if (rect.top < 1000) {
                player.classList.remove("position-fixed")
            } else {
                player.classList.add("position-fixed")
            }
        })
    }
    queryAll('.music-list').forEach(listElem => {
        const playlistId = listElem.getAttribute('data-playlist')
        Sortable.create(listElem, {
            animation: 150,
            async onEnd(event) {
                let updateMusic = []

                const musicList = Array.prototype.slice.call(event.to.children)
                musicList.forEach((music, order) => {
                    const id = music.getAttribute('data-music-index')
                    const index = order + 1 
                    updateMusic.push({
                        order: index,
                        id
                    })
                    
                })  
                updateMusic = updateMusic.filter(music => music.id !== null)

                await fetchData('/music/orderUpdate', 'PATCH', {
                    playlistId, 
                    updateMusic
                })
                
            }
        });    
    })
    

})

const alertMessage = (message, type) => {
    query('.show-error').style.opacity = 0
    query('.show-message').style.opacity = 0
    const alertElem = query('.show-' + type)
    alertElem.innerHTML = message
    alertElem.style.opacity = 1
    window.scrollTo(0, 0);

}

const fetchData = async (url, method, data, addHeaders) => {
    const token = document.querySelector('[name="_csrf"]').value
    const allowMethod = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    if (token === null || token === undefined || token === '') {
        alertMessage("올바르지 않은 접근입니다.", "error")
    }
    
    if (!allowMethod.includes(method)) {
        alertMessage("올바르지 않은 접근입니다.", "error")
    }
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN' : token,
    }

    if (addHeaders !== undefined) {
        for (const [key, value] of Object.entries(addHeaders)) {
            if (key === 'Content-Type' || key === 'X-CSRF-TOKEN') {
                return {
                    result : false,
                    message : "올바르지 않은 접근입니다."
                }
            }
            headers.key = value
        }
    }
    let result = await fetch(url, {
        method, 
        headers, 
        body : JSON.stringify(data)
    })
    result = await result.json()
    return result
}