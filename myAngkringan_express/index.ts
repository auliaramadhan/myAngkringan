
import * as express from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'
import * as multer from "multer"

const api =  require("./src/route")


require("dotenv").config();

const port = process.env.APP_PORT || 3000,
  upload = multer();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: [
    './src/route/item.js',
    './src/route/cart.js',
  ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
app.use('/swagger', swaggerUi.serve,swaggerUi.setup(swaggerSpec))


// ini dibawah biar bisa pake form data
// app.use(upload.array());

app.use(express.static(__dirname+"/public"));

app.use('/api', api)


app.get("/", (req, res) => {
  res.send("helo");
});

app.listen(port, () =>  console.log('berjalan di port '+port));