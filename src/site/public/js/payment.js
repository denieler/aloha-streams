/* global StripeCheckout, paypal */
(function () {
  var confirmPayment = function (paymentId, paymentMethodName, status) {
    var _csrf = document.getElementById('_csrf').value
    var challengeId = document.getElementById('challengeId').value

    fetch('/challenge/' + challengeId + '/payment', {
      body: JSON.stringify({
        paymentMehtod: paymentMethodName,
        tokenId: paymentId,
        status: status
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
        if (result.error) {
          throw new Error('Something goes wrong during the payment. Please ask our support for the help.')
        }

        window.location.href = '/challenges/success'
      })
  }

  var configureStripe = function (price, fee) {
    var amount = parseFloat(price) + parseFloat(fee)
    var handler = StripeCheckout.configure({
      key: 'pk_test_srw0eAkx9YROpz8MwVL8cu3n',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function (token) {
        const tokenId = token.id
        confirmPayment(tokenId, 'stripe')
      }
    })

    document.getElementById('stripe-submit-payment').addEventListener('click', function (e) {
      // Open Checkout with further options:
      handler.open({
        name: 'WannaCommit',
        description: 'New challenge',
        currency: 'usd',
        amount: amount * 100
      })
      e.preventDefault()
    })

    // Close Checkout on page navigation:
    window.addEventListener('popstate', function () {
      handler.close()
    })
  }

  var configurePaypal = function (price, fee) {
    var amount = parseFloat(price) + parseFloat(fee)
    paypal.Button.render({
      env: 'sandbox',
      style: {
        label: 'paypal',
        size: 'medium',
        shape: 'rect',
        color: 'blue',
        tagline: false
      },
      client: {
        sandbox: 'AWJcBuimdKksfSYkKiqsGS7ra_MlCF1L8pw43So8IycqnqBEeU4oWv6Jxg5xvBYm9-bJy8IZ14pLFVzy',
        production: 'xxxxxxxxx'
      },
      commit: true,
      payment: function (data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [{ amount: { total: amount, currency: 'USD' } }]
          }
        })
      },
      onAuthorize: function (data, actions) {
        return actions.payment.execute().then(function (payment) {
          var status = payment.state
          var paymentId = payment.id
          confirmPayment(paymentId, 'paypal', status)
        })
      }
    }, '#paypal-submit-payment')
  }

  document.addEventListener('DOMContentLoaded', function () {
    var StripePaymentButton = document.getElementById('stripe-submit-payment')
    var PaypalPaymentButton = document.getElementById('paypal-submit-payment')
    var RadioButtonStripe = document.getElementById('radio-stripe')
    var RadioButtonPayPal = document.getElementById('radio-paypal')

    StripePaymentButton.style.display = 'block'
    PaypalPaymentButton.style.display = 'none'

    RadioButtonStripe.addEventListener('change', function (e) {
      if (e.target.value === 'stripe') {
        StripePaymentButton.style.display = 'block'
        PaypalPaymentButton.style.display = 'none'
      }
    })
    RadioButtonPayPal.addEventListener('change', function (e) {
      if (e.target.value === 'payPal') {
        StripePaymentButton.style.display = 'none'
        PaypalPaymentButton.style.display = 'block'
      }
    })

    var price = document.getElementById('price').value
    var fee = document.getElementById('fee').value

    configureStripe(price, fee)
    configurePaypal(price, fee)
  })
})()
