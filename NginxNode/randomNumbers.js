const randomNumbers = (cant) => {

    const objectNumbers = {}

    for (let i = 0; i < cant; i++) {
        const randomNumber = Math.floor(Math.random() * 1000 + 1)


        if (objectNumbers[randomNumber]) {
            objectNumbers[randomNumber]++
        } else {
            objectNumbers[randomNumber] = 1
        }
    }

    return objectNumbers
}


process.on('message', (data) => {
    process.send(randomNumbers(data))
})
