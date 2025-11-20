

export function AttractionCard({attractions}){

    return (
        <>
        <div className="attraction">
        <h2>{attractions.title}</h2>
        {attractions.img && <img src={attractions.img} alt={attractions.title} />}
        </div>
        </>
    )

}