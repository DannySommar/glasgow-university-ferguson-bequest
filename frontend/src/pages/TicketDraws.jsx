import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { useState } from "react"


export function TicketDraws(){

    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState("");

    const draws = [
        {title: "Blair Drummond Safari Park", img:Blairimg},
        {title: "Edinburgh Zoo", img:zoo},
        {title: "Glasgow Clan Ice Hockey", img:clan},
        {title: "RSNO - Ghostbuster Concert",  img:rsnoghost},
    ]
    
    const handleEnterDraw = async (draw) => {
        setStatus("");
        try{
            const res = await fetch("/api/draws/enter", {
                method: "Post",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({ attraction: draw.title})
            });
            const data = await res.json();
            if (res.ok) {
                setSelected(draw.title);
                setStatus(`You're in the draw for ${draw.title}`);
            } else if (res.status === 401) {
                setStatus("Please log in to enter draw.");
            } else if (res.staus === 409) {
                setStatus("You are already entered for this draw.")
            } else {
                setStatus(data.error || "Could not enter draw. Try again.")
            }
        } catch (err) {
            setStatus("Network error. Please Try Again.")
        }
    };

    return (
        <div className="min-h-screen">
            <h2 className="text-3xl font-bold text-center my-8 text-black-800">Ticket Draws</h2>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-10 bg-gray-50 rounded-xl shadow-md border border-gray-200 p-6 text-center space-y-2">
                    <p className="text-gray-800 text-lg">
                        This is the Ticket Draws Page, where you can enter draws to win ticket(s) for events.
                    </p>
                    <p className="text-gray-600 text-sm">
                        Staff may enter as many draws as they like but can only win one per year. Past winners will be removed.
                    </p>
                </div>

                {status && <div className="mb-6 text-center text-sm text-gray-800">{status}</div>}

                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6 text-center md:text-left">
                        Open Draws
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {draws.map((draw) => (
                            <div
                                key={draw.title}
                                className={`bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition ring-offset-2 cursor-pointer ${
                                    selected == draw.title ? "ring-2 ring-blue-200" : ""
                            }`}
                            onClick={() => setSelected(draw.title)}
                        >
                            {draw.img && (
                                <img className="w-full h-48 object-cover" src={draw.img} alt={draw.title} />
                            )}

                            <div className="p-5 space-y-3">
                                <h4 className="text-xl font-bold text-gray-800">{draw.title}</h4>
                                <p className="text-gray-700">
                                    <span className="font-medium">Prize:</span> {draw.prize}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Closes:</span> {draw.closes}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">{draw.blurb}</p>

                                <button
                                    type="button"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnterDraw(draw);
                                    }}
                                >
                                    Enter Draw
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
  
}