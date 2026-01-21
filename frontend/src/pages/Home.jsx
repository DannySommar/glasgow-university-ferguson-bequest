import { PopUp } from '../components/PopUp'
import './Home.css'

export function Home(){
    return (
        <>
        <div className="HomePage">
        <h2 className="text-3xl font-bold text-center my-8 text-white-800">Ferguson Bequest</h2>
                <div className="Information">
                    <h3>Welcome!</h3>
                    <p>This website exists to help University of Glasgow 
                        staff access and enjoy the benefits provided through 
                        the Ferguson Bequest. It brings together all available attractions,
                        ticket draws, and booking information in one simple place, making it easy to explore what is on offer 
                        and apply for opportunities throughout the year.</p>
                </div>
                <div className="Information">
                <h3>What You Can Do Here</h3>
                    <ul>
                        <li>- Browse the full range of attractions supported by the Ferguson Bequest.</li>
                        <li>- Apply for up to three attractions per calendar year.</li>
                        <li>- Enter ticket draws for special events.</li>
                        <li>- Find clear booking instructions and key terms and conditions for each attraction.</li>
                    </ul>
                </div>
                <div className="Information">
                <h3>Important Rules at a Glance</h3>
                    <ul>
                        <li>
                        Attraction applications cannot be cancelled, so please ensure you choose carefully
                        before submitting.
                        </li>
                        <li>
                        You may enter as many ticket draws as you like, but you can only win one per year.
                        Please avoid entering ballots for events you cannot attend.
                        </li>
                        <li>
                        The Ferguson Bequest is available to University of Glasgow staff with a contract
                        of employment. It does not include honorary or affiliate status holders, casual workers,
                        or individuals employed by external organisations but paid via University payroll.
                        </li>
                    </ul>
                </div>
                <div className="Information">
                    <h3>Need Help?</h3>
                    <p>
                        For any queries, please contact <strong>fergusonbequest@glasgow.ac.uk</strong>
                    </p>
                </div>
            </div>
        </>
    )
}