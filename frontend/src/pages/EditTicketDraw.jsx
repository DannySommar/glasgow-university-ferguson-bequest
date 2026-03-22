import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditTicketDraw() {
    
    const { id } = useParams()
    const navigate = useNavigate()
    const [initial, setInitial] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/ticket-draws', { credentials: 'include' })
        .then(r => r.json())
        .then(data => setInitial(data.ticketDraws.find(td => td.id === Number(id)) || null))
        .catch(() => setError('Failed To Load Ticket Draw'))
        .finally(() => setLoading(false))
    }, [id])

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        const formData = new FormData(e.target)
        const payload = {
            title: formData.get('title')?.trim(),
            venue: formData.get('venue')?.trim(),
            eventdate: formData.get('eventdate'),
            enterfrom: formData.get('enterfrom'),
            enteruntil: formData.get('enteruntil'),
            showurl: formData.get('showurl')?.trim(),
            img: formData.get('img')?.trim()
    }

    const res = await fetch(`/api/ticket-draws/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (res.ok) navigate('/TicketDraws')
    else setError(data.error || 'Update Failed')
    }

    if (loading) return <p>Loading...</p>
    if (!initial) return <p>Ticket Draw Not Found</p>

    const toDateInput = (val) => (val ? String(val).slice(0, 10): '')

    return (
        <form onSubmit={submit} className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Edit</h2>
            <input name="title" defaultValue={initial.title} className="w-full border p-2" placeholder="Title" required />
            <input name="venue" defaultValue={initial.venue} className="w-full border p-2" placeholder="Venue" required />
            <label className="block text-sm text-gray-700">Event Date</label>
            <input type="date" name="eventdate" defaultValue={toDateInput(initial.eventdate)} className="w-full border p-2" required />
            <label className="block text-sm text-gray-700">Enter From</label>
            <input type="date" name="enterfrom" defaultValue={toDateInput(initial.enterfrom)} className="w-full border p-2" required />
            <label className="block text-sm text-gray-700">Enter Until</label>
            <input type="date" name="enteruntil" defaultValue={toDateInput(initial.enteruntil)} className="w-full border p-2" required />
            <input name="showurl" defaultValue={initial.showurl} className="w-full border p-2" placeholder="Show URL" />
            <input name="img" defaultValue={initial.img} className="w-full border p-2" placeholder="Image Filename (e.g., EdZoo.jpg)" />
            {error && <p className="text-red-600">{error}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>            
        </form>
    )

}