import "./CreateAttraction.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CreateAttraction() {
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

            console.log({ title, description, location})

            const res = await fetch('/api/attractions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials : 'include',
                body: JSON.stringify({ title, description, location})
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

    return (
        <div className="CreateAttractionPage">
            <div className="CreateAttractionContent">
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
            </div>
        </div>
    )
}