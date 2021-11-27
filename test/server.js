const {exec} = require('child_process')
const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
require('dotenv').config()
const port = 3000

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('err')
  }
	console.log('ok')
});


const app = express()

app.use(express.static(path.join(__dirname)))
app.get('/token', (req, res) => {
	res.send(process.env.TOKEN)
})

app.listen(port, () => {console.log(`http://localhost:${port}`)})