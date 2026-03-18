const Notification = ({ message, type }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div className="error" style={errorStyle}>
        {message}
      </div>
    )
  }

  else {
    return (
      <div className="success" style={successStyle}>
        {message}
      </div>
    )
  }
}

export default Notification