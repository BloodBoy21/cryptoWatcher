const fs = require('fs')
const path = require('path')
const pathToLog = path.join(__dirname, '../logs/')
if (!fs.existsSync(pathToLog)) {
  fs.mkdirSync(pathToLog)
}
exports.createLog = function (log) {
  const fileName = `${pathToLog}${new Date().getTime()}.log`
  fs.writeFile(fileName, log, (err) => {
    if (err) throw err
  })
}
