require('dotenv').config()

const express = require('express')
const cors = require('cors')
const request = require('request')

let servers = [
    {url: 'https://extract-mkv-subtitle-prd-01.herokuapp.com', status: true}, 
    {url: 'https://extract-mkv-subtitle-prd-02.herokuapp.com', status: true},
    {url: 'https://extract-mkv-subtitle-prd-03.herokuapp.com', status: true}
]
let cur = 0

const handlerError = res => error => res.status(500).send(error.message)

const handler = (req, res) => {
    const sList = servers.filter(s => s.status)
    if (!sList.length) return res.send('Nenhum servidor up')

    const _req = request({ url: sList[cur].url + req.url }).on('error', handlerError(res))
    req.pipe(_req).pipe(res)
    cur = (cur + 1) % sList.length
}

const profilerMiddleware = (req, res, next) => {
    const start = Date.now()
    res.on('finish', () => { console.log('Completed', req.method, req.url, (Date.now() - start) + 'ms') })
    next()
}

const pingServer = (url) => new Promise((resolve) => {
    request(url + '/api/v1/healthcheck', (error, response) => {
        const ret = { up: false, url }

        if(error) {
            ret.error = error
        } else if(response.statusCode == 200) {
            ret.up = true
        }

        return resolve(ret)
    })
})

const checkServers = () => {
    Promise.all(servers.map(s => pingServer(s.url))).then((heathList) => {
        heathList.map(s => {            
            servers = servers.map(servv => {
                if (servv.url != s.url && servv.status != s.up) {
                    console.log('Server status changed', s.url, s.up)
                    servv.status = s.up
                }
                return servv                 
            })
            cur = (cur + 1) % servers.length
        })
    })
}

const app = express()

app.use(cors())
app.disable('x-powered-by')

// app.use(profilerMiddleware)
app.get('*', handler)
    .post('*', handler)
    .put('*', handler)
    .patch('*', handler)
    .head('*', handler)
    .delete('*', handler)
    .connect('*', handler)
    .options('*', handler)
    .trace('*', handler)


setInterval(checkServers, process.env.HEALTH_CHECK_SERVER_TIME || 10000)

app.listen(process.env.PORT || 9099)