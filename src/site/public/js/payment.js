document.addEventListener('DOMContentLoaded', function () {
  var handler = StripeCheckout.configure({
    key: 'pk_test_srw0eAkx9YROpz8MwVL8cu3n',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
      const _csrf = document.getElementById('_csrf').value
      const challengeId = document.getElementById('challengeId').value
      const tokenId = token.id

      fetch('/challenge/' + challengeId + '/payment', {
        body: JSON.stringify({
          paymentMehtod: 'stripe',
          tokenId
        }),
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': _csrf,
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        method: 'POST',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(result => {
        if (result.error)
          throw new Error('Something goes wrong during the payment. Please ask our support for the help.')
  
        window.location.href = '/challenges/success'
      })
    }
  })

  document.getElementById('submit-payment').addEventListener('click', function(e) {
    var price = document.getElementById('price').value
    var fee = document.getElementById('fee').value

    // Open Checkout with further options:
    handler.open({
      name: 'WannaCommit',
      description: 'New challenge',
      currency: 'usd',
      amount: (parseFloat(price) + parseFloat(fee)) * 100
    })
    e.preventDefault()
  })

  // Close Checkout on page navigation:
  window.addEventListener('popstate', function() {
    handler.close()
  })
})
