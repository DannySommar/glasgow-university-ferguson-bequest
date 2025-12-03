import { PopUp } from '../components/PopUp'
import './Home.css'

export function Home(){
    return (
        <>
        <h2 className="text-3xl font-bold text-center my-8 text-gray-800">Home</h2>
        <div className="HomePage">
            <div className="Content">
                <div className="Information">
                    <h3>Welcome to the Ferguson Bequest</h3>
                    <p>Staff may apply for 3 Attractions per calendar year. These cannot currently be cancelled once you have applied, so ensure you are applying for the correct attraction at the time of booking!</p>
                    <p>Booking instructions for each attraction appear on individual attraction pages. Please see How To Book for Terms & Conditions.</p>
                    <p>Staff may enter as many Ticket Draws as they wish and may win 1 per year - please do NOT apply for a ballot if you are unable to attend the event! Winners will be removed from future ballots.</p>
                    <p>The Ferguson Bequest Attraction tickets and Ballots are available to all members of University of Glasgow staff holding a contract of employment. This does not include registered honorary and affiliation status holders, casual workers, or individuals employed directly by other organisations but paid via University payroll.</p>
                    <p>For queries relating to the Ferguson Bequest please email fergusonbequest@glasgow.ac.uk</p>
                </div>
            </div>
        </div>
        </>
    )
}