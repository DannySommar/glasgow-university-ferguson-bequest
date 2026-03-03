import Blairimg from "../images/BlairDrumond.jpg";
import zoo from "../images/EdZoo.jpg";
import rsnoghost from "../images/Ghostbusters-Header.jpg";
import clan from "../images/Clan.jpg";
import { useEffect, useState } from "react";
import { AttractionCard } from "../components/AttractionCard";

export function MyBookings(){
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const imageMap = {
        "BlairDrummond.jpg": Blairimg,
        "EdZoo.jpg": zoo,
        "Clan.jpg" : clan,
        "Ghostbusters-Header": rsnoghost
    }
    
    /*
    const pastAttractions = [
        {
            ...edizoo,
            date: "2024-05-15",
            attendees: 2,
            status: "Attended"
        },
        {
            ...hockey,
            date: "2024-04-22",
            attendees: 4,
            status: "Attended"
        }
    ];

    const upcomingAttractions = [
        {
            ...blairdrummond,
            date: "2024-08-10",
            attendees: 3,
            status: "Confirmed"
        },
        {
            ...rsno,
            date: "2024-09-05",
            attendees: 2,
            status: "Confirmed"
        }
    ];
    */

    useEffect(() => {
        const getBookings = async () => {
            try {
                const response = await fetch('/api/bookings', {
                    credentials: 'include'
                })
                const data = await response.json()
                
                const transformed = data.bookings.map(booking => ({
                    id: booking.id,
                    user_id: booking.user_id,
                    attraction_id: booking.attraction_id,
                    status: booking.status,
                    code: booking.code,
                    title: booking.title,
                    img: imageMap[booking.img],
                    description: booking.description,
                    location: booking.location
                }))

                console.log(transformed)

                setBookings(transformed)
            } catch(error) {
                console.error('Error fetching bookings: ', error)
                setBookings([])
            } finally {
                setLoading(false)
            }
        }

        getBookings()
    }, [])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen">
            <h2 className="text-3xl font-bold text-center my-8 text-black-800">My Bookings</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold, text-gray-800 border-b-2 border-blue-600 pb-2 mb-6">
                        Attractions
                    </h3>
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-lg italic">No Upcoming Bookings</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200" key={booking.id}>
                                    <img className="w-full h-48 object-cover" src={booking.img} alt={booking.title}/>
                                    <div className="p-5">
                                        <h4 className="text-xl font-bold text-gray-800 mb-3">{booking.title}</h4>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-700">
                                                <span className="font-medium">Description:</span> {booking.description}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Location:</span> {booking.location}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Ticket Code:</span> {booking.code}
                                            </p>
                                            <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                                Cancel Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/*
    return (
        <div className="min-h-screen">
            <h2 className="text-3xl font-bold text-center my-8 text-black-800">My Bookings</h2>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6">
                        Upcoming Attractions
                    </h3>
                    
                    {upcomingAttractions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-lg italic">No upcoming bookings</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingAttractions.map((attraction, index) => (
                                <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200"
                                    key={`upcoming-${index}`}
                                >
                                    <img className="w-full h-48 object-cover"
                                        src={attraction.img} 
                                        alt={attraction.title}
                                    />
                                    <div className="p-5">
                                        <h4 className="text-xl font-bold text-gray-800 mb-3">{attraction.title}</h4>
                                        
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-700">
                                                <span className="font-medium">Date:</span> {formatDate(attraction.date)}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Attendees:</span> {attraction.attendees}
                                            </p>
                                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                {attraction.status}
                                            </span>
                                        </div>

                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6">
                        Previously Attended
                    </h3>
                    
                    {pastAttractions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-lg italic">No past bookings</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastAttractions.map((attraction, index) => (
                                <div className="bg-gray-100 rounded-xl shadow overflow-hidden border border-gray-300" 
                                    key={`past-${index}`}
                                >
                                    <img className="w-full h-48 object-cover"
                                        src={attraction.img} 
                                        alt={attraction.title}
                                    />
                                    <div className="p-5">
                                        <h4 className="text-xl font-bold text-gray-800 mb-3">{attraction.title}</h4>
                                        
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-700">
                                                <span className="font-medium">Attended:</span> {formatDate(attraction.date)}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Attendees:</span> {attraction.attendees}
                                            </p>
                                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {attraction.status}
                                            </span>
                                        </div>

                                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                                            Leave Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
*/