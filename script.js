document.getElementById('user-details-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = document.getElementById('user-name').value;
    const userGender = document.getElementById('user-gender').value;
    const bKey = document.getElementById('b-key').value;
    
    localStorage.setItem('userName', userName);
    localStorage.setItem('userGender', userGender);
    localStorage.setItem('bKey', bKey);
    
    document.getElementById('user-details').style.display = 'none';
    document.getElementById('chat-form').style.display = 'flex';
    loadChatHistory();
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

document.getElementById('reset-chat').addEventListener('click', function() {
    document.getElementById('chat-history').innerHTML = '';
    saveChatHistory();
});

function addMessageToHistory(sender, message) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    saveChatHistory();
}

function saveChatHistory() {
    const chatHistory = document.getElementById('chat-history').innerHTML;
    localStorage.setItem('chatHistory', chatHistory);
    updateHistoryList();
}

function loadChatHistory() {
    const chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
        document.getElementById('chat-history').innerHTML = chatHistory;
    }
}

function updateHistoryList() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    const chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
        const listItem = document.createElement('div');
        listItem.classList.add('history-item');
        listItem.textContent = 'Chat History';
        listItem.addEventListener('click', function() {
            loadChatHistory();
        });
        historyList.appendChild(listItem);
    }
}
