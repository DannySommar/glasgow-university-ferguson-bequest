import { useEffect, useState } from 'react'

export function DebugSSO() {

    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('studentproject-gateway.dcs.gla.ac.uk/psd/api/debug-headers')
        .then(() => {
                setStatus('ok')
                setLoading(false)
            })
            .catch(err => {
                setStatus('not ok')
                setLoading(false)
                console.error('Debug fetch error:', err)
            })
    }, [])


    return (
        <div style={{ padding: '20px' }}>
            <h1>SSO Debug Information</h1>
            
            {loading ? ( <p>Sending debug request to backend...</p>) : (<p>{status}</p>)}

            <h2>https://studentproject-gateway.dcs.gla.ac.uk/psd</h2>
            <h2>https://studentproject-gateway.dcs.gla.ac.uk/psd/debug-sso</h2>
        </div>
    )
}