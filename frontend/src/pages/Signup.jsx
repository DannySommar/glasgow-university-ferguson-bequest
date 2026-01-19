import "./Signup.css"

export function Signup() {
    return (
        <div className="SignupPage">
            <div className="SignupContent">
                <form>
                    <h1>Sign Up</h1>
                    <div className="Input">
                        <input type="text" placeholder="Username"></input>
                    </div>
                    <div className="Input">
                        <input type="email" placeholder="Email Address"></input>
                    </div>                    
                    <div className="Input">
                        <input type="password" placeholder="Password"></input>
                    </div>
                    <button type="submit">Sign Up</button>
                    <label>
                        <input type="checkbox"></input>
                        Admin Account
                    </label>
                </form>
            </div>
        </div>
    )
}