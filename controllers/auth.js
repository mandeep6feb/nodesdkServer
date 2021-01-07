const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const VerifyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
router.post("/register", async (req, res) => {

  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const postData = {
    id: Math.random(),
    password: hashedPassword,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    mobile: req.body.mobile,
    image: req.body.image,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
  };
  // const realData = jsonObject.table.push(postData);
  fs.appendFile(
    "./userData/user.json",
    JSON.stringify(postData, null, 2),
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .send("There was a problem registering the user`.");
      } else {
        console.log("inserted");
        // create a token
        const token = jwt.sign({ id: req.body.email }, config.secret, {
          expiresIn: 86400,
        });
        console.log(token);
        res.status(200).send({ auth: true, token: token });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const contents = fs.readFileSync("./userData/user.json", "utf-8");
  console.log(contents);
  jsonContents = JSON.parse(contents);
   console.log(jsonContents.email);
  // jsonContents.forEach( i => {
    if (jsonContents.email === req.body.email) {
      // console.log(req.body.password);
      var passwordIsValid = bcrypt.compareSync(req.body.password, jsonContents.password) ;
      // console.log(passwordIsValid);
      if(passwordIsValid) {
        const token = jwt.sign({ id: req.body.id }, config.secret, {
          expiresIn: '31d'
        });
        res.status(200).send({ auth: true, token: token, email: jsonContents.email });
      } else {
        return res.status(404).send({message: "enter correct password."});
      }
    } else {
      return res.status(404).send({message: "No user found... Please check email first"});
    }
  // })5568
});

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

router.get("/getProfile", VerifyToken, (req, res, next) => {
  const contents = fs.readFileSync("./userData/user.json", "utf-8");
  const parsedData = JSON.parse(contents);
  console.log(parsedData);
  return res.send({ message: parsedData });
});
let FileName;
router.post('/upload-document/:folder', VerifyToken, (req, res, next) => {
    var storage = multer.diskStorage({
         destination: (req, file, cb) => {
             setTimeout( () => {
                             fs.mkdir('uploads/' + req.params.folder, (err) => {if(err) {cb(null, 'uploads/' + req.params.folder );
                                 } else {console.log( ' Success Created!!'); cb(null, 'uploads/' + req.params.folder );}})
                         }, 1000)},
              filename: (req, file, cb) => {
                  FileName = file.originalname;
                  cb(null, `${file.originalname}`)
              } 
     });
     //  const upload = multer( { storage: storage }).fields([{ name:"profile", maxCount: 1},{ name:"vendor_adhar", maxCount: 1},{ name:"registration_certificate", maxCount: 1},{ name:"documentary_proof", maxCount: 1},{ name:"certificate_documentary", maxCount: 1},{ name:"cancelled_cheque", maxCount: 1},{ name:"vendor_insurance", maxCount: 1}]);
 const upload = multer( { storage: storage }).any();
 upload(req, res , (err) => {
    VID2 = req.params.folder;
    const file = req.file;
      if (err) {
          const error = new Error('No File');
          return next(error);
      }
      else{
          res.json({
          message: "File Uploaded",
          success: true,
          profile_url:`http://localhost:3000/document/${req.params.folder}/${FileName}`,
          });
      }
    });
});

// router.post("/upload", VerifyToken ,upload.single("file"), (req, res, next) => {
//   if (!req.file) {
//     console.log("No file is available!");
//     return res.send({
//       success: false,
//     });
//   } else {
//     console.log("File is available!");
//     return res.send({
//       success: true,
//       profile_url: `baad me lena}`,
//     });
//   }
// });

module.exports = router;
