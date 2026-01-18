import attractionsData from '../data/attractions.json' assert { type: 'json' }; // need this because we are not exporting json as a js function. will change with database anyway.

export async function getAttractions(req, res) {
    try {
        console.log('getting attractions attractions.json');
        
        // for now, just return all attractions from the JSON file
        res.json(attractionsData);
        
        // query for filter in controller if we want it
        // ( we can just check query in url and do stuff, but might need to change if we want to implement postgreSQL queries which are more efficient)
        /*
        const { title, category, ...anything more } = req.query;
        let filteredAttractions = attractionsData.attractions;
        
        if (title) {
            filteredAttractions = filteredAttractions.filter(attraction => attraction.title.toLowerCase().includes(title.toLowerCase()) );
        }
        
        if (category) {
            filteredAttractions = filteredAttractions.filter(attraction =>  attraction.category === category );
        }
        
        res.json({ attractions: filteredAttractions });

        */
    } catch (err) {
        console.error('error fetching attractions:', err);
        res.status(500).json({ error: 'failed to fetch all attractions' });
    }
}