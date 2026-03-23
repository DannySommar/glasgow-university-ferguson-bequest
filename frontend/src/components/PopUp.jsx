import { Link } from "react-router-dom"
import "./PopUp.css"
import { useState } from "react";

export function PopUp({onClick}) {
    return (
        <div className="ModalOverlay">
            <div className="Modal">
                <h2>Terms & Conditions</h2>
                <p>Please review and accept our <Link to="/Terms" target="_blank">terms and conditions</Link></p>
                <button onClick={onClick}>I Accept</button>
            </div>
        </div>
    );
}