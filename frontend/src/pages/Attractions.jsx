import { useState, useEffect } from 'react'
import { AttractionCard } from "../components/AttractionCard"
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { PopUp } from "../components/PopUp";


export function Attractions (){

    const [attractions, setAttractions] = useState([])
    const [isAdmin, setIsAdmin] = useState(false);

    // temporary solution. need to move imgs to public folder when functionality for admin to upload own attractions with imgs
    const imageMap = {
        "BlairDrumond.jpg": Blairimg,
        "EdZoo.jpg": zoo,
        "Clan.jpg": clan,
        "Ghostbusters-Header.jpg": rsnoghost
    }

    useEffect(() => {
        fetchAttractions()
        checkAdminStatus()
    }, [])

    const fetchAttractions = async () => {
        try {
            const response = await fetch('/api/attractions')
            const data = await response.json()
            const transformed = data.attractions.map(attraction => ({
                ...attraction,
                img: imageMap[attraction.img]
            }))
            console.log(transformed)
            setAttractions(transformed)
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
                <div className='mb-10 bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 text-center space-y-2'>
                    <p className='text-gray-800 text-lg'>
                        This is the Attraction page, where you can book ticket(s) for attractions.
                    </p>
                    <p className='text-gray-600 text-sm'>
                        Staff can apply for 3 attractions per year.
                    </p>
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

