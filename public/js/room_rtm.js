let handleMemberJoined = async (MemberId) => {
  console.log("A new member joined", MemberId);
  addMemberToDOM(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
};

function stringToColor(str) {
  console.log(str);
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#33BFFF', '#FF33BF', '#BFFF33', '#FF33FF', '#FFFF33', '#33FFFF', '#3333FF', '#FF3333', '#33FF33'];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % colors.length;
  return colors[index];
}


let addMemberToDOM = async (MemberId) => {
  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);
  let membersWrapper = document.getElementById("member_list");
  let memberItem = `<div class="member_wrapper" id="member_${MemberId}_wrapper">
                        <span class="green_icon"></span>
                        <p class="member_name">${name}</p>
                      </div> `;

  membersWrapper.insertAdjacentHTML("beforeend", memberItem);
};

let updateMemberTotal = async (members) => {
  let memberCount = document.getElementById("members_count");
  memberCount.innerText = members.length;
};

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDOM(MemberId);
  let members = await channel.getMembers();
  updateMemberTotal(members);
  updateMemberTotal(members);
};

let removeMemberFromDOM = async (MemberId) => {
  let memberWrapper = document.getElementById(`member_${MemberId}_wrapper`);
  memberWrapper.remove();
};

let getMembers = async () => {
  let members = await channel.getMembers();
  updateMemberTotal(members);
  for (let i = 0; i < members.length; i++) {
    addMemberToDOM(members[i]);
  }
};

let handleChannelMessage = async(messageData, MemberId)=>{
    console.log("new message received");
    let data = JSON.parse(messageData.text);
    if(data.type === 'chat'){
        addMessageToDOM(data.displayName, data.message);
    }
}

let sendMessage = async (event) => {
  event.preventDefault();
  let message = event.target.message.value;
  channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: message,
      displayName: displayName,
    }),
  });

  addMessageToDOM(displayName, message);
  event.target.reset();
};

let addMessageToDOM = async (name, message)=>{
    let color = stringToColor(name);
    let messagesWrapper = document.getElementById('messages');
    let newMessage = `<div class="message_wrapper">
                        <div class="message_body">
                            <strong class="message_author" style="color: ${color}">${name}</strong>
                            <p class="message_text">${message}</p>
                        </div>
                     </div>`
    messagesWrapper.insertAdjacentHTML('beforeend', newMessage);  
    let lastMessage = document.querySelector('#messages .message_wrapper:last-child');
    if(lastMessage)
        lastMessage.scrollIntoView();  
}

let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

window.addEventListener("beforeunload", leaveChannel);
let messageForm = document.getElementById('message_form').addEventListener('submit', sendMessage);