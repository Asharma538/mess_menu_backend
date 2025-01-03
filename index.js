const express = require("express");
const app = express();
const Menu = require("./config");
const { google } = require("googleapis");
const { setDoc, doc } = require("firebase/firestore");
const serviceAccountKeyFile = "./secret_files/iitjmessmenu-bfcf5d7e0b8e.json";

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}

app.listen(3000, function () {
  console.log("Server is running");
});

app.get("/", async (req, res) => {
  res.send("Go to the /update route to update the Menu");
});

app.get("/update", async (req, res) => {
  // // Code for updating menu from the google sheet

  // GIVE THE NEW SHEET ID HERE...
  const sheetId = "1djIwXt-W3AyR04DTF6KzFfQP3bpfxv04zdaXiNiTUDw";

  // GIVE THE TAB NAME HERE...
  const tabName = "Veg / Non Veg/Jain Menu";

  // GIVE THE RANGE HERE...
  const range = "A:G";

  // WAIT AND WATCH THE MAGIC HAPPEN...
  const googleSheetClient = await _getGoogleSheetClient();
  const data = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    range
  );

  // return res.send(data);

  var menu_json = {};

  for (let v = 2; v < data.length; v += 4) {
    menu_json[data[v][0]] = {
      Breakfast: [
        data[v][2] +
          ((data[v][3] != "-" && data[v][3] != "" )? "\nVEG SPECIAL: " + data[v][3] : "") +
          ((data[v][4] != "-" && data[v][4] != "" )? "\nNON-VEG SPECIAL: " + data[v][4] : "") +
          ((data[v][5] != "-" && data[v][5] != "" )? "\nJAIN SPECIAL: " + data[v][5] : ""),
        data[v][6],
      ],
      Lunch: [
        data[v + 1][2] +
          ((data[v + 1][3] != "-" && data[v + 1][3] != "") ? "\nVEG SPECIAL: " + data[v + 1][3] : "") +
          ((data[v + 1][4] != "-" && data[v + 1][4] != "") ? "\nNON-VEG SPECIAL: " + data[v + 1][4] : "") +
          ((data[v + 1][5] != "-" && data[v + 1][5] != "") ? "\nJAIN SPECIAL: " + data[v + 1][5] : ""),
        data[v + 1][6],
      ],
      Snacks: [
        data[v + 2][2] +
          ((data[v + 2][3] != "-" && data[v + 2][3] != "") ? "\nVEG SPECIAL: " + data[v + 2][3] : "") +
          ((data[v + 2][4] != "-" && data[v + 2][4] != "") ? "\nNON-VEG SPECIAL: " + data[v + 2][4] : "") +
          ((data[v + 2][5] != "-" && data[v + 2][5] != "") ? "\nJAIN SPECIAL: " + data[v + 2][5] : ""),
        data[v + 2][6],
      ],
      Dinner: [
        data[v + 3][2] +
          ((data[v + 3][3] != "-" && data[v + 3][3] != "") ? "\nVEG SPECIAL: " + data[v + 3][3] : "") +
          ((data[v + 3][4] != "-" && data[v + 3][4] != "") ? "\nNON-VEG SPECIAL: " + data[v + 3][4] : "") +
          ((data[v + 3][5] != "-" && data[v + 3][5] != "") ? "\nJAIN SPECIAL: " + data[v + 3][5] : ""),
        data[v + 3][6],
      ],
    };
  }

  for (const day in menu_json) {
    setDoc(doc(Menu, day), menu_json[day])
      .then((res) => {
        console.log("Successfully updated the menu for ", day);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return res.send(menu_json);

  //// Original code for updating the menu from the pdf

  // const data = new FormData();
  // data.append('input', fs.createReadStream('Menu.pdf'));
  // data.append('dup_check', 'False');

  // var menu_json = {};

  // await axios.request({
  //   method:'post',
  //   maxBodyLength:Infinity,
  //   url: 'https://vetwkzas8k.execute-api.us-east-1.amazonaws.com/prod',
  //   headers: {
  //     'x-api-key': 'LgVQGDBXXm3RMZ4QQzJRX4ZPVysCziu23fJ72XB9'
  //   },
  //   data : data
  // })
  // .then((res) => {
  //   var menu_table = res.data.Tables[0].TableJson;
  //   for (var v = 4; v <= 28; v += 4) {
  //     menu_json[menu_table[v][0]] = {
  //       Breakfast: [menu_table[v - 3][2], menu_table[v - 3][3]],Lunch: [menu_table[v - 2][2], menu_table[v - 2][3]],
  //       Snacks: [menu_table[v - 1][2], menu_table[v - 1][3]],Dinner: [menu_table[v][2], menu_table[v][3]],
  //     };
  //   }
  // })
  // .catch((err) => {
  //   console.log(err);
  // });

  // for (const day in menu_json) {
  //   setDoc(doc(Menu, day), menu_json[day])
  //     .then((res) => {
  //       console.log("Successfully updated the menu for ",day);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // res.send({
  //   Success: "Updated the menu",
  //   new_menu:menu_json
  // });
});
