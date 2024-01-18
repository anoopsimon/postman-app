document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send');
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const requestBody = document.getElementById('request-body');
    const responseArea = document.getElementById('response');
  
    sendButton.addEventListener('click', function() {
      const method = methodSelect.value;
      const url = urlInput.value;
      const body = requestBody.value;
  
      responseArea.value = 'Sending request...';
  
      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' ? null : JSON.stringify(body)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        responseArea.value = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        responseArea.value = error.message;
      });
    });
  });
  