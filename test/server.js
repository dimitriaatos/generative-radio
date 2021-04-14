const {exec} = require('child_process')
const express = require('express')
const path = require('path')

exec('webpack --config ./test/webpack.config.js', (los) => {console.log(los)})

const app = express()

app.use(express.static(path.join(__dirname)))

app.listen(3000)