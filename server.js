//we use express by requiring it via Node.js builtin require() function which returns the exported object
const express = require('express')
//creates an express application
const app = express();      //express() function is a toplevel function exported via express

//set view engine for rendering dynamic html via ejs
app.set('view engine', 'ejs')

/* body-parser must be used BEFORE CRUD handlers 

To USE body-parser we dont have to install since express comes with it
**Its middleware --middleware is the methods/functions/operations that are called BETWEEN processing a request and sending a response**
    -express lets us use middleware with the use() method
    -body-parser extracts entire body portion of 
    an incoming request stream and exposes it on a req.body
*/
app.use(express.urlencoded({ extended: true })) //parses request of any type - strings, arrays, json objects
app.use(express.json())      //parses requests where the content-type is an object - headers would contain application/json

//call middleware to serve static files found in this directory
app.use(express.static('public'))

const connectionString = "mongodb+srv://izzy:Jesus115@cluster0.qm5c1.mongodb.net/test?retryWrites=true&w=majority"

//mongo class allows for making connections to MongoDB via clients connect method
const MongoClient = require('mongodb').MongoClient

//MongoDB supports promises 
MongoClient.connect(connectionString)
    .then(client => {

        //grabbed db from client and renamed it star-wars-quotes and stored it into a variable we can refer back to
        const db = client.db('star-wars-quotes')    //changes the default db name from test to whatever you want by passing the string as arg

        //to store data to db we need to create a collection via db.collection --client.db.collections--and passing the collection name as an arg
        const quotesCollection = db.collection('quotes')

        console.log('Connected to DB via promises')

        //CRUD handlers -- must be in the then to be connected to db 
        app.get('/', (req, res) => {
            /*
            console.log('Logged in the terminal')
            console.log(__dirname)      //node enviornment variable that contains the absolute path of the current directory containing currently executing file
            res.sendFile(__dirname + '/index.html') // w/o __dirname concat to the html we want rendered the path is read for the root directory like so C:/index.html and is never found
        */

            db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', { quotes: results })

                })
                .catch(err => console.error(err))

        })

        //needed middleware-bodyparser accomplish via express.json() && express.urlencoded()
        app.post('/quotes', (req, res) => {
            console.log('Data from form req is: ' + req.body)

            //can use insertOne() method from mongo to add items to mongodb
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log('My Result is: ' + result)
                    res.redirect('/')
                })
                .catch(err => console.error(err))
        })

        app.put('/quotes', (req, res) => {
            console.log(req.body)
            quotesCollection.findOneAndUpdate(  //collection method
                { name: "Obi-Wan Kenobi" },  //query for this key
                {
                    $set: {   //update data via $set
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                { upsert: true }    //options: if no quote for obi wan is fond then Mongo will create a new quote with the req for the updated data
            )
                .then(result => res.json('Success'))
                .catch(err => console.error(err))
        })

        app.delete("/quotes", (req, res) => {
            console.log(req.body)
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete!')
                    }
                    res.json(`Deleted Vadar quote ${req.body} : ${req.body.name}`)
                })
                .catch(err => console.error(err))
        })

    })
    .catch(err => console.error(err))



//create a server that browsers can connect to - via Express' listen method
app.listen(process.env.PORT || 8080, () => {
    /*NOTE: process is a GLOBAL Node.js object 
    that provides various information sets about the runtime of the program
    
    process: CAN BE ACCESSED in any module W/O requiring it since its a global object
     */
    console.log("listening on any port detected in the enviornment. If no port is detected then listen on 8080")
})