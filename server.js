console.log('May the Node be with you')

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv').config()

MongoClient.connect(process.env.URL)
    .then(client => {
        console.log('connected to database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(express.json())
        app.listen(3000, function() {
            console.log('listening on 3000')
        })

    
        app.get('/', (req, res) => {            
            quotesCollection
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
            // res.sendFile(__dirname + '/index.html')    
        })

        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection
                .findOneAndUpdate(
                    { name: 'Yoda'},
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote,
                        },
                    },
                    {
                        upset: true,
                    }
                )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name})
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vader's quote`)
                })
                .catch(error => console.error(error))
        })  
    })
    .catch(error => console.error(error))