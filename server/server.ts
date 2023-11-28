import * as dotenv from 'dotenv'
dotenv.config()

import server from './config/express'
import router from './api/routes/Routes'

server.use('/', router)

const port = process.env.PORT || 22194
server.listen(port, () => {
    console.log("Server running in port: " + port)
})