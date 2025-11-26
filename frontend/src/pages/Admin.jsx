import "./Attractions.css"
import { AttractionCard } from "../components/AttractionCard"

export function Admin(){

    const edit = {title: "Edit"}
    const bookinginfo = {title: "Booking Information"}
    const reporting = {title: "Reporting"}

    const admin = [edit, bookinginfo, reporting]

    return (
        <>
        <h2>Admin</h2>
        <div className="attractionPage">
            {admin.map((attractions)=>{
        
                    return (
                        <AttractionCard admin={attractions}/>
                    )
        
                })}
                </div>
        </>
    )
}