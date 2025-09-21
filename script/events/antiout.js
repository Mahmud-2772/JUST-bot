module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "SaGor",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "Does anyone hit me in such pitchware??";
 if (type == "self-separation") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(`Sorry, boss, I couldn't help but laugh. \n ${name} This guy is blocking me or I couldn't add the messenger option to his ID`, event.threadID)
   } else api.sendMessage(`Listen., ${name} This group has become a gang! \n You need the administrator's clearance to leave here! \nYou took leave without permission - I'll kick you out mafia style again.`, event.threadID);
  })
 }
}
