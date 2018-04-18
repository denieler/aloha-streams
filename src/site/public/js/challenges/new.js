document.addEventListener('DOMContentLoaded', function () {
  const descriptionLink = document.getElementById('description-link')
  const descriptionOptionalLabel = document.getElementById('description-optional-label')
  const descriptionTextarea = document.getElementById('description-textarea')

  descriptionLink.addEventListener('click', () => {
    descriptionOptionalLabel.classList.remove('hidden')
    descriptionOptionalLabel.classList.add('hiddenOpacity')
    descriptionTextarea.classList.remove('hidden')
    descriptionTextarea.classList.add('hiddenOpacity')

    setTimeout(() => {
      descriptionOptionalLabel.classList.add('appearOpacity')
      descriptionTextarea.classList.add('appearOpacity')
    }, 100)
  })
})
