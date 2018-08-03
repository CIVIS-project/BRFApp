const express = require('express')
const geoip = require('geoip-lite')
const Log = require('../models/logs')

const router = module.exports = express.Router()

router.get('/geoip', function (req, res) {
  var geo = geoip.lookup('207.97.227.239'/* req.ip */)
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify(geo))

  Log.create({
    userId: req.user && req.user._id,
    category: 'geoip',
    data: geo,
    type: 'get'
  })
})
