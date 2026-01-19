import "./Login.css"

export function Login() {
    return (
        <div className="LoginPage">
            <div className="LoginContent">
                <form>
                    <h1>Log In</h1>
                    <div className="Input">
                        <input type="text" placeholder="Username"></input>
                    </div>
                    <div className="Input">
                        <input type="password" placeholder="Password"></input>
                    </div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    )
}