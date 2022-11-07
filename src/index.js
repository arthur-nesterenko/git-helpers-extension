import {toLower, snakeCase} from 'lodash'

// Git Helpers


const showToastMessage = (text) => {
    const alert = document.getElementById('alert')
    alert.classList.toggle('hidden')
    alert.innerText = text
    setTimeout(() => {
        alert.classList.toggle('hidden')
    }, 3000)
}

const convertTicketNameToNormalBranchName = (name) => snakeCase(toLower(name))

// FIELDS
const ticketNameInput = document.getElementById('ticket-name')
const branchNameInput = document.getElementById('branch-name')
const copyBranchNameButton = document.getElementById('copy-branch-name-button')

const convertToBranchNameButton = document.getElementById('convert-to-branch-name')


// EVENTS
convertToBranchNameButton.addEventListener('click', () => {
    const ticketName = ticketNameInput.value
    if (ticketName) {
        branchNameInput.value = convertTicketNameToNormalBranchName(ticketName)
    }

})


copyBranchNameButton.addEventListener('click', async () => {
    const branchName = branchNameInput.value
    if (branchName) {
        branchNameInput.select()
        await navigator.clipboard.writeText(branchName)
        showToastMessage('Branch name has been copied to clipboard')
    }


})