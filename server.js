const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.set('port', (process.env.PORT || 3001));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function checkPalindromes(str) {
  /*Assume str has no punctuation and assume letter case does not matter*/
    str = str.toLowerCase().split(' ').join('');
    return str === str.split('').reverse().join('');
}

function filterKeyPalindromes(data, file) {
  if (Array.isArray(data)) {
          return data.filter((x) => {
                    //return all objects with the "key" property
                    if (x.hasOwnProperty("key")) {
                      return x.key;
                    }
                  })
                  .map((x) => (x.key)) //returns all the values of the "key" property
                  .filter((x) => checkPalindromes(x)); //returns values that return true in checkPalindromes

  }
  else {
    console.log("Error in "+ file.slice(5) + " : Please upload JSON array of objects.")
  }
}

app.get('/palindromes', function(req, res) {
  // Go to uploads directory
  fs.readdir( './uploads', function( err, files ) {
    let palindromeArray = [];
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach(function( file, index ) { //Loop through all files in ./uploads
          let filePath = path.join( './uploads', file );

          let data =  fs.readFileSync(filePath, "utf-8"); //read file

            let filterKey = filterKeyPalindromes(JSON.parse(data), file); //find "key" and if it has palindromes
            if (filterKey) {
              palindromeArray = palindromeArray.concat({
                "id": file,
                "filename": file.slice(5),
                "palindromes": filterKey,
                "nameId": file.slice(0,6),
                "countId": file.slice(1,6)
              })
            }

            if (index === (files.length - 1)) {
              res.json(palindromeArray)
            }
            
        })
      });
})

app.get("/palindromes/count", function(req, res) {
  let palindromeArrayCount = [];
 axios.get("http://localhost:3001/palindromes")
  .then((r) => palindromeArrayCount = palindromeArrayCount.concat(r.data.map((x) => ({
      'id': x.id,
      'palindromeCount': x.palindromes.length //calculate length of array
      })
    )
  ))
  .then((s) => res.json(palindromeArrayCount))
  .catch((error) => res.send(error.message));
})

app.post("/uploadJson", upload.single('file'), function(req, res, next) {
  // get the temporary location of the file
 var tempPath = req.file.path;
 // set the unique identifier + original file name in the "./uploads" directory
 var targetPath = './uploads/' + req.file.filename.slice(0,4) + '-' + req.file.originalname ;
 // move the file from the temporary location to the intended location
 fs.rename(tempPath, targetPath, function(err) {
     if (err) throw err;
     // delete the temporary file, so that ./upload dir does not get filled with unwanted files
     fs.unlink(tempPath, function() {
         if (err) throw err;
         console.log('File uploaded to: ' + targetPath);
         res.send(targetPath)
     });
   });
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
