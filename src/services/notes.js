import axios from 'axios'

const baseUrl = '/api/notes'
let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    return axios.get(baseUrl).then((response) => response.data)
}

const create = (obj) => {
    const config = { headers: { Authorization: token } }

    return axios.post(baseUrl, obj, config).then((response) => response.data)
}

const update = (obj) => {
    return axios.put(`${baseUrl}/${obj.id}`, obj).then((response) => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.status)
}

export default { getAll, create, update, remove, setToken }
