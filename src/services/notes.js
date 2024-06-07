import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
    return axios.get(baseUrl).then((response) => response.data)
}

const create = (obj) => {
    return axios.post(baseUrl, obj).then((response) => response.data)
}

const update = (obj) => {
    return axios.put(`${baseUrl}/${obj.id}`, obj).then((response) => response.data)
}

export default { getAll, create, update }
