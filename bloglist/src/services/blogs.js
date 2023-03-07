let token = null;

const setToken = (t) => {
  token = `Bearer ${t}`
}

const getAll = async () => {
  const res = await fetch('http://localhost:3003/api/blogs')
  const data = await res.json()
  if (res.ok) return data
  throw new Error('Couldn\'t get blogs')
}

const create = async (blog) => {
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(blog)
  }
  const res = await fetch('http://localhost:3003/api/blogs', opts)
  
  if (!res.ok) throw new Error('Could not create blog')
  
  const data = await res.json()
  return data
}

export default { setToken, getAll, create }