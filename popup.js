document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const profileRating = document.getElementById('profile-rating');
    const upcomingContestsList = document.getElementById('upcoming-contests-list');
    const logoutButton = document.getElementById('logout-button');

    chrome.storage.sync.get(['userhandle'], result => {
        if (result.userhandle) {
            const username = result.userhandle;

            // Send message to background.js
            chrome.runtime.sendMessage({ action: 'platformChanged', platform: 'codeforces', username: username }, response => {
                if (response && response.data) {
                    // Update profile picture and rating in the UI
                    profilePic.src = response.data['profile-pic'];
                    profileName.innerText = username;
                    profileRating.innerText = `Rating: ${response.data.rating}`;

                    // Update contests
                    updateContests(response.data.contests);
                } else {
                    console.error('Error fetching data:', response.error);
                    // Handle error condition if necessary
                }
            });
        } else {
            // Redirect to login page if userhandle is not found
            window.location.href = 'login.html';
        }
    });

    logoutButton.addEventListener('click', () => {
        chrome.storage.sync.remove(['userhandle'], () => {
            window.location.href = 'login.html';
        });
    });

    function updateContests(contests) {
        upcomingContestsList.innerHTML = '';
        if (contests && contests.length > 0) {
            contests.forEach(contest => {
                const li = document.createElement('li');
                li.innerHTML = `${contest.name} - ${new Date(contest.startTimeSeconds * 1000).toLocaleString()}`;
                upcomingContestsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerText = 'No upcoming contests found.';
            upcomingContestsList.appendChild(li);
        }
    }
});
