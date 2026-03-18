import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function DebugSSO() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: '#333', borderBottom: '2px solid #0078d4', paddingBottom: '10px' }}>
                SSO Debug
            </h1>

            <div style={{ 
                padding: '20px', 
                backgroundColor: '#e8f4fd', 
                borderRadius: '8px',
                borderLeft: '4px solid #0078d4'
            }}>
                <h3 style={{ marginTop: 0 }}>Steps to Debug SSO:</h3>
                
                <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <li>
                        <p>
                            Can't be directly checked with fetch()
                        </p>
                    </li>
                    <li>
                        <strong>Step 1:</strong> Click the link below to visit the gateway debug endpoint (https://studentproject-gateway.dcs.gla.ac.uk/psd/api/debug-headers)
                    </li>
                    <li>
                        <strong>Step 2:</strong> You'll be redirected to University GUID login (if not already logged in)
                    </li>
                    <li>
                        <strong>Step 3:</strong> After login, check the backend console on maloelap (can open a new window with sudo docker logs -f sh40-main-backend-1)
                    </li>
                    <li>
                        <strong>Step 4:</strong> Look for these headers in the logs:
                    </li>
                </ol>

                <div>
                    <div><strong>dh75hdyt76</strong> = Your GUID number</div>
                    <div><strong>dh75hdyt77</strong> = Your full name</div>
                    <div><strong>dh75hdyt80</strong> = Your email address</div>
                </div>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <a 
                        href="https://studentproject-gateway.dcs.gla.ac.uk/psd/api/debug-headers"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#0078d4',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        Open SSO Debug in a new tab
                    </a>
                </div>
            </div>
        </div>
    )
}