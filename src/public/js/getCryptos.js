/* eslint-disable  no-unused-vars, no-undef */
const urlBase = new URL(window.location.origin)
const urlDOM = document.getElementById('host')
urlDOM.textContent = urlBase.host
const coins = ['bitcoin', 'ethereum', 'tether', 'dogecoin']

/**
 *
 * @param {string} coin
 * @returns {Promise}
 */
function getCoinData(coin) {
  return new Promise((resolve, reject) => {
    fetch(`${urlBase}api/crypto/${coin}`)
      .then((response) => {
        response.json().then((data) => {
          resolve(data)
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}
/**
 *
 * @param {object} data
 */
function setData(data) {
  const responseDOM = document.getElementById('response')
  let dataParsed = JSON.stringify(data, null, 4)
  dataParsed = dataParsed.replace(/\n/g, '<br>')
  dataParsed = dataParsed.replace(/\s/g, '&nbsp;')
  dataParsed = dataParsed.replace(/"/g, '')
  const pElement = document.createElement('p')
  pElement.innerHTML = dataParsed
  responseDOM.appendChild(pElement)
}

window.onload = async () => {
  const coin = coins[Math.floor(Math.random() * coins.length)]
  document.getElementById('coin').textContent = coin
  const data = await getCoinData(coin)
  setData(data)
}
