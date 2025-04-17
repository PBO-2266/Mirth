document.addEventListener('DOMContentLoaded', () => {
    fetch('https://serverName:8443/api/channels?pollingOnly=false&includeCodeTemplateLibraries=false', {
        method: 'GET', 
        headers: {
            'X-Requested-With': 'XMLHttpRequest', 
                                               'Authorization': 'Basic ' + btoa('User:Password')
        }//,
        //credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonData => {
        console.log('JSON-Daten:', jsonData);
        const channels = jsonData.list.channel;
        channels.forEach(channel => {
            console.log(`Channel Name: ${channel.name}`);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});
