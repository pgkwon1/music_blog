document.addEventListener("DOMContentLoaded", () => {

    const menuList = document.querySelectorAll(".nav-link")
    const link = window.location.pathname
    menuList.forEach(menu => {
        menu.classList.remove("active")
    })
    const activeLink = document.querySelector(".nav-link[href='"+link+"'")
    if (activeLink !== null) {
        activeLink.classList.add("active")
    }
})

const alertMessage = (message, type) => {
    document.querySelector('.show-error').style.opacity = 0
    document.querySelector('.show-message').style.opacity = 0
    const alertElem = document.querySelector('.show-'+type)
    alertElem.innerHTML = message
    alertElem.style.opacity = 1

} 