document.getElementById('user-details-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = document.getElementById('user-name').value;
    const userGender = document.getElementById('user-gender').value;
    const bKey = document.getElementById('b-key').value;
    
    localStorage.setItem('userName', userName);
    localStorage.setItem('userGender', userGender);
    localStorage.setItem('bKey', bKey);
    
    document.getElementById('user-details-form').style.display = 'none';
    document.getElementById('chat-form').style.display = 'flex';
});

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (message.trim() === '') return;
    
    addMessageToHistory('user', message);
    input.value = '';
    
    const userName = localStorage.getItem('userName');
    const userGender = localStorage.getItem('userGender');
    const bKey = localStorage.getItem('bKey');
    const chatHistory = document.getElementById('chat-history');
    const messages = chatHistory.querySelectorAll('.message');
    let chatHistoryText = '';
    messages.forEach(message => {
        const sender = message.classList.contains('user') ? 'User' : 'AI';
        chatHistoryText += `${sender}: ${message.textContent}\n`;
    });
    
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'B-Key': bKey
    });

    fetch('https://v1.api.buzzchat.site/charles/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
            content: `${message}\nChatHistory:\n${chatHistoryText}\nUserName: ${userName}\nUserGender: ${userGender}`
        })
    })
    .then(response => response.json())
    .then(data => {
        addMessageToHistory('bot', data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function addMessageToHistory(sender, message) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
