const leaderboard = [];

function updateScores(leaderboard) {
  axios
    .get("/scores")
    .then(response => {
      const users = response.data;

      leaderboard = [];

      users.forEach(user => {
        if (leaderboard.length < 10) {
          leaderboard.push({
            username: user.username,
            score: user.collected.length
          });
          leaderboard.sort((a, b) => {
            return b.score - a.score;
          });
        } else if (user.collected.length > leaderboard[9].score) {
          leaderboard.pop();
          leaderboard.push(user);
          leaderboard.sort((a, b) => {
            return b.score - a.score;
          });
        }
      });

      console.log(leaderboard);

      updateHtml(leaderboard);
    })
    .catch(err => console.log("ERROR in updateScores", err));
}

function updateHtml(leaderboard) {
  for (var i = 0; i < 9; i++) {
    $(".modal li:nth-child(" + (i + 1) + ")").html(
      `<p> n°${i + 1} is <span class="badge username-metro badge-pill">${
        leaderboard[i].username
      }</span> with a score of <span class="badge score-metro badge-pill">${
        leaderboard[i].score
      }</span> collected stations. </p>`
    );
  }
}

updateScores(leaderboard);

setInterval(() => {
  updateScores(leaderboard);
}, 10000);
