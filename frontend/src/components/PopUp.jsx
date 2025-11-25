import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./PopUp.css"

export function PopUp() {
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("acceptedTerms");
        if (!accepted) {
            setShowPopUp(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("acceptedTerms", "true")
        setShowPopUp(false);
    };

    if (!showPopUp) return null;

    return (
        <div className="ModalOverlay">
            <div className="Modal">
                <h2>Terms & Conditions</h2>
                <p>Please review and accept our terms & conditions:</p>
                <p><Link to="/Terms" target="_blank">Terms & Conditions</Link></p>
                <button onClick={handleAccept}>I Accept</button>
            </div>
        </div>
    );
}