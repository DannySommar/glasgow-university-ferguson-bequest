import { AttractionCard } from "../components/AttractionCard"
import "./Attractions.css";
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"


export function Attractions (){

    const blairdrummond = {title: "Blair Drummond Safari Park", img:Blairimg}
    const edizoo = {title: "Edinburgh Zoo", img:zoo}
    const hockey = {title: "Glasgow Clan Ice Hockey", img:clan}
    const rsno = {title: "RSNO - Ghostbuster Concert",  img:rsnoghost}


    const attractions = [blairdrummond, edizoo, hockey, rsno]

    return (
        <>
        <h2>Attractions</h2>
        <div className="attractionPage">
        
            
        {attractions.map((attractions)=>{

            return (
                <AttractionCard attractions={attractions}/>
            )

        })}
        </div>
        </>
        
    )
}

