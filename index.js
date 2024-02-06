const express = require("express");
const app = express();
const Menu = require('./config');
const { setDoc,doc, getDoc } = require('firebase/firestore');
const { default: axios } = require("axios");
var FormData = require('form-data');
const fs = require('fs');

app.listen(3000, function () {
  console.log("Server is running");
});

app.get("/", (req, res) => {
  res.send("Go to the /update route to update the Menu");
});


app.get("/update",async (req,res)=>{

  const data = new FormData();
  data.append('input', fs.createReadStream('Menu.pdf'));
  data.append('dup_check', 'False');
  
  var menu_json = {};

  await axios.request({
    method:'post',
    maxBodyLength:Infinity,
    url: 'https://vetwkzas8k.execute-api.us-east-1.amazonaws.com/prod',
    headers: { 
      'x-api-key': 'LgVQGDBXXm3RMZ4QQzJRX4ZPVysCziu23fJ72XB9'
    },
    data : data
  })
  .then((res) => {
    var menu_table = res.data.Tables[0].TableJson;
    for (var v = 4; v <= 28; v += 4) {
      menu_json[menu_table[v][0]] = {
        Breakfast: [menu_table[v - 3][2], menu_table[v - 3][3]],Lunch: [menu_table[v - 2][2], menu_table[v - 2][3]],
        Snacks: [menu_table[v - 1][2], menu_table[v - 1][3]],Dinner: [menu_table[v][2], menu_table[v][3]],
      };
    }
  })
  .catch((err) => {
    console.log(err);
  });

  for (const day in menu_json) {
    setDoc(doc(Menu, day), menu_json[day])
      .then((res) => {
        console.log("Successfully updated the menu for ",day);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    res.send({
      Success: "Updated the menu",
      new_menu:menu_json
    });
});