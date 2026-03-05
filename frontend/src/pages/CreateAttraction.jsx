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
            
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1])
            }

            const res = await fetch('/api/attractions', {
                method: 'POST',
                credentials: 'include',
                body: formData  // no more JSON because we need to send the form in whatever way the bowser decides
            })

            const data = await res.json()
            console.log('data from attraction creation attempt: ', data)

            if (res.ok) {
                navigate('/Attractions')
            } else {
                setError(data.error || 'attraction creation failed')
            }
        } catch(err) {
            console.error('Network error:', err)
            setError('Network error.')
        } finally {
            setLoading(false)
        }
    }

    // Needs to be changed to send FormData later on 
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
            const ticketCodes = formData.get('ticketCodes')

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
                    img: imgName,
                    ticketCodes: ticketCodes
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
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <h1>Create New Attraction</h1>
                    
                        <div className="Input">
                            <input type="text" name="title" placeholder="Title" required disabled={loading}/>
                        </div>

                        <div className="Input">
                            <input type="text" name="description" placeholder="Description" required disabled={loading}/>
                        </div>

                        <div className="Input">
                            <input type="text" name="location" placeholder="Location" required disabled={loading}/>
                        </div>

                        <label htmlFor="img">Choose an image:</label>
                        <div>
                            <input 
                                type="file" 
                                name="img" 
                                id="img" 
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                disabled={loading}
                            />
                        </div>

                        <div className="Input">
                            <input type="text" name="ticketCodes" placeholder="Ticket Codes" disabled={loading}></input>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Submit'}
                        </button>
                    </form>
                )}
                
                {isTicketDraw && (
                    <form onSubmit={handleTicketDrawSubmit} encType="multipart/form-data">
                        <h1>Create Ticket Draw</h1>

                        <div className="Input">
                            <input type="text" name="title" placeholder="Title" required disabled={loading} />
                        </div>

                        <div className="Input">
                            <input type="text" name="venue" placeholder="Venue" required disabled={loading} />
                        </div>

                        <div className="floating-label">
                            <input type="date" name="eventDate" id="eventDate" required disabled={loading} />
                            <label htmlFor="eventDate">Event Date</label>
                        </div>

                        <div className="floating-label">
                            <input type="date" name="enterFrom" id="enterFrom" required disabled={loading} />
                            <label htmlFor="enterFrom">Enter From</label>
                        </div>

                        <div className="floating-label">
                            <input type="date" name="enterUntil" id="enterUntil" required disabled={loading} />
                            <label htmlFor="enterUntil">Enter Until</label>
                        </div>

                        <div className="Input">
                            <input type="text" name="showUrl" placeholder="Show URL" disabled={loading} />
                        </div>

                        <label htmlFor="img">Choose an image:</label>
                        <input 
                            type="file" 
                            name="img" 
                            id="img" 
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            disabled={loading}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Ticket Draw'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}