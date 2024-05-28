
async function getPlayersAndGps(url) {
    const playersAndGps = []
    await fetch(url)
        .then(r => r.text())
        .then(r => {
            for (let i = 0; i < r.length; i++) {
                if (r.substring(i, i + 13) === '<div><strong>') {
                    const valueEnd = r.indexOf('</', i + 13)
                    const content = r.substring(i + 13, valueEnd)
                    const nextTdStart = r.indexOf('<td', i + 13)
                    const nextTdContentStart = r.indexOf('>', nextTdStart) + 1
                    const gp = r.substring(nextTdContentStart, r.indexOf('<', nextTdContentStart))
                    // console.log(content + ' / ' + gp)
                    playersAndGps.push({ name: content, gp: gp })
                }
            }
        })
    return playersAndGps
}

// async function find() {
//     const playersAndGps = await getPlayersAndGps('https://swgoh.gg/g/SF0zGaLuQiCapg85lVPxxw/')
//     console.log(playersAndGps)
// }

// find()

module.exports = getPlayersAndGps;
