
import { Link } from "react-router-dom";
export function AttractionCard({attractions}){

    const slug = attractions.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace spaces and other chars with "-"
    .replace(/^-+|-+$/g, "");    // remove leading/trailing dashes
    const path = `/attractions/${slug}`


    return (
        <>
        <div className="attraction">
        <Link to={path}>
        <h2 className="text-xl font-bold text-center my-8 text-gray-800">{attractions.title}</h2>
        {attractions.img && <img src={attractions.img} alt={attractions.title} />}
        <h3>{attractions.description}</h3>
        </Link>
        
        </div>
        </>
    )

}