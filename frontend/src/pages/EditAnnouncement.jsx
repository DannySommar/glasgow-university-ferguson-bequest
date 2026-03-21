import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditAnnouncement() {
    
    const { id } = useParams()
    const navigate = useNavigate()
    const [initial, setInitial] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/announcements', { credentials: 'include' })
        .then(r => r.json())
        .then(data => setInitial(data.announcements.find(a => a.id === Number(id)) || null))
        .catch(() => setError('Failed To Load Announcement'))
        .finally(() => setLoading(false))
    }, [id])

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        const formData = new FormData(e.target)
        const payload = {
            title: formData.get('title')?.trim(),
            body: formData.get('body')?.trim()
    }

    const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (res.ok) navigate('/Announcements')
    else setError(data.error || 'Update Failed')
    }

    if (loading) return <p>Loading...</p>
    if (!initial) return <p>Announcement Not Found</p>

    return (
        <form onSubmit={submit} className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Edit</h2>
            <input name="title" defaultValue={initial.title} className="w-full border p-2" placeholder="Title" required />
            <textarea name="body" defaultValue={initial.body} className="w-full border p-2 min-h-[160px]" placeholder="Body" required />
            {error && <p className="text-red-600">{error}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
        </form>
    )

}