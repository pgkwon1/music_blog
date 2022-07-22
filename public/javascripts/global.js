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