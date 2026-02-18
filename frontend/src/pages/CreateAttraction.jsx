import "./CreateAttraction.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CreateAttraction() {
    const [isTicketDraw, setIsTicketDraw] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData(e.target)
            const title = formData.get('title').trim()
            const description = formData.get('description').trim()
            const location = formData.get('location').trim()
            const imgFile = formData.get('img')

            const imgName = imgFile && imgFile.name ? imgFile.name : 'default.jpg'

            console.log({ title, description, location, imgName})

            const res = await fetch('/api/attractions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials : 'include',
                body: JSON.stringify({ title, description, location, img: imgName})
            })

            const data = await res.json()
            console.log('data from attraction creation attempt: ', data)

            if (res.ok) {
                navigate('/Attractions')
            } else {
                setError(data.error || 'attraction creation failed')
            }
        } catch(err) {
            setError('Network error.')
        } finally {
            setLoading(false)
        }
    }

    const handleTicketDrawSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData(e.target)
            const title = formData.get('title').trim()
            const venue = formData.get('venue').trim()
            const eventDate = formData.get('eventDate')
            const enterFrom = formData.get('enterFrom')
            const enterUntil = formData.get('enterUntil')
            const showUrl = formData.get('showUrl')
            const imgFile = formData.get('img')
            const imgName = imgFile?.name || 'default.jpg'

            const res = await fetch('/api/ticket-draws', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    venue,
                    eventdate: eventDate,
                    enterfrom: enterFrom,
                    enteruntil: enterUntil,
                    showurl: showUrl,
                    img: imgName
                })
            })

            const data = await res.json()
            console.log('ticket draw creation:', data)

            if (res.ok) {
                navigate('/TicketDraws')
            } else {
                setError(data.error || 'ticket draw creation failed')
            }
        } catch (err) {
            setError('Network error.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="CreateAttractionPage">
            <div className="CreateAttractionContent">
                <label className="Toggle">
                    <input 
                        type="checkbox" 
                        checked={isTicketDraw} 
                        onChange={(e) => setIsTicketDraw(e.target.checked)} 
                    />
                    Create Ticket Draw instead
                </label>
                {!isTicketDraw && (
                <form onSubmit={handleSubmit}>
                    <h1>Create New Attraction</h1>
                
                    <div className="Input">
                        <input type="text" name="title" placeholder="Title" required/>
                    </div>

                    <div className="Input">
                        <input type="text" name="description" placeholder="Description" required/>
                    </div>

                    <div className="Input">
                        <input type="text" name="location" placeholder="Location" required/>
                    </div>

                    <label for="img">Choose an image:</label>
                    <div>
                        <input type="file" name="img" id="img" placeholder="Image" />
                    </div>

                    <button type="submit">
                        Submit
                    </button>
                </form>
                )}
                {isTicketDraw && (
                <form onSubmit={handleTicketDrawSubmit}>
                    <h1>Create Ticket Draw</h1>

                    <div className="Input">
                    <input type="text" name="title" placeholder="Title" required />
                    </div>

                    <div className="Input">
                    <input type="text" name="venue" placeholder="Venue" required />
                    </div>

                    <div className="floating-label">
                    <input type="date" name="eventDate" id= "eventDate" required />
                    <label htmlFor="eventDate"> Event Date </label>
                    </div>

                    <div className="floating-label">
                    <input type="date" name="enterFrom" id= "enterFrom" required />
                    <label htmlFor="enterFrom"> Enter From </label>
                    </div>

                    <div className="floating-label">
                    <input type="date" name="enterUntil" id= "enterUntil" required />
                    <label htmlFor="enterUntil"> Enter Until </label>
                    </div>

                    <div className="Input">
                    <input type="text" name="showUrl" placeholder="Show URL" />
                    </div>

                    <label htmlFor="img">Choose an image:</label>
                    <input type="file" name="img" id="img" />

                    <button type="submit">Create Ticket Draw</button>
                </form>
                )}
            </div>
        </div>
    )
}