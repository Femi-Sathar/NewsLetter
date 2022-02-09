//Refer - https://mailchimp.com/developer/marketing/docs/fundamentals/

const express = require('express');
//const request = require('request'); Didn't need to use this

const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
//This lets us server static assets like javascript or css
app.use(express.static("public"));

//This line makes it easier to parse the the request by placing the information in the request body.
app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  let fn = req.body.fname;
  let ls = req.body.sname;
  let email = req.body.email;

  //Mailchimp API Paramenters
  mailchimp.setConfig({
    apiKey: "", // your API key
    server: "us14"
  });

  const listId = ""; //your List ID

  //Mailchimp API POST New Subscriber Function
  async function run() {
    //"Try" this function and if successful do the following
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        merge_fields: {
          FNAME: fn,
          LNAME: ls,
        },
        email_address: email,
        status: "subscribed"
      });

      //My Custom Response. You can log anything you want, like just the whole 'response' too
      console.log(`${response.merge_fields.FNAME} ${response.merge_fields.LNAME} with email ${response.email_address} has been successfully registered`);



      res.sendFile(__dirname + "/success.html")
    }
    // If the 'Try' function isn't successful, do this on failure.
    catch (err) {
      //This is will return the error code
      console.log(err.status)
      res.sendFile(__dirname + "/failure.html")
    }
  }
  run();
})

app.post("/failure", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000;");
})
