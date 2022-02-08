//const { json } = require("express/lib/response")

const updateBtn = document.querySelector("#update-button")
const deleteBtn = document.querySelector("#delete-button")
const popUpMsg = document.querySelector("#message")

//NOTE must be handled in server for event to go through for all fetching
updateBtn.addEventListener("click", () => {
    //send put request here
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vadar',
            quote: "This will be a day long remembered. It has seen the end of Kenobi. It will soon see the end of the Rebellion."
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            if (response === 'No quote to delete!') {
                popUpMsg.textContent = "No more Darth Vadar quotes to delete!"
            } else {
                window.location.reload(true)
            }

        })
})


deleteBtn.addEventListener('click', () => {
    //handles delete req
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vadar'
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(response => {
            console.log(response)
            window.location.reload(true)
        })
})


