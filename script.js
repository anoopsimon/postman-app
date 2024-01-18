function openTab(evt, tabName) {
  console.log(`Opening tab ${tabName}`);
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  if (evt.currentTarget) {
      evt.currentTarget.className += " active";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Set the default tab open
  openTab(new Event('click'), 'bodyTab');

  const sendButton = document.getElementById('send');
  const methodSelect = document.getElementById('method');
  const urlInput = document.getElementById('url');
  const requestBody = document.getElementById('request-body');
  const responseArea = document.getElementById('response-body');
  const historyList = document.getElementById('history-list');

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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Changed from response.json() to response.text()
    })
    .then(data => {
        // Assuming the response is JSON, we need to parse and stringify it
        // to format it nicely. If the response isn't JSON, it'll just display as text.
        try {
            const json = JSON.parse(data);
            responseArea.value = JSON.stringify(json, null, 2);
        } catch (e) {
            // If it's not JSON, just display the raw text.
            responseArea.value = data;
        }
        addHistoryItem(method, url); // Add request to history after successful response
    })
    .catch(error => {
        responseArea.value = `Error: ${error.message}`;
    });
});

  function addHistoryItem(method, url) {
      let listItem = document.createElement('li');
      listItem.textContent = `${method}: ${url}`;
      listItem.addEventListener('click', function() {
          methodSelect.value = method;
          urlInput.value = url;
          requestBody.value = ''; // Clear request body
          requestBody.focus();
          // You may want to also clear the response area
      });
      historyList.appendChild(listItem);
  }
});
