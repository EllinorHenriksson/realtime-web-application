import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('template')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/:id/update" messages from the server.
  socket.on('issues/update', (issue) => updateIssueList(issue))
}

/**
 * Updates the issue list with the newly updated issue.
 *
 * @param {object} issue - The task to add.
 */
function updateIssueList (issue) {
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
  const issueRow = document.getElementById(issue.id)

  if (issue.state === 'opened') {
    if (issueRow) {
      // Update row if it already exists.
      issueRow.querySelector('.title').innerText = issue.title
      issueRow.querySelector('.description').firstChild.innerText = issue.description
    } else {
      // Add row if it does not exist.
      const issueNode = issueTemplate.content.cloneNode(true)
      issueNode.querySelector('tr').setAttribute('id', issue.id)
      const url = issue.author.avatar_url ? issue.author.avatar_url : './img/profile.png'
      issueNode.querySelector('.author img').setAttribute('src', url)
      issueNode.querySelector('.author img').setAttribute('title', issue.author.name)
      issueNode.querySelector('.issue-id').innerText = `#${issue.id}`
      issueNode.querySelector('.title').innerText = issue.title
      issueNode.querySelector('.description').firstChild.innerText = issue.description
      issueNode.querySelector('a').setAttribute('href', `./issues/${issue.id}/update`)

      tableBody.appendChild(issueNode)
    }
  } else if (issue.state === 'closed') {
    if (issueRow) {
      // Delete row if the issue has been closed.
      issueRow.remove()
    }
  }
}
