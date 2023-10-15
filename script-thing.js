
// TODO user inputs, nbrOfTeams values based on certain defined total gp limits,
// inputting that certain player(s) puts a predefined number of teams no matter what,
// automatically getting the player gps and taking away those that are
// inputted to not take part (or in reverse take only certain ones) 

const nbrOfTeams = 50;
const minTeamsPerPlayer = 2;
const gps = [11001, 5560, 3700, 1500, 1400, 1200, 1000, 1000, 1000, 500, 500];
gps.sort((a, b) => b - a); // decreasing order
const totalGP = gps.reduce((prev, current) => prev + current, 0);
const teams = [];
let added = 0;

for (const gp of gps) {
    const toAdd = Math.max(minTeamsPerPlayer, Math.round((gp / totalGP) * nbrOfTeams));
    if (added >= nbrOfTeams || added + toAdd > nbrOfTeams) break;
    teams.push(toAdd);
    added += toAdd;
}
let remaining = nbrOfTeams - added;

console.log(teams);
console.log(added);

while (remaining > 0) {
    // find player with the biggest (gp / totalGP) compared to (teamsOfPlayer / nbrOfTeams)
    let playerWithRelativelyLeastTeams = null;
    let maxDifference = null;

    for (let i = 0; i < teams.length; i++) {
        const difference = (gps[i] / totalGP) - (teams[i] / nbrOfTeams);
        // console.log('relative teams ' + teams[i] / nbrOfTeams)
        // console.log('relative gp ' + (gps[i] / totalGP))
        // console.log(difference)
        if (playerWithRelativelyLeastTeams === null || difference > maxDifference) {
            playerWithRelativelyLeastTeams = i;
            maxDifference = difference;
        }
    }
    teams[playerWithRelativelyLeastTeams]++;
    added++;
    remaining--;
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
            // console.log('teams ' + teams[i])
            // console.log('relative teams ' + teams[i] / nbrOfTeams)
            // console.log('relative gp ' + (gps[i] / totalGP))
            // console.log(difference)
            if (playerWithRelativelyMostTeams === null || difference < minDifference) {
                playerWithRelativelyMostTeams = i;
                minDifference = difference;
            }
        }
        teams[playerWithRelativelyMostTeams]--;
        teamsAddedToNext++;
    }
    teams.push(teamsAddedToNext);
}

console.log(teams);
console.log(added);
