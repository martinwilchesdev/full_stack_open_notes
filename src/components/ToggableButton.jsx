const ToggableButton = (props) => {
    const showLoginFormButton = { display: !props.loginVisible ? 'block' : 'none' }
    const showCancelButton = { display: !props.loginVisible ? 'none' : 'block' }

    return (
        <div>
            {props.children}
            <button
                style={showLoginFormButton}
                onClick={() => props.onHandleLoginVisible(true)}
            >show login</button>
            <br />
            <button
                style={showCancelButton}
                onClick={() => props.onHandleLoginVisible(false)}
            >cancel</button>
        </div>
    )
}

export default ToggableButton