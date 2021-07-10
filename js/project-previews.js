// handles project preview functionality
let cardPreviewButtons = document.querySelectorAll(".card-preview");

const showHidePreview = (e) => {
    let isHovering = e.type == 'mouseover' ? true : false;
    if (isHovering) { // show preview when user hovers preview button
        let card = e.target.closest(".card");
        card.classList.add('preview');
    } else { // hide preview when user leaves preview button or scrolls on
        let cards = document.querySelectorAll(".card");
        for(i = 0; i < cards.length; i++){
            cards[i].classList.remove('preview');
        }
    }
};

for (let i = 0; i < cardPreviewButtons.length; i++) {
    cardPreviewButtons[i].addEventListener('mouseover', showHidePreview, true);
    cardPreviewButtons[i].addEventListener('mouseleave', showHidePreview, true);
}

window.addEventListener('scroll', showHidePreview, true);