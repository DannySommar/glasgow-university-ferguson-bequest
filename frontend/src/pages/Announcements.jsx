import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
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
    <div className="min-h-screen">
      <h2 className = "text-3xl font-bold text-center my-8 text-black-800">Announcements</h2>

      {user?.isAdmin && (
        <AnnouncementForm user={user} onAdd={handleAdd} />
      )}

      {!announcements?.length ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-600 text-lg italic'>No announcements available</p>
        </div>
      ) : (announcements.map(a => (
        <div key={a.id} className ="mb-10 bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-800 mb-3">{a.title}</h3>
          <p className="text-gray-700">{a.body}</p>
          <small>
            Posted by {a.admin_name || 'Admin'} on{' '}
            {new Date(a.created_at).toLocaleString()}
          </small>

        {user?.isAdmin && (
            <div className="p-5 pt-0 space-x-3">
              <Link to={`/announcements/${a.id}/edit`}
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Edit Announcement
              </Link>
            <button
                className = "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={() => handleDelete(a.id)}
            >
                Delete
            </button>
            </div>
            )}
        </div>
      )))}
    </div>
  )
}