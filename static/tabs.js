function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
}

// Set the default tab to display
document.getElementById('textSummarizer').style.display = 'block';