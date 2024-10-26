require("dotenv").config()
const 
  cors = require('cors'),
  express = require("express"),
  serveStatic = require("serve-static"),
  history = require('connect-history-api-fallback')

const app = express()

const { Client } = require("@notionhq/client")
const notion = new Client({ auth: process.env.NOTION_KEY })

// http://expressjs.com/en/starter/static-files.html
app.use(serveStatic("public"))
app.use(express.json()) // for parsing application/json
app.use(cors())

console.log('starting server')
console.log('starting notion client: ', notion)

// Get database properties
app.post("/database", async function (request, response) {
  response.set('Access-Control-Allow-Origin','*')
  console.log('getting DB')

  try {
    const database = await notion.databases.retrieve({ database_id: request.body.database });
    response.json({ message: "success!", data: database })
  }  
  catch (error) {
    response.json({ message: "error", error })
  }
})

// Create new page. The database ID is provided in the web form.
app.post("/pages", async function (request, response) {
  response.set('Access-Control-Allow-Origin','*')
  console.log('body: ', request.body)

  try {
    const newPage = await notion.pages.create({
      parent: {
        database_id: request.body.databaseId,
      },
      properties: request.body.properties
    })
    response.json({ message: "success!", data: newPage })
  } catch (error) {
    response.json({ message: "error", error })
  }
})
const port = process.env.PORT || 3000
// listen for requests :)
const listener = app.listen(port, '::', () =>
  console.log(`Listening on port ${port}`)
)
