
const { findWithOpts } = require('./util');

async function getPlayersAndGps(url) {
    const playersAndGps = []
    await fetch(url)
        .then(r => r.text())
        .then(r => {
            const firstStart = findWithOpts(r, {
                startIdx: 0,
                matchStart: "</thead>",
                matchEnd: "",
                all: false
            })
            const playerResults = findWithOpts(r, {
                startIdx: firstStart.idx,
                matchStart: "class=\"fw-bold text-white\">\n",
                matchEnd: "\n",
                all: true,
            })
            playerResults.forEach(p => {
                const gp = findWithOpts(r, {
                    startIdx: p.idx,
                    matchStart: "<td>\n",
                    matchEnd: "</td>",
                    all: false,
                }).result.replace(/,/g, "").trim();
                playersAndGps.push({ name: p.result, gp: gp })
            })
        })
    return playersAndGps
}

// async function find() {
//     const playersAndGps = await getPlayersAndGps('https://swgoh.gg/g/SF0zGaLuQiCapg85lVPxxw/')
//     console.log(playersAndGps)
// }

// find()

module.exports = getPlayersAndGps;
