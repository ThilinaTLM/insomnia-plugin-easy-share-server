const express = require("express")
const short = require("short-uuid")

const app = express()

const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const STORAGE = new (class {
    constructor() {
        this.data = {}
    }

    is_exists(id) {
        return Boolean(this.data[id]);
    }

    generate_id() {
        return Math.random().toString(36).substring(4).slice(1, 7)
    }

    generate_pwd() {
        return Math.random().toString(36).substring(4).slice(1, 5)
    }

    request_slot() {
        let id = this.generate_id()
        while (this.is_exists(id)) id = this.generate_id()
        const pwd = this.generate_pwd()
        this.data[id] = {pwd, reserved_time: new Date()}
        return {id, pwd}
    }

    read(id) {
        if (this.is_exists(id)) {
            const slot = this.data[id]
            if (slot.updated_time) {
                return slot.data
            }
        }
        return null
    }

    save(id, pwd, data) {
        if (this.is_exists(id)) {
            const slot = this.data[id]
            // check password
            if (slot.pwd === pwd) {
                this.data[id].data = data
                this.data[id].updated_time = new Date()
                return true
            } else {
                return false
            }
        } else {
            const now = new Date()
            this.data[id] = {id, pwd, data, reserved_time: now, updated_time: now}
            return true
        }
    }

})()

app.get('/', (req, res) => {
    const {id, pwd} = STORAGE.request_slot()
    res.status(200).json({id, pwd, message: "Success"})
})

app.get('/:id', (req, res) => {
    const id = req.params.id
    const data = STORAGE.read(id)

    if (data === null) {
        res.status(404).json({
            message: "Not Found"
        })
        return
    }

    res.status(200).json({
        data,
        message: "Success"
    })

})

app.post('/:id', (req, res) => {
    const {data} = req.body
    const {id} = req.params
    const {pwd} = req.query
    if (id && pwd && data) {
        if (STORAGE.save(id, pwd, data)) {
            res.status(200).json({message: "Success"})
            return
        }
        res.status(400).json({message: "Incorrect password (pwd)"})
        return
    }
    res.status(400).json({message: "Bad request details are missing"})
})


app.listen(PORT, () => console.log(`Listening... ${PORT}`))