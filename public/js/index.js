import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

// If issue list is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "tasks/create" message from the server.
  socket.on('issues/:id/update', (issue) => updateIssue(issue))
}

/**
 * Updates the issue list with the newly updated issue.
 *
 * @param {object} issue - The task to add.
 */
function updateIssue (issue) {
  const issueList = document.querySelector('#issue-list')
  const issueItem = document.querySelector(`#${issue.id}`)

  if (issue.state === 'opened') {
    if (issueItem) {
      // Update item if it already exists.
      issueItem.querySelector('#title').innerText = issue.title
      issueItem.querySelector('#decription').innerText = issue.description
    } else {
      // Add item if it does not exist.
      const issueNode = issueTemplate.content.cloneNode(true)
      issueNode.querySelector('div').setAttribute('id', issue.id)
      const url = issue.author.avatar_url ? issue.author.avatar_url : './img/profile.png'
      issueNode.querySelector('img').setAttribute('src', url)
      issueNode.querySelector('img').setAttribute('title', issue.author.name)
      issueNode.querySelector('#issue-id').innerText = `#${issue.id}`
      issueNode.querySelector('#title').innerText = issue.title
      issueNode.querySelector('#description').innerText = issue.description
      issueNode.querySelector('a').setAttribute('href', `./issues/${issue.id}/update`)

      issueList.appendChild(issueNode)
    }
  } else if (issue.state === 'closed') {
    if (issueItem) {
      // Delete item if the issue has been closed.
      issueItem.remove()
    }
  }
}
