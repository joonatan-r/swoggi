
async function getPage(url) {
    let found = false
    await fetch(url)
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
    
                        if (content.toLowerCase().indexOf(process.argv[2]?.toLowerCase()) !== -1) {
                            found = true
    
                            let j = i
                            while (r.substring(j, j + 6) !== 'href="') {
                                j--
                                if (j < 0) break
                            }
                            const refEnd = r.indexOf('"', j + 6)
                            const ref = r.substring(j + 6, refEnd)
                            console.log(content + ', URL: https://swgoh.gg' + ref)
                            // console.log(ref)
                            break
                        }
                    }
                }
            }
        })
    return found
}

async function find() {
    const baseUrl = 'https://swgoh.gg/g/?page='
    let idx = 1
    let found = false
    
    while (/* !found && */ idx < 420) {
        found = await getPage(baseUrl + (idx++))
    }
}

find()
