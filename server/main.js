const express = require("express")
const {log} = require('./utils');
const routes = require('./controllers');

const app = express()

const PORT = Number(process.env.PORT) || 4000
app.use(routes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// setInterval(STORAGE.clean_older_slots, 10*60_000)
app.listen(PORT, () => log("STARTED API GATEWAY AT", `PORT:${PORT}`))