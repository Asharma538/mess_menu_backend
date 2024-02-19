const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./secret_files/serviceAccountKey.json');
const cron = require('node-cron');
const admin = require('firebase-admin');
const { getDoc } = require('firebase/firestore');

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


const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function getWeekDay(){
    let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    let date = new Date(indian_date);
    return date.getDay();
}



const db = getFirestore();
const Menu = db.collection('Menu');
const Timings = db.collection("Timings");

console.log("running");
const weekday_number = getWeekDay();
const weekday = daysOfWeek[weekday_number];


function getStartTime(time_in_string){

  st="";
  let i=0;
  while(time_in_string[i]!=':'){
    st+=time_in_string[i];
    i++;
  }
  
  end="";
  i++;
  while(time_in_string[i]!=' '){
    end+=time_in_string[i];
    i++
  }
  i++;

  start_time_int = parseInt(st);
  end_time_int = parseInt(end);
  if(time_in_string[i]=='P' && start_time_int!=12){
    start_time_int+=12;
  }
  return [start_time_int,end_time_int];
}

async function scheduleRespectiveMeal(cronExpression,title,msg){
  cron.schedule(cronExpression,async()=>{
    await sendCustomMessage(title,msg);
  })
}

async function scheduleDaily(){
  console.log(weekday);
  const time = (await Timings.doc(weekday).get()).data();
  const menu = (await Menu.doc(weekday).get()).data();

  const timeBreakfast = getStartTime(time["Breakfast"][0]);
  const timeLunch = getStartTime(time["Lunch"][0]);
  const timeSnacks = getStartTime(time["Snacks"][0]);
  const timeDinner = getStartTime(time["Dinner"][0]);

  console.log(menu);
  console.log(timeBreakfast,timeLunch,timeSnacks,timeDinner);
  let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
  let date = new Date(indian_date);

  const cronExpressionBreakfast = `${timeBreakfast[1]} ${timeBreakfast[0]} ${date.getDate()} ${date.getMonth() + 1} *`; 
  const cronExpressionLunch = `${timeLunch[1]} ${timeLunch[0]} ${date.getDate()} ${date.getMonth() + 1} *`; 
  const cronExpressionSnacks = `${timeSnacks[1]} ${timeSnacks[0]} ${date.getDate()} ${date.getMonth() + 1} *`; 
  const cronExpressionDinner = `${timeDinner[1]} ${timeDinner[0]} ${date.getDate()} ${date.getMonth() + 1} *`; 



  scheduleRespectiveMeal(cronExpressionBreakfast,"Breakfast",menu["Breakfast"]);
  scheduleRespectiveMeal(cronExpressionLunch,"Lunch",menu["Lunch"]);
  scheduleRespectiveMeal(cronExpressionSnacks,"Snacks",menu["Snacks"]);
  scheduleRespectiveMeal(cronExpressionDinner,"Dinner",menu["Dinner"]);
  
}



cron.schedule('0 6 * * *', async() => {
  scheduleDaily();
}, {
scheduled: true,
timezone: 'Asia/kolkata', // Set your timezone (e.g., 'America/New_York')
});






