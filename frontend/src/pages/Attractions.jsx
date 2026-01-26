import { useState, useEffect } from 'react'

import { AttractionCard } from "../components/AttractionCard"
import "./Attractions.css";
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { PopUp } from "../components/PopUp";



export function Attractions (){
    


    const [attractions, setAttractions] = useState([])

    // temporary solution. need to move imgs to public folder when functionality for admin to upload own attractions with imgs
    const imageMap = {
        "BlairDrumond.jpg": Blairimg,
        "EdZoo.jpg": zoo,
        "Clan.jpg": clan,
        "Ghostbusters-Header.jpg": rsnoghost
    }

    useEffect(() => {
        fetchAttractions()
    }, [])

    const fetchAttractions = async () => {
        try {
            const response = await fetch('/api/attractions')
            const data = await response.json()

            const transformed = data.attractions.map(attraction => ({
                ...attraction,
                img: imageMap[attraction.img]
            }))

            console.log(transformed)

            setAttractions(transformed)
        } catch (error) {
            console.error('Error fetching attractions:', error)
            setAttractions([])
        }
    }


    return (
        <>
        <h2 className="text-3xl font-bold text-center my-8 text-black-800">Attractions</h2>
        <div className="attractionPage">
        <div className="Content">
        
            
        {attractions.map((attractions)=>{

            return (
                <AttractionCard attractions={attractions}/>
            )

        })}
        </div>
        </div>
        
        </>
        
    )
}

