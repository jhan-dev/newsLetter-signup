const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    
    const fName = req.body.fName
    const lName = req.body.lName
    const email = req.body.email

    // console.log(`${fName} ${lName} ${email}`)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us21.api.mailchimp.com/3.0/lists/a08e58efef"

    const options = {
        method: "POST",
        auth: "jhan:4967481ecaf1fe856bd1e5c1c6d7b5e4-us21"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(port, function(){
    console.log(`Server is running on port ${port}.`)
})