sessionStorage.setItem("key", "value");
let data = sessionStorage.getItem("key");
sessionStorage.removeItem("key");
sessionStorage.clear();

document.addEventListener("DOMContentLoaded", ()=> {
    let pageVisists = sessionStorage.getItem("pageVisits");

    if (!pageVisists) {
         pageVisists = 1;
    } else {
         pageVisists = parseInt(pageVisists) + 1;
    }
    sessionStorage.setItem("pageVisits", pageVisists);
     console.log(`Pages visited this session: ${pageVisits}`);
});

function setSessionData(key, value) {
    sessionStorage.setItem(key, value);
}

function getSessionData(key) {
    return sessionStorage.getItem(key);
}

function clearSessionData() {
    sessionStorage.clear();
}

