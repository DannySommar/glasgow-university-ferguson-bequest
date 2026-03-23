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
    <form onSubmit={handleSubmit} className="mb-10 bg-lightgray-50 rounded-xl shadow-md border border-lightgray-200 p-6 text-center space-y-2">
      <h2 className = "text-3xl font-bold text-center my-8 text-gray-700">Create Announcement</h2>

      <input className = "text-center"
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
