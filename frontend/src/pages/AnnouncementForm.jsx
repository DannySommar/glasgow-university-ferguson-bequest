import { useState } from 'react'

export default function AnnouncementForm({ user, onAdd }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  if (!user?.isAdmin) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    })

    const data = await res.json()
    onAdd(data)

    setTitle('')
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <h2>Create Announcement</h2>

      <input
        type="text"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Announcement body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />

      <button type="submit">Post Announcement</button>
    </form>
  )
}
