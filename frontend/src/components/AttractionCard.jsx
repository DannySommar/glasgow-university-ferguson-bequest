import { Link } from "react-router-dom";
import { useState } from "react";
import { createSlug } from "../utils/slug";

export function AttractionCard({ attractions, isAdmin, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    const path = `/attractions/${createSlug(attractions.title)}`

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${attractions.title}"?`)) {
            return;
        }

        setIsDeleting(true)

        try {
            const response = await fetch(`/api/attractions/${attractions.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                if (onDelete) {
                    onDelete(attractions.id);
                }
                alert('deleted attraction ok');
            } else {
                const error = await response.json();
                alert(error.error || 'deleting failed');
            }
        }
        catch (err) {
            console.error('error while deleting: ', err);
            alert('Network error.');

        }
        finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
            <Link to={path} className="block">
                {attractions.img && (
                    <img className="w-full h-48 object-cover" src={attractions.img} alt={attractions.title} />
                )}  
                <div className="p-5 space-y-3">
                    <h4 className="text-xl font-bold text-gray-800">{attractions.title}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"> Learn more about this attraction. </p>
                </div>
            </Link>

            {isAdmin && (
                <div className="p-5 pt-0">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Attraction'}
                    </button>
                </div>
            )}
        </div>
    );
}