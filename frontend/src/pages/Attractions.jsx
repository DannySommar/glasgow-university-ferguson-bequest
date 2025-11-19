import { AttractionCard } from "../components/AttractionCard"
import "./Attractions.css";


export function Attractions (){

    const standcomedy = {title: "The Stand Comedy Club", desc: "Comedy club in Glasgow"}
    const blairdrummond = {title: "Blair Drummond Safari Park", desc: "Safari park"}
    const edizoo = {title: "Edinburgh Zoo", desc: "Zoo in Edinburgh"}

    const attractions = [standcomedy,blairdrummond, edizoo]

    return (
        <>
        <h2>Attractions</h2>
        <div className="attraction">
            
        {attractions.map((attractions)=>{

            return (
                <AttractionCard attractions={attractions}/>
            )

        })}
        </div>
        </>
        
    )
}

