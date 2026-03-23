import { pool } from './index.js'
import { attractions, ticketDraws} from './data.js'

export async function seedTables() {
    const client = await pool.connect()

    try {
        
        const result = await client.query('SELECT COUNT(*) FROM attractions')
        const count = parseInt(result.rows[0].count)

        if (count === 0) {
            
            for (const attraction of attractions) {
                await client.query(
                    `INSERT INTO attractions (title, img, description) 
                     VALUES ($1, $2, $3)`,
                    [attraction.title, attraction.img, attraction.description]
                )
            }
            
            console.log(`made ${attractions.length} attractions`)
        }
        
        // to know if potential updates arent working, this may be the cause
        else     
        {
            console.log(`attraction table already exists`)
        }
    

        const ticketResult = await client.query('SELECT COUNT(*) FROM ticket_draws')
        const ticketCount = parseInt(ticketResult.rows[0].count)

        if (ticketCount === 0) {
        for (const draw of ticketDraws) {
            await client.query(
            `INSERT INTO ticket_draws 
            (title, venue, eventdate, enterfrom, enteruntil, img, showurl)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                draw.title,
                draw.venue,
                draw.eventDate,
                draw.enterFrom,
                draw.enterUntil,
                draw.img,
                draw.showUrl
            ]
            )
        }

        console.log(`made ${ticketDraws.length} ticket draws`)
        } else {
        console.log('ticket_draws table already exists')
        }

/*
        const codeResult = await client.query('SELECT COUNT(*) FROM ticket_codes')
        const codeCount = parseInt(codeResult.rows[0].count)

        if (codeCount === 0) {
            for (const ticketCode of ticketCodes) {
                await client.query(
                    `INSERT INTO ticket_codes (code, attraction_id, booking_id)
                    VALUES ($1, $2, $3)`,
                    [ticketCode.code, ticketCode.attraction_id, ticketCode.booking_id]
                )
            }
            console.log(`made ${ticketCodes.length} ticket codes`)
        } else {
            console.log('ticket_codes table already exists')
        }
*/

    } catch (err) {
        console.error('error seeding attractions :', err)
        throw err
    } finally {
        client.release()
    }
}