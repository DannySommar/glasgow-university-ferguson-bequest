import "./Admin.css"
import { Link } from "react-router-dom"

export function Admin(){

    return (
        <>
        <h2 className="text-3xl font-bold text-center my-8 text-black-800">Admin</h2>
        <div className="AdminPage">
        
        <div className="Content">
            <div className="admin">
                <h2>Edit</h2></div>

                <div className="admin">
                    <h2><Link to='/Admin/CreateAttraction'>Create Attraction</Link></h2>
                </div>
                <div className="admin">
                <h2>Booking History</h2></div>
                <div className="admin">
                <h2>Reporting</h2></div>
                </div>
            </div>
        </>
    )
}