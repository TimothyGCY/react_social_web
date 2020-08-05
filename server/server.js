const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
let ws = require('express-ws')
ws = ws(express())
const logger = require('morgan')
const bodyParser = require('body-parser')

const userRouter = require('./routes/user.route')
const feedRouter = require('./routes/feed.route')
const cacheRouter = require('./routes/cache.route')

require('dotenv').config()

const app = ws.app
const port = process.env.PORT || 5000

app.use(express.static('public'))

app.set('secretKey', 'nodeRestApi') // jwt secret token
app.set('TOKEN_SECRET', "uhsduh92hfhwes8hwbdguwrgho213rtrio")

//CORS middleware
let corsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost') //replace localhost with actual host
    res.header(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, PUT, PATCH, POST, DELETE',
    )
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With, Authorization',
    )

    next()
}

app.use(corsMiddleware)

const corsOption = {
    exposedHeaders: 'auth-header',
}
app.use(cors(corsOption))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    )
    next()
})

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
})

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/user', userRouter)
app.use('/api/feed', feedRouter)
app.use('/api/cache', cacheRouter)


// const wsInstance = ws(app)
const aWss = ws.getWss('/api/feed')
app.ws('/api/feed', (ws, req) => {
    console.log('socket connection established')
    // ws.on('message', function incoming(message) {
    //     console.log(JSON.stringify(message))
    //     ws.broadcast(message)
    // })
    ws.onmessage = function(msg) {
        console.log(msg.data)
        aWss.clients.forEach(function(client) {
            client.send(msg.data)
        })
    }

    // ws.broadcast = function broadcast(data) {
    //     wsInstance.getWss().clients.forEach(function each(client) {
    //         client.send(data)
    //     })
    // }
    // ws.on('pong', function heartbeat() {
    //     this.isAlive = true
    // })
})

// setInterval(function pingAllConnections() {
//     wsInstance.getWss().clients.forEach(function (ws) {
//         if (ws.isAlive === false) return ws.terminate();
//         ws.isAlive = false;
//         ws.ping();
//     })
// }, 10000)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
