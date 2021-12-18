const scrape = require('scrape-it')
const fs = require('fs')
const urlBase = 'https://www.livecoinwatch.com'
const path = require('path')
const cryptoIDs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/cryptoID.json'), 'utf8')
)

function getData(conf, url = urlBase) {
  return new Promise(function (resolve, reject) {
    scrape(url, conf)
      .then(({ data }) => {
        resolve(data)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}
function updateCryptoIDS(cryptos) {
  cryptos.forEach((crypto) => {
    if (!(crypto.name in cryptoIDs)) {
      cryptoIDs[crypto.name] = crypto.id
    }
  })
  fs.writeFileSync('cryptoID.json', JSON.stringify(cryptoIDs))
}
async function getTop50() {
  const conf = {
    cryptos: {
      listItem: 'tr.table-row',
      data: {
        name: {
          selector: 'small.text-truncate',
          convert: (x) => x.split(' ').join('-').toLowerCase()
        },
        mainPrice: 'td.main-price',
        marketCap: {
          selector: 'td.price',
          convert: (x) => '$' + x.split('$')[1]
        },
        volume: 'td.volume',
        id: {
          selector: 'a.text-left',
          attr: 'href',
          convert: (x) => x.split('/').at(-1)
        }
      }
    }
  }
  const data = await getData(conf)
  const cryptos = await data.cryptos.filter((x) => {
    delete x.id
    if (x.name !== '') {
      return x
    }
    return false
  })
  updateCryptoIDS(cryptos)
  return cryptos
}
async function getCryptoData(id) {
  id = cryptoIDs[id]
  if (!id) {
    return null
  }
  const splitData = (data, pos = 1) => {
    return '$' + data.split('$')[pos]
  }
  const conf = {
    crypto: {
      selector: 'div.coin-tools',
      data: {
        price: {
          selector: 'span.price',
          convert: (x) => splitData(x)
        },
        marketCap: {
          selector: 'span.no-grow',
          convert: (x) => splitData(x)
        },
        volume: {
          selector: 'span.price',
          convert: (x) => splitData(x, 3)
        },
        percent: {
          selector: 'span.percent'
        }
      }
    }
    /* stats: {
      selector: "div.col-xl-7",
      data: {
        hour: {
          selector: "span.percent",
          eq: 1,
        },
        day: {
          selector: "span.percent",
          eq: 2,
        },
        week: {
          selector: "span.percent",
          eq: 4,
        },
        month: {
          selector: "span.percent",
          eq: 6,
        },
      },
    }, */
  }
  const data = await getData(conf, `${urlBase}/price/${id}`)
  return data.crypto
}

module.exports = {
  getTop50,
  getCryptoData,
  cryptoIDs
}
