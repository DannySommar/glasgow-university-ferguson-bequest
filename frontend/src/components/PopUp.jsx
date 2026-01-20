import { Link } from "react-router-dom"
import "./PopUp.css"
import { useState } from "react";

export function PopUp() {
    const [showPopUp, setShowPopUp] = useState(true);

    const handleAccept = () => {
        setShowPopUp(false);
    };

    if (!showPopUp) return null;

    return (
        <div className="ModalOverlay">
            <div className="Modal">
                <h2>Terms & Conditions</h2>
                <p>Please review and accept our <Link to="/Terms" target="_blank">terms and conditions</Link></p>
                <button onClick={handleAccept}>I Accept</button>
            </div>
        </div>
    );
}