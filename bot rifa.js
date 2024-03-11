const puppeteer = require('puppeteer')
const readline = require('readline');

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

var breakCode = false
var rifeiLink = ""
var ticketsAmount = ""
var winningTickets = []
var cellphoneNumber = ''

function askQuestions() {
    input.question('Informe o link do Rifei: ', (answer) => {
        rifeiLink = answer
        input.question('Quanto bilhetes quer comprar? ', (answer) => {
            ticketsAmount = answer
            input.question('Informe os bilhetes premiados (separando por virgula): ', (answer) => {
                winningTickets = answer.split(",")
                input.question('Informe seu celular (só dígitos, com DDD): ', (answer) => {
                    cellphoneNumber = answer
                    input.close()
                    letsGo()
                })
            })
        })
    })
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function letsGo() {

    const browser = await puppeteer.launch({ defaultViewport: null, headless: false, args: ['--start-maximized'] })
    const page = await browser.newPage()
    const start = new Date()
    
    for (let j = 1; j < j + 1; j++) {
        try {
            
            console.log("-------------------------------------------------------------")
            console.log(`Tentativa ${j}`)
            console.log("-------------------------------------------------------------")

            await timeout(2000)
            await page.goto(`https://rifei.com.br/${rifeiLink}/checkout?numbers_quantity=${ticketsAmount}`)
            await timeout(2000)
            await page.type("#__next > main > div.sc-538d1dac-0.hcRpAv > div.sc-538d1dac-2.cLZjva > div > form > div.sc-538d1dac-5.iizWQl > div > fieldset > div.sc-8694035b-3.jLDXSB > div > input", cellphoneNumber)
            await timeout(2000)
            await page.click("#__next > main > div.sc-538d1dac-0.hcRpAv > div.sc-538d1dac-2.cLZjva > div > form > div.sc-538d1dac-11.emCdKh > button")
            await timeout(2000)
            await page.click("#__next > main > div.sc-538d1dac-0.hcRpAv > div.sc-538d1dac-2.cLZjva > div > div.sc-538d1dac-11.emCdKh > button.sc-1b11b8af-0.bLnsZH")
            await timeout(2000)
            await page.click("#__next > main > div.sc-538d1dac-0.hcRpAv > div.sc-538d1dac-2.cLZjva > div > div > div > button")
            await timeout(2000)
            await page.click("#__next > main > div.sc-538d1dac-0.hcRpAv > div.sc-538d1dac-2.cLZjva > div > div.sc-538d1dac-11.bYfgDP > button")
            await timeout(2000)
            
            for (let i=1; i <= ticketsAmount; i++) {

                let extractedTicket = await page.evaluate((i) => {
                    let element = document.querySelector(`#__next > main > div.sc-772e6754-0.hWJumh > div.sc-772e6754-2.bzDZrk > div.sc-772e6754-3.kOTMxY > div:nth-child(3) > div > div.sc-772e6754-9.iUPhuv > div:nth-child(6) > div > div:nth-child(${i})`)
                    return element.textContent
                }, i)

                let containsWinningTicket = winningTickets.some(ticket => extractedTicket.includes(ticket))

                console.log(`${extractedTicket}: ${containsWinningTicket}`)

                if (containsWinningTicket) {
                    breakCode = true
                    const end = new Date()
                    const timestamp = (end - start) / 60000
                    console.log("-------------------------------------------------------------")
                    console.log(`ENCONTRADO! Tentativa número: ${j}. Tempo, em minutos: ${Math.ceil(timestamp)}.`)
                    console.log("-------------------------------------------------------------")
                    break
                }
            }

            if (breakCode) break

            await page.click("#__next > main > div.sc-772e6754-11.jhevqm > div > button")
            await timeout(2000)
            await page.click("#__next > div.sc-912e3955-0.fyGHVY > div > div.sc-b992e925-5.gmRYUp > form > fieldset > div.sc-8694035b-3.jLDXSB > div > input", cellphoneNumber)
            await timeout(2000)
            await page.click("#__next > div.sc-912e3955-0.fyGHVY > div > div.sc-b992e925-5.gmRYUp > form > div > button")
            await timeout(2000)

        } catch (error) {
            console.log('Erro, reiniciando loop', error)
        }
    }    
}   

askQuestions()