const mongoose = require('mongoose')

function connectDB() {
    var url = "";
    if (process.env.DB_MODE === 'local' || url === '' || !url) {
        url = 'mongodb://localhost:27017/NitsResultPortal'
        console.log('Attempting to connect to Local Mongodb at PORT 27017')
    }
    mongoose.connect(
        url,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) console.log(err)
            else console.log('Database Connected!')
        }
    )
}

module.exports = connectDB
