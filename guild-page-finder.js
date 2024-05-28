
async function getGuildPage(idx, searchStr) {
    const baseUrl = 'https://swgoh.gg/g/?page='
    let found = false
    let info = undefined
    await fetch(baseUrl + idx)
        .then(r => r.text())
        .then(r => {
            for (let i = 0; i < r.length; i++) {
                if (r.substring(i, i + 7) === 'class="') {
                    const clsEnd = r.indexOf('"', i + 7)
                    const cls = r.substring(i + 7, clsEnd)
                    if (cls.indexOf('m-0') !== -1 && cls.indexOf('hidden') === -1) {
                        const contentStart = r.indexOf('>', clsEnd) + 1
                        const content = r.substring(contentStart, r.indexOf('<', clsEnd))
                        // console.log(content)
    
                        if (content.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) {
                            found = true
    
                            let j = i
                            while (r.substring(j, j + 6) !== 'href="') {
                                j--
                                if (j < 0) break
                            }
                            const refEnd = r.indexOf('"', j + 6)
                            const ref = r.substring(j + 6, refEnd)
                            info = '{ "name": "' + content + '", "url": "' + ref + '" }'
                            // console.log(info)
                            break
                        }
                    }
                }
            }
        })
    return [found, info]
}

// async function find() {
//     const searchStr = process.argv[2]
//     let idx = 1
//     let found = false
//     let info = undefined
    
//     while (/* !found && */ idx < 420) {
//         [found, info] = await getGuildPage(idx++, searchStr)
//     }
// }

// find()

module.exports = getGuildPage;
