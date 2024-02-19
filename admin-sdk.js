const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./secret_files/serviceAccountKey.json');
const cron = require('node-cron');
const admin = require('firebase-admin');

initializeApp({
    credential: cert(serviceAccount)
  });
  

async function sendCustomMessage(title, msg) {

  const message = {
    notification: {
      title: title,
      body: msg[0] + " " + msg[1],
    },
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK', // Required for onMessageOpenedApp callback
    },
    topic: "Menu",
  };
  console.log(msg);
  try {
    console.log("trying");
    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}


function getWeekDay(){
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    let date = new Date(indian_date);
    let weekday = daysOfWeek[date.getDay()];
    return weekday;
}



const db = getFirestore();
const Menu = db.collection('Menu');

console.log("running");


cron.schedule('30 7  * * *', async() => {
    console.log('Running scheduled job...');
    console.log(Date.now());
    const weekday = getWeekDay();
    console.log(weekday);
    const data = await Menu.doc(weekday).get();
    const breakfast = data.data()['Breakfast']; 
    console.log(breakfast[0],breakfast[1]);
    const Lunch = data.data()['Lunch']; 
    console.log(Lunch[0],Lunch[1]);
    await sendCustomMessage("Lunch",Lunch);
}, {
scheduled: true,
timezone: 'Asia/kolkata', // Set your timezone (e.g., 'America/New_York')
});






