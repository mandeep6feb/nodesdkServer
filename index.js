const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwtRegister = require("./controllers/auth");
const app = express();
const fs = require("fs");

let  verifyTokenWithParam = require("./controllers/verifyTokenWithToken");
app.use('/document', express.static('uploads'))
app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/sita/",verifyTokenWithParam,  (req, res) => {
  let our =  req.query.token;
  verifyTokenWithParam = our;
  if(verifyTokenWithParam) {
    const contents = fs.readFileSync("./userData/user.json", "utf-8");
    const parsedData = JSON.parse(contents);
    console.log(parsedData);
    return res.send( parsedData);
  } else {
    return res.send( 'error' );
  }
    // console.log('Your Token = ' +  our);
    // res.send( " Welcome To The Node SDK. Upload Your File ...route is /upload-document/yourFolderName" );
});

app.use("/", jwtRegister);
app.listen(PORT, () => {
  console.log(" Welcome To The Node SDK. Upload Your File ...route is /upload-document/yourFolderName" )
  console.log(` Server is running on port http://localhost:${PORT}`);
});


// let http = require('http');
// let url = require('url');
// let querystring =  require('querystring');
// http.createServer( (req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello World! ');
//   res.end();
//   pathName = url.parse(req.url).pathname;
//   query= url.parse(req.url).query;
//   console.log('pathName' + pathName);    
//   console.log('query' + query);
// }).listen(7000);

