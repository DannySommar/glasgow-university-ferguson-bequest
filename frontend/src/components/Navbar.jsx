import { Link } from "react-router-dom";

export function Navbar(){

    return (
        <>
        <Link to='/'><button>Home</button></Link>
        <Link to='/About'><button>About</button></Link>
        <Link to='/Attractions'><button>Attractions</button></Link>
        </>
    )

}