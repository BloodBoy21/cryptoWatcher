exports.parser = async function (crypto) {
  return new Promise((resolve, reject) => {
    try {
      const keysToDelete = ['_id', '__v', 'name']
      crypto = crypto._doc ?? crypto
      const cryptoParsed = {}
      Object.keys(crypto).forEach((key) => {
        if (!keysToDelete.includes(key)) {
          cryptoParsed[key] = crypto[key]
        }
      })
      resolve(cryptoParsed)
    } catch (error) {
      reject(error)
    }
  })
}
