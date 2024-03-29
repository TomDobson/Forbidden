let stage = 'live';
const host = stage === 'dev' ? 'http://localhost:5001' : 'https://dobsondesigns.co.uk';

const localStorageSession = localStorage.getItem('sessionId');

if(!localStorageSession) {
    window.location.replace(host);
}

async function getSession() {
    const response = await axios.get(`${host}/checkout/session/${localStorageSession}`);

    if(response.data.success) {
        console.log("Clearing local Storage");
        localStorage.clear();
    } else {
        window.location.replace(host);
    }
}

getSession();