const app = require('./app')
const { PORT } = require('./conf')
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))
