import { useState, useEffect } from 'react'
import { AttractionCard } from "../components/AttractionCard"
import { PopUp } from "../components/PopUp";

export function Attractions (){
    const [attractions, setAttractions] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchAttractions()
        checkAdminStatus()
    }, [])

    const fetchAttractions = async () => {
        try {
            const response = await fetch('/api/attractions')
            const data = await response.json()
            console.log('attractions from backend:', data.attractions)
            setAttractions(data.attractions)
        } catch (error) {
            console.error('Error fetching attractions:', error)
            setAttractions([])
        }
    }

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await response.json();
            setIsAdmin(data.isAdmin || false);
        } catch (err) {
            console.error('error checking admin status:', err);
        }
    }

    const handleDeleteAttraction = (deletedId) => {
        setAttractions(prev => prev.filter(attraction => attraction.id !== deletedId));
    }

    return (
        <div className='min-h-screen'>
            <h2 className='text-3xl font-bold text-center my-8 text-black-800'>Attractions</h2>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
                    <p className='text-gray-800 text-lg text-center mb-4'>
                        This is the Attraction page, where you can book ticket(s) for attractions.
                    </p>
                    <div className='mb-10 bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6'>
                    <p className="text-gray-700 text-center font-semibold mb-3">T&Cs:</p>
                    <ul className="list-disc list-inside text-dark-gray-600 text-sm space-y-2">
                        <li>The e-ticket codes are available to any member of staff of the University holding a contract of employment with the University, excluding registered honorary & affiliate status holders, casual workers, or individuals employed directly by other organisations but paid via University payroll.</li>
                        <li>Please do not apply for e-ticket codes if you are unable to attend the attraction.</li>
                        <li>It is your responsibility to ensure the attraction is suitable for all members of your party.</li>
                        <li>If you believe you will not be able to use the allocated e-ticket codes, please contact fergusonbequest@glasgow.ac.uk immediately.</li>
                        <li>If, due to unforeseen circumstances, you cannot attend a pre-booked attraction, you may not request further e-ticket codes for that attraction within the same year.</li>
                        <li>E-ticket codes are non-transferable and should not be passed to another person or another staff member.</li>
                        <li>E-ticket codes are equivalent to one attraction entry ticket per code and cannot be used as a substitution for monetary value towards goods and/or services.</li>
                        <li>The University is in no way liable or responsible for other costs incurred during visits, nor attraction cancellations or closures.</li>
                        <li>Staff are required to present their staff card and e-ticket codes as well as any entry tickets on the day.</li>
                        <li>Staff are subject to venue policies, procedures and safety measures.</li>
                        <li>During visits, staff should be mindful that they are representing the University of Glasgow and ensure they, and members of their party, conduct themselves in a manner appropriate to the University and its values.</li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-2xl font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6 text-center md:text-left'>
                        Available Attractions
                    </h3>

                    {attractions.length === 0 ? (
                        <div className='text-center py-12 bg-gray-50 rounded-lg'>
                            <p className='text-gray-600 text-lg italic'>No attractions available</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {attractions.map((a) => (
                                <AttractionCard
                                    key={a.id}
                                    attractions={a}
                                    isAdmin={isAdmin}
                                    onDelete={handleDeleteAttraction}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}