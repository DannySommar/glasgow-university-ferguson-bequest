import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { PopUp } from "../components/PopUp"

export function TicketDraws() {

    const [selected, setSelected] = useState(null);
    const [ticketDraws, setTicketDraws] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [ status, setStatus ] = useState("");
    const [showPopUp, setShowPopUp] = useState(false); 
    const [pendingDraw, setPendingDraw] = useState(null); 

    // temporary solution. need to move imgs to public folder when functionality for admin to upload own attractions with imgs
    const imageMap = {
        "BlairDrumond.jpg": Blairimg,
        "EdZoo.jpg": zoo,
        "Clan.jpg": clan,
        "Ghostbusters-Header.jpg": rsnoghost
    }

    useEffect(() => {
        fetchTicketDraws()
        checkAdminStatus()
    }, [])

    const fetchTicketDraws = async () => {
        try {
            const response = await fetch('/api/ticket-draws', { credentials: 'include' })
            const data = await response.json()

            const transformed = data.ticketDraws.map(draw => ({
              id: draw.id, 
              title: draw.title, 
              venue: draw.venue, 
              eventDate: draw.eventdate, 
              enterFrom: draw.enterfrom, 
              enterUntil: draw.enteruntil, 
              img: imageMap[draw.img], 
              showUrl: draw.showurl
            }))

            console.log(transformed)

            setTicketDraws(transformed)
        } catch (error) {
            console.error('Error fetching ticket draws:', error)
            setTicketDraws([])
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

    const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const handleEnterDrawClick = (draw) => {
        setPendingDraw(draw); 
        setShowPopUp(true);
    }

    const handleAcceptTerms = async () => {
        setShowPopUp(false);
        
        if (!pendingDraw) return;
        
        setStatus("");
        try{
            const res = await fetch("/api/ticket-draws/enter", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({ ticketDrawId: pendingDraw.id})
            });
            const data = await res.json();
            console.log(data)
            if (res.ok) {
                setSelected(pendingDraw.title);
                setStatus(`You're in the draw for ${pendingDraw.title}`);
            } else if (res.status === 401) {
                setStatus("Please log in to enter draw.");
            } else if (res.status === 409) {
                setStatus("You are already entered for this draw.")
            } else {
                setStatus(data.error || "Could not enter draw. Try again.")
            }
        } catch (err) {
            setStatus("Network error. Please Try Again.")
        }
    };
   

    const handleDelete = async (e, draw) => {
        e.stopPropagation();

        if (!window.confirm(`Delete "${draw.title}"?`)) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/ticket-draws/${draw.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setTicketDraws(prev => prev.filter(d => d.id !== draw.id));
                alert('Ticket draw deleted');
            } else {
                const error = await response.json();
                alert(error.error || 'Delete failed');
            }
        } catch (err) {
            console.error('error deleting ticket draw:', err);
            alert('Network error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePickWinner = async (draw) => {
        setStatus('Picking Winner...');
        try {
            const res = await fetch("/api/ticket-draws/pick-winner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ticketDrawId: draw.id })
            })
            const data = await res.json();
            console.log(data)
            if (res.ok) {
                setStatus(`Winner for ${draw.title}: ${data.winner?.username || "Unknown"} (${data.winner?.email || "no email"})`)
            } else {
                setStatus(data.error || "Could not pick winner.")
            }
        } catch (err) {
            setStatus("Network error. Please try again.")
        }
    };


   return (
    <div className="min-h-screen"> 
        <h2 className="text-3xl font-bold text-center my-8 text-black-800">Ticket Draws</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> 
        <div className='mb-10 bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 text-center'>
                <p className="text-gray-800 text-lg text-center mb-4"> 
                    This is the Ticket Draws Page, where you can enter draws to win ticket(s) for events. </p> 
        </div>
            {status && ( <div className="mb-6 text-center text-sm text-gray-800">{status}</div> )} 
            
            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6 text-center md:text-left"> Open Draws </h3> 
        
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
                {ticketDraws.map((draw) => ( 
                    <div 
                        key={draw.id} 
                        className={`bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition ring-offset-2 cursor-pointer ${ 
                            selected === draw.title ? "ring-2 ring-blue-200" : "" 
                            }`} 
                            onClick={() => setSelected(draw.title)} 
                        > 
                            <img className="w-full h-48 object-cover" src={draw.img} alt={draw.title} /> 
              
                            <div className="p-5 space-y-3"> 
                                <h4 className="text-xl font-bold text-gray-800">{draw.title}</h4>
                                <p className="text-gray-700"> 
                                    <span className="font-medium">Venue:</span> {draw.venue} </p> 
                                <p className="text-gray-700"> 
                                    <span className="font-medium">Event date:</span> {formatDate(draw.eventDate)} </p>
                                <p className="text-gray-700"> 
                                    <span className="font-medium">Enter from:</span> {formatDate(draw.enterFrom)} </p> 
                                <p className="text-gray-700"> 
                                    <span className="font-medium">Enter until:</span> {formatDate(draw.enterUntil)} </p> 
                                <p> 
                                    <a 
                                        href={draw.showUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 underline" 
                                    >
                                        View event details 
                                    </a> 
                                </p>
                
                                <div className="space-y-2 mt-2"> 
                                    <button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200" 
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            handleEnterDrawClick(draw);
                                    }} 
                                > 
                                    Enter Draw 
                                </button>

                                {isAdmin && (
                                <>
                                    <Link to ={`/ticket-draws/${draw.id}/edit`}
                                    className="w-full inline-block text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg"
                                    onClick={e => e.stopPropagation()}
                                    >
                                        Edit Ticket Draw
                                    </Link>
                                    <button
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handlePickWinner(draw)
                                    }}
                                >
                                    Pick Winner
                                    </button>

                                    <button
                                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg mt-4"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(e, draw)   
                                    }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Ticket Draw'}
                                    </button>
                                </>                                      
                            )}
                        </div> 
                    </div>
                </div> 
            ))} 
        </div>
        </div> 
        {showPopUp && (
            <PopUp 
                onClick={handleAcceptTerms}
            />
        )}
    </div> 
  ) 
}
