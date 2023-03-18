document.getElementById('summarizeButton').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const summaryElement = document.getElementById('summary');
    
    if (!inputText) {
        alert('Please enter some text to summarize.');
        return;
    }
    
    summaryElement.textContent = 'Summarizing...';

    try {
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputText }),
        });

        if (response.ok) {
            const data = await response.json();
            summaryElement.textContent = data.summary;
        } else {
            const errorData = await response.json();
            summaryElement.textContent = 'Error: ' + errorData.error;
        }
    } catch (error) {
        summaryElement.textContent = 'Error: ' + error.message;
    }
});
