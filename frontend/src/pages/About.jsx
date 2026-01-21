import FergusonImage from '../images/Ferguson.jpg'
import './About.css'

export function About() {
    return (
        <>
        <div className="AboutPage">
            <div className="Content">
                <div className="FergusonInfo">
                    <h2>About</h2>
                    <ul>
                    <li>Professor in Public Health and President of the University Athletics Football club, 
                        <strong> Professor Thomas Ferguson</strong> authored classic studies on the origin of Scotland's social
                        and health services. In 1977 he bequeathed his estate to the University, with the
                        instruction that the money be used to foster the social side of University life for
                        it's then 2,100 staff. 
                    </li>
                    <li>The University court established a committee - the Ferguson Bequest Committee - to administer the funds. 
                        Various corporate memberships and theatre ticket draws are administered by the Court Office on behalf of the Ferguson Bequest Committee.
                    </li>
                    </ul>
                </div>
                <div className="FergusonImage">
                    <img src={FergusonImage} alt="Picture of Ferguson" />
                </div>
            </div>
        </div>
        </>
    );
}