const express = require('express')
const cors = require('cors')
const connectToMongo = require('./db')
connectToMongo();

const app = express()
app.use(cors())
app.use(express.json())
const port = 5003

// Available Routes 
app.use('/api/', require('./routes/user.js'))
app.use('/api/', require('./routes/articles.js'))

app.get('/', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    data: {
      message: "Server started."
    },
    error: {//if any exists
      message: "null"
    }
  })
})

app.listen(port, '0.0.0.0')