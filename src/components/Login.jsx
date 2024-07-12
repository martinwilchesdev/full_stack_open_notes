const Login = (props) => {
    const handleUsername = ({ target }) => props.onHandleUserName(target.value)
    const handlePassword = ({ target }) => props.onHandlePassword(target.value)

    return (
        <form onSubmit={props.onHandleLogin}>
            <div>
                <label>username</label>
                <input onChange={handleUsername} />
            </div>
            <div>
                <label>password</label>
                <input onChange={handlePassword} type="password" />
            </div>
            <button type="submit">login</button>
        </form>
    )
}

export default Login
