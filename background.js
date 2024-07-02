chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'platformChanged') {
        const userUrl = `https://codeforces.com/api/user.info?handles=${request.username}`;
        const contestsUrl = 'https://codeforces.com/api/contest.list?gym=false';

        // Fetch user info and contests from the respective APIs
        Promise.all([fetch(userUrl), fetch(contestsUrl)])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(([userData, contestsData]) => {
                if (userData.status === 'OK' && userData.result.length > 0 &&
                    contestsData.status === 'OK' && contestsData.result.length > 0) {
                    const userRating = userData.result[0].rating;
                    const profilePic = userData.result[0].avatar;
                    const upcomingContests = contestsData.result.filter(contest => contest.phase === 'BEFORE');
                    sendResponse({ data: { rating: userRating, 'profile-pic': profilePic, contests: upcomingContests } });
                } else {
                    console.error('User or contests data not found or API error', userData, contestsData);
                    sendResponse({ error: 'User not found or API error' });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                sendResponse({ error: 'Failed to fetch data' });
            });
        // Return true to indicate you want to use sendResponse asynchronously
        return true;
    }
});
