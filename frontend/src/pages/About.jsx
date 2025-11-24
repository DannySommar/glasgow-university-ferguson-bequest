import FergusonImage from '../images/Ferguson.jpg'
import './About.css'

export function About() {
    return (
        <>
        <h2>About</h2>
        <div className="AboutPage">
            <div className="Content">
                <div className="FergusonInfo">
                    Professor in Public Health and President of the University Athletics Football club,
                    Professor Thomas Ferguson authored classic studies on the origin of Scotland's social
                    and health services. In 1977 he bequeathed his estate to the University, with the
                    instruction that the money be used to foster the social side of University life for
                    it's then 2,100 staff. The University court established a committee - the Ferguson
                    Bequest Committee - to administer the funds. Various corporate memberships and theatre
                    ticket draws are administered by the Court Office on behalf of the Ferguson Bequest Committee.
                </div>
                <div className="FergusonImage">
                    <img src={FergusonImage} alt="Picture of Ferguson" />
                </div>
            </div>
        </div>
        </>
    );
}