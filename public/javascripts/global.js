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
})

const alertMessage = (message, type) => {
    query('.show-error').style.opacity = 0
    query('.show-message').style.opacity = 0
    const alertElem = query('.show-' + type)
    alertElem.innerHTML = message
    alertElem.style.opacity = 1
    window.scrollTo(0, 0);

}