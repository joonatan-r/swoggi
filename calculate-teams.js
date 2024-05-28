
function calculateTeams(nbrOfTeams, minTeamsPerPlayer, maxTeamsPerPlayer, players) {
    players.sort((a, b) => Number(b.gp) - Number(a.gp)); // decreasing gp order
    const gps = players.map(p => Number(p.gp));
    const totalGP = gps.reduce((prev, current) => prev + current, 0);
    const fixedTeamIdxs = [];
    let added = 0;
    const teams = players.map((p, idx) => {
        if (typeof p.teams !== "undefined") {
            fixedTeamIdxs.push(idx);
            const fixedTeams = Number(p.teams);
            added += fixedTeams;
            return fixedTeams;
        }
        added += minTeamsPerPlayer;
        return minTeamsPerPlayer;
    });
    
    let remaining = nbrOfTeams - added;
    
    while (remaining > 0) {
        // find player with the biggest (gp / totalGP) compared to (teamsOfPlayer / nbrOfTeams)
        let playerWithRelativelyLeastTeams = null;
        let maxDifference = null;
    
        for (let i = 0; i < teams.length; i++) {
            const difference = (gps[i] / totalGP) - (teams[i] / nbrOfTeams);
            if (
                (playerWithRelativelyLeastTeams === null || difference > maxDifference)
                    && teams[i] < maxTeamsPerPlayer
                    && fixedTeamIdxs.indexOf(i) < 0
            ) {
                playerWithRelativelyLeastTeams = i;
                maxDifference = difference;
            }
        }
        if (playerWithRelativelyLeastTeams != null) {
            teams[playerWithRelativelyLeastTeams]++;
            added++;
            remaining--;
        } else {
            break; // impossible due to nonsensical inputs
        }
    }
    return players.map((p, i) => ({name: p.name, teams: teams[i]}));
}

module.exports = calculateTeams;
