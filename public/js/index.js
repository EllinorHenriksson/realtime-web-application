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
  /*
  const issueList = document.querySelector('#issue-list')
  const issueItem = document.getElementById(issue.id)

  if (issue.state === 'opened') {
    if (issueItem) {
      // Update item if it already exists.
      issueItem.querySelector('.title').innerText = issue.title
      issueItem.querySelector('.description').firstChild.innerText = issue.description
    } else {
      // Add item if it does not exist.
      const issueNode = issueTemplate.content.cloneNode(true)
      issueNode.querySelector('div').setAttribute('id', issue.id)
      const url = issue.author.avatar_url ? issue.author.avatar_url : './img/profile.png'
      issueNode.querySelector('img').setAttribute('src', url)
      issueNode.querySelector('img').setAttribute('title', issue.author.name)
      issueNode.querySelector('.issue-id').innerText = `#${issue.id}`
      issueNode.querySelector('.title').innerText = issue.title
      issueNode.querySelector('.description').firstChild.innerText = issue.description
      issueNode.querySelector('a').setAttribute('href', `./issues/${issue.id}/update`)

      issueList.appendChild(issueNode)
    }
  } else if (issue.state === 'closed') {
    if (issueItem) {
      // Delete item if the issue has been closed.
      issueItem.remove()
    }
  }
  */
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

      tableBody.appendChild(newRow)
    }
  } else if (issue.state === 'closed') {
    if (tableRow) {
      // Delete row if the issue has been closed.
      tableRow.remove()
    }
  }
}
