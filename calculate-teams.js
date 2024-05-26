
function calculateTeams(nbrOfTeams, minTeamsPerPlayer, maxTeamsPerPlayer, players) {
    players.sort((a, b) => Number(b.gp) - Number(a.gp)); // decreasing gp order
    const gps = players.map(p => Number(p.gp));
    const totalGP = gps.reduce((prev, current) => prev + current, 0);
    const teams = [];
    let added = 0;
    
    // TODO check skip conditions to never get stuck
    
    for (const gp of gps) {
        const maxToAdd = Math.min(maxTeamsPerPlayer, Math.round((gp / totalGP) * nbrOfTeams));
        const toAdd = Math.max(minTeamsPerPlayer, maxToAdd);
        if (added >= nbrOfTeams || added + toAdd > nbrOfTeams) break;
        teams.push(toAdd);
        added += toAdd;
    }
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
            ) {
                playerWithRelativelyLeastTeams = i;
                maxDifference = difference;
            }
        }
        if (playerWithRelativelyLeastTeams) {
            teams[playerWithRelativelyLeastTeams]++;
            added++;
            remaining--;
        }
    }
    
    // we may have left some players out because of rounding or possible when min is more than 1,
    // so redistribute from those with most teams relative to gp (might make a bit more sense to
    // do this earlier but doesn't matter in practice)
    while (teams.length < gps.length) {
        let teamsAddedToNext = 0;
    
        while (teamsAddedToNext < minTeamsPerPlayer) {
            let playerWithRelativelyMostTeams = null;
            let minDifference = null;
    
            for (let i = 0; i < teams.length; i++) {
                if (teams[i] === minTeamsPerPlayer) continue; // never take if already has min number 
                const difference = (gps[i] / totalGP) - (teams[i] / nbrOfTeams);
                if (
                    (playerWithRelativelyMostTeams === null || difference < minDifference)
                        && teams[i] < maxTeamsPerPlayer
                ) {
                    playerWithRelativelyMostTeams = i;
                    minDifference = difference;
                }
            }
            if (playerWithRelativelyMostTeams) {
                teams[playerWithRelativelyMostTeams]--;
                teamsAddedToNext++;
            }
        }
        teams.push(teamsAddedToNext);
    }
    return players.map((p, i) => ({name: p.name, teams: teams[i]}));
}

module.exports = calculateTeams;
