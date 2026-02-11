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
                alert(error.error || 'deleting faoild');
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
        <div className="attraction">
            <Link to={path}>
                <h2 className="text-xl font-bold text-center my-8 text-gray-800">{attractions.title}</h2>
                {attractions.img && <img src={attractions.img} alt={attractions.title} />}
                <h3>{attractions.description}</h3>
            </Link>
            
            {isAdmin && (
                <button className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Attraction'}
                </button>
            )}
        </div>
    );
}