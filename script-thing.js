
// TODO user inputs, nbrOfTeams values based on certain defined total gp limits,
// inputting that certain player(s) puts a predefined number of teams no matter what,
// automatically getting the player gps and taking away those that are
// inputted to not take part (or in reverse take only certain ones) 

const nbrOfTeams = 273;
const minTeamsPerPlayer = 2;
const maxTeamsPerPlayer = 9;
const players = 
    [
        { name: 'Samhane', gp: '7858602' },
        { name: 'Parta', gp: '8929448' },
        { name: 'DarthMustafariNaamio', gp: '10889456' },
        { name: 'Velsson Petterson', gp: '6618458' },
        { name: 'RebelSorsa', gp: '7401931' },
        { name: 'StormCommando', gp: '5811750' },
        { name: 'ViperFray', gp: '9876955' },
        { name: 'Tulhu', gp: '4248508' },
        { name: 'Pena', gp: '7782245' },
        { name: 'Scan Pinquo', gp: '9569756' },
        { name: 'Chrome', gp: '6794794' },
        { name: 'Torin Weedle', gp: '7954402' },
        { name: 'Anubis', gp: '9453875' },
        { name: 'KKos', gp: '6755491' },
        { name: 'Mol Wilze', gp: '6781841' },
        { name: 'LordAep', gp: '7120263' },
        { name: 'Sia Granta', gp: '6330035' },
        { name: 'Iako', gp: '7188923' },
        { name: 'Jepa11', gp: '8661874' },
        { name: 'MineritMan1', gp: '6719982' },
        { name: 'Partanauraja', gp: '5628105' },
        { name: 'Zaigon Besk', gp: '6869051' },
        { name: 'SuperTsounssi', gp: '4628290' },
        { name: 'Smonsteri', gp: '7641917' },
        { name: 'HopeThePredator', gp: '7348547' },
        { name: 'TR4', gp: '8052890' },
        { name: 'DarthPunk', gp: '7279996' },
        { name: 'Zerodus', gp: '7088184' },
        { name: 'Telezein', gp: '7753374' },
        { name: 'DarthVaakku', gp: '5398818' },
        { name: 'Di Valia', gp: '8648407' },
        { name: 'Xious Dunier', gp: '7302453' },
        { name: 'Ottotototo', gp: '7661320' },
        { name: 'Somebody', gp: '5287015' },
        { name: 'Delara Exibil', gp: '7208002' },
        { name: 'Deimos', gp: '6617028' },
        { name: 'Zola', gp: '4461001' },
        { name: 'NK', gp: '5557703' },
        { name: 'Dezip', gp: '6742798' },
        { name: 'Taro Rattus', gp: '3513155' },
        { name: 'Villikortti', gp: '6351063' },
        { name: 'Tuumu', gp: '5028379' },
        { name: 'Ben Swolo', gp: '5406942' },
        { name: 'Mateksuu', gp: '7555140' },
        { name: 'Lefthee', gp: '5534172' },
        { name: 'Hyde', gp: '8348644' },
        { name: 'Misku', gp: '4994153' },
        { name: 'MINi SV WarrioR', gp: '4880138' },
        { name: 'SgtBOOM3r', gp: '5811081' }
    ];
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

console.log(teams);
console.log(added);

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

console.log(teams);
console.log(added);
console.log(players.map((p, i) => p.name + ": " + teams[i]).join("\n"));
