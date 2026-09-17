const express = require('express');
const app = express()
const port = 5767
const router = require('./routes/indexRouter')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})