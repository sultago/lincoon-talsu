const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const { LocalStorage } = require('node-localstorage')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const localStorage = new LocalStorage('./scratch')

app
    .prepare()
    .then(() => {
        const server = express()
        server.use(bodyParser.json())
        server.use(bodyParser.urlencoded({ extended: true }))

        server.get('/api/getAll', (req,res) => {
            const result = {}
            for (let i = 0; i < localStorage.length; ++i) {
                const key = localStorage.key(i);
                result[key] = JSON.parse(localStorage.getItem(key));
            }
            res.jsonp(result)
        })

        server.get('/api/:key', (req, res) => {
            const { key } = req.params
            console.log(key)
            res.jsonp(JSON.parse(localStorage.getItem(key)))
        })

        server.post('/api/:key', (req, res) => {
            const { key } = req.params
            const value = req.body;

            console.log(`key: ${key}, value: ${JSON.stringify(value)}`)
            localStorage.setItem(key, JSON.stringify(value))
            res.jsonp({done:true})
        })

        server.delete('/api/:key', (req, res) => {
            const { key } = req.params
            localStorage.removeItem(key)
            res.jsonp({done:true})
        })

        server.get('/api/clearAll', (req, res) => {
            localStorage.clear()
            res.jsonp({done:true})
        })

        server.get('/p/:key', (req,res) => {
            const actualPage = '/post'
            const queryParams = {key:req.params.key}
            app.render(req, res, actualPage, queryParams)
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(3000, err => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    })