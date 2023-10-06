const router = require('express').Router();
const stream = require("stream");
const STORAGE = require('../Storage');




router.get('/', (req, res) => {
    const {id, pwd} = STORAGE.request_slot()
    res.status(200).json({id, pwd, message: "Success"})
})

router.get('/:id', (req, res) => {
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

router.get('/file/:id', (req, res) => {
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

router.post('/:id', (req, res) => {
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

module.exports = router;