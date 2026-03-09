import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AnnouncementForm from './AnnouncementForm'

export function Announcements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  console.log("USER:", user)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements))
  }, [])

  const handleAdd = (newA) => {
    setAnnouncements(prev => [newA, ...prev])
  }
    const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this announcement?")
    if (!confirmed) return

    const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id))
    }
 }

  return (
    <div className="container">
      <h2>Announcements</h2>

      {user?.isAdmin && (
        <AnnouncementForm user={user} onAdd={handleAdd} />
      )}

      {announcements.map(a => (
        <div key={a.id} className="announcement-card">
          <h2>{a.title}</h2>
          <p>{a.body}</p>
          <small>
            Posted by {a.admin_name || 'Admin'} on{' '}
            {new Date(a.created_at).toLocaleString()}
          </small>

        {user?.isAdmin && (
            <button
                className="delete-btn"
                onClick={() => handleDelete(a.id)}
            >
                Delete
            </button>
            )}
        </div>
      ))}
    </div>
  )
}