/* global ClipboardJS */

document.addEventListener('DOMContentLoaded', function () {
  // eslint-disable-next-line
  new ClipboardJS('.btn')

  const toggleMobileMenu = (e) => {
    const mobileMenu = document.getElementsByClassName('header__buttons')
    if (mobileMenu && mobileMenu.length) {
      mobileMenu[0].classList.toggle('header__buttons--show')
    }
  }
  const headerMenuBurgerLink = document.getElementById('header-buttons-mobile')
  headerMenuBurgerLink.addEventListener('click', toggleMobileMenu)
})
