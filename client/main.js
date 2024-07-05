const ws = new WebSocket('ws://localhost:8080')
const myNick = localStorage.getItem('nick-name')
const myColor = localStorage.getItem('my-color')
const messagesDiv = document.getElementById('messages')

ws.onopen = async () => {
  loadMessages()
};

ws.onmessage = async event => {
  if(event !== ""){
    const eventData = JSON.parse(event.data)

    if(eventData.type == 'message'){
      loadMessage(eventData.value)
    }

    if(eventData.type == 'typing'){
      if(eventData.value != myNick){
        if(eventData.value != false){
          appendTypingMsg(eventData.value, true)
        }else{
          appendTypingMsg(eventData.value, false)
        }

      }
    }
  }
}

ws.onclose = () => {
  console.log('Disconnected from the server');
};

ws.onerror = error => {
  console.error('WebSocket error:', error);
};

document.getElementById('send').addEventListener('click', sendMessage)
document.getElementById('input').addEventListener('keypress', (e) => { 
  if(e.key === 'Enter'){
    sendMessage()
  }else{
    sendTypingStatus()
  }
})

async function sendMessage(){
  const input = document.getElementById('input');
  const data = {
    nick: myNick,
    color: myColor,
    message: input.value
  }

  await fetch('http://localhost:3000/message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  ws.send(JSON.stringify({type: 'message', value: data}))
  ws.send(JSON.stringify({type: 'typing', value: false}))
  input.value = '';
}

function sendTypingStatus(){
  ws.send(JSON.stringify({type: 'typing', value: myNick}))
}

async function loadMessages(){
  const request = await fetch('http://localhost:3000/message', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const messages = await request.json()
  messagesDiv.innerHTML = ""
  messages.forEach(message => {
    const classMessage = myNick == message.nick ? 'right-message' : 'left-message'

    messagesDiv.innerHTML+= `
    <div class="user-message ${classMessage}">
      <h4 style="color: ${message.color};">${message.nick}</h4>
      <p>${message.message}</p>
    </div>
    `
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function loadMessage(data){
  const classMessage = myNick == data.nick ? 'right-message' : 'left-message'
  messagesDiv.innerHTML+= `
    <div class="user-message ${classMessage}">
      <h4 style="color: ${data.color};">${data.nick}</h4>
      <p>${data.message}</p>
    </div>
  `
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function appendTypingMsg(nick, active = false){
  const typingDiv = document.querySelector('.typing-container')
  if(active){
    typingDiv.style.display = 'block'
    typingDiv.innerHTML= `${nick} está digitando...`
  }else{
    typingDiv.style.display = 'none'
  }

}
