import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export function EditAttraction() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [initial, setInital] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/attractions', { credentials: 'include' })
        .then(r => r.json())
        .then(data => setInital(data.attractions.find(a => a.id === Number(id)) || null))
        .finally(() => setLoading(false))
    }, [id])

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        const formData = new FormData(e.target)
        const res = await fetch(`/api/attractions/${id}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })
        const data = await res.json()
        if (res.ok) navigate('/Attractions')
        else setError(data.error || 'Update Failed')
    }

    if (loading) return <p>Loading...</p>
    if (!initial) return <p>Attraction Not Found</p>

    return (
        <form onSubmit={submit} encType="multipart/form-data" className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Edit</h2>
            <input name="title" defaultValue={initial.title} className="w-full p-2 border" placeholder="Title" />
            <textarea name="description" defaultValue={initial.description} className="w-full border p-2" placeholder="Description"/>
            <input name="location" defaultValue={initial.location} className="w-full border p-2" placeholder="Location" />
            <input type="file" name="img" accept="image/*" className="w-full" placeholder="Image Filename e.g., EdZoo.jpg" />
            {error && <p className="text-red-600">{error}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
        </form>
    )
}