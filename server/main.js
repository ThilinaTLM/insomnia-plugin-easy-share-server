const express = require("express")
const stream = require("stream")

const app = express()

const PORT = Number(process.env.PORT) || 4000

app.use(express.json());
app.use(express.urlencoded({extended: true}));




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

app.get('/file/:id', (req, res) => {
    const id = req.params.id
    const data = STORAGE.read(id)

    if (data === null) {
        res.status(404).json({
            message: "Not Found"
        })
        return
    }

    const fileContents = Buffer.from(data, "utf-8");
    const readStream = new stream.PassThrough();
    readStream.end(fileContents);

    res.set('Content-disposition', `attachment; filename=Insomnia-${id}.json`);
    res.set('Content-Type', 'application/json');

    readStream.pipe(res);
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

// setInterval(STORAGE.clean_older_slots, 10*60_000)
app.listen(PORT, () => log("STARTED API GATEWAY AT", `PORT:${PORT}`))