const login = async (credentials) => {
  try {
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }

    const res = await fetch('http://localhost:3003/api/login', opts)
    const data = await res.json()
    if (res.ok) return data
  } catch (ex) {
    console.error(ex)
  }
  throw new Error('Invalid Credentials')
}

export default { login }