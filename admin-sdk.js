const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./secret_files/serviceAccountKey.json');
const cron = require('node-cron');
const admin = require('firebase-admin');

initializeApp({
    credential: cert(serviceAccount)
  });
  

async function sendCustomMessage(topic, msg) {
  console.log("topic:",topic);
  console.log("data:",msg);
    try {
      const message = {
        topic: topic,
        data: {
          "Breakfast": msg[0] + " " + msg[1]
        },
      };
      const response = await admin.messaging().send(message);
      console.log('Message sent successfully:', response);
    } catch (error) {
      console.error('Error sending message:', error);
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


cron.schedule('* * * * *', async() => {
    console.log('Running scheduled job...');
    const weekday = getWeekDay();
    console.log(weekday);
    const data = await Menu.doc(weekday).get();
    const breakfast = data.data()['Breakfast']; 
    console.log(breakfast[0],breakfast[1]);
    await sendCustomMessage("Breakfast",breakfast);
}, {
scheduled: true,
timezone: 'Asia/kolkata', // Set your timezone (e.g., 'America/New_York')
});


console.log("hello buddy");



