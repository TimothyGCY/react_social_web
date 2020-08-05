const router = require('express').Router()
const VERIFY = require('./verify')
const redis = require('redis')
const client = redis.createClient(6379, '127.0.0.1')

client.on('error', function (err) {
  console.log('Error: ' + err)
})

client.on('connect', function () {
  console.log('Redis client connected')
})

router.post('/updownstate', VERIFY, async (req, res) => {
  console.log(req.body)
  client.hget(req.user._id, req.body.feedid, function (err, resp) {
    if (resp == 1) res.json({ upvoted: true, publisher: req.user._id })
    else if (resp == -1) res.json({ downvoted: true, publisher: req.user._id })
    else res.json({ upvoted: false, downvoted: false, publisher: req.user._id })
  })
})

router.put('/updownstate', VERIFY, async (req, res) => {
  console.log(req.body)
  client.hset(
    req.user._id,
    req.body.feedid,
    req.body.upvoted ? 1 : -1,
    function (err, resp) {
      console.log(resp)
    },
  )
})

module.exports = router
