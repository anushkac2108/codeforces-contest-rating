document.getElementById('login-button').addEventListener('click', () => {
    const userhandle = document.getElementById('userhandle').value.trim();
    if (userhandle) {
        chrome.storage.sync.set({ userhandle: userhandle }, () => {
            window.location.href = 'popup.html';
        });
    } else {
        alert('Please enter a valid Codeforces handle.');
    }
});
