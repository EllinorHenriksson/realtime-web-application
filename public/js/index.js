import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('template')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/:id/update" messages from the server.
  socket.on('issues/update', (issue) => updateIssueTable(issue))
}

/**
 * Updates the issue table with the newly updated issue.
 *
 * @param {object} issue - The updated issue.
 */
function updateIssueTable (issue) {
  const tableBody = document.querySelector('tbody')
  const tableRow = document.getElementById(issue.id)

  if (issue.state === 'opened') {
    if (tableRow) {
      // Update row if it already exists.
      tableRow.querySelector('.title').innerText = issue.title
      tableRow.querySelector('.description').firstChild.innerText = issue.description
    } else {
      // Add row if it does not exist.
      const newRow = issueTemplate.content.cloneNode(true)
      newRow.querySelector('tr').setAttribute('id', issue.id)
      const url = issue.author.avatar_url ? issue.author.avatar_url : './img/profile.png'
      newRow.querySelector('.author img').setAttribute('src', url)
      newRow.querySelector('.author img').setAttribute('title', issue.author.name)
      newRow.querySelector('.issue-id').innerText = `#${issue.id}`
      newRow.querySelector('.title').innerText = issue.title
      newRow.querySelector('.description').firstChild.innerText = issue.description
      newRow.querySelector('a').setAttribute('href', `./issues/${issue.id}/update`)

      // Decide on what row the new row should be appended.
      const rows = Array.from(tableBody.querySelectorAll('tr'))
      rows.sort((a, b) => {
        return a.getAttribute('id') - b.getAttribute('id')
      })

      let nextRow
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        if (row.getAttribute('id') < issue.id) {
          nextRow = row
        }
      }

      // Append new row.
      tableBody.insertBefore(newRow, nextRow)
    }
  } else if (issue.state === 'closed') {
    if (tableRow) {
      // Delete row if the issue has been closed.
      tableRow.remove()
    }
  }
}
