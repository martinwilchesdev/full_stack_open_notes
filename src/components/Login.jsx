const Login = (props) => {
    const handleUsername = ({ target }) => props.onHandleUserName(target.value)
    const handlePassword = ({ target }) => props.onHandlePassword(target.value)

    const showLoginFormButton = { display: !props.loginVisible ? 'block' : 'none' }
    const showCancelButton = { display: !props.loginVisible ? 'none' : 'block' }
    const visibleLogin = { display: props.loginVisible ? 'block' : 'none' }

    return (
        <>
            <form onSubmit={props.onHandleLogin} style={visibleLogin}>
                <div>
                    <label>username:</label>
                    <input onChange={handleUsername} value={props.username} />
                </div>
                <div>
                    <label>password:</label>
                    <input onChange={handlePassword} value={props.password} type="password" />
                </div>
                <button type="submit">login</button>
            </form>
            <div>
                <button
                    style={showLoginFormButton}
                    onClick={() => props.onHandleLoginVisible(true)}
                >
                    show login
                </button>
                <br />
                <button
                    style={showCancelButton}
                    onClick={() => props.onHandleLoginVisible(false)}
                >
                    cancel
                </button>
            </div>
        </>
    )
}

export default Login
