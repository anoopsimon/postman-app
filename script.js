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

document.addEventListener('DOMContentLoaded', function () {
    // Set the default tab open
    openTab(new Event('click'), 'bodyTab');

    const clearHistoryButton = document.getElementById('clear-history');
    clearHistoryButton.addEventListener('click', function () {
        historyList.innerHTML = '';
    });

    const sendButton = document.getElementById('send');
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const requestBody = document.getElementById('request-body');
    const responseArea = document.getElementById('response-body');
    const historyList = document.getElementById('history-list');

    const addHeaderButton = document.getElementById('add-header');
    const headerInputsContainer = document.getElementById('header-inputs');

    addHeaderButton.addEventListener('click', function () {
        const newHeaderPair = document.createElement('div');
        newHeaderPair.className = 'header-pair';
        newHeaderPair.innerHTML = `
          <input type="text" class="header-key" placeholder="Header Name">
          <input type="text" class="header-value" placeholder="Header Value">
      `;
        headerInputsContainer.appendChild(newHeaderPair);
    });

    const saveButton = document.getElementById('save-request');
    const saveModal = document.getElementById('save-modal');
    const confirmSaveButton = document.getElementById('confirm-save');

    saveButton.addEventListener('click', function () {
        
        saveModal.style.display = 'block';
    });

    confirmSaveButton.addEventListener('click', function () {
        console.log('Saving request')
        // ... saving logic ...
        saveRequest('SomeName');
        closePopup();
    });

    function closePopup() {
        document.getElementById('save-modal').style.display = 'none';
    }

    sendButton.addEventListener('click', function () {
        console.log('Sending API Request');

        const method = methodSelect.value;
        const url = urlInput.value;
        const body = requestBody.value;

        const headers = {};
        document.querySelectorAll('.header-pair').forEach(pair => {
            const key = pair.querySelector('.header-key').value;
            const value = pair.querySelector('.header-value').value;
            if (key) headers[key] = value;
        });


        responseArea.value = 'Sending request...';
        console.log('Headers :' + JSON.stringify(headers))
        console.log('Body :' + JSON.stringify(body))

        fetch(url, {
            method: method,
            headers: headers,
            //body: method === 'GET' ? null : JSON.stringify(body) : to be tested
            body: method === 'GET' ? null : body
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

    function saveRequest(saveName) {
        // Gather request details
        const requestData = {
            name: saveName,
            method: document.getElementById('method').value,
            url: document.getElementById('url').value,
            headers: '',//getHeaders(), // Implement a function to retrieve headers
            body: document.getElementById('request-body').value
        };

        // Convert to JSON (or the desired format)
        const requestJson = JSON.stringify(requestData);
        console.log('Saving as :' + requestJson);
        // Save to the database
        // db.save(requestJson) -> Implement database saving logic
    }


    function addHistoryItem(method, url) {
        let listItem = document.createElement('li');
        listItem.textContent = `${method}: ${url}`;
        listItem.addEventListener('click', function () {
            methodSelect.value = method;
            urlInput.value = url;
            requestBody.value = ''; // Clear request body
            requestBody.focus();
            // You may want to also clear the response area
        });
        historyList.appendChild(listItem);
    }
});
