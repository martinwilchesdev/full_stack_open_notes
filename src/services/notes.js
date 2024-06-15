import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const create = (obj) => {
    return axios.post(baseUrl, obj).then((response) => response.data)
}

const update = (obj) => {
    return axios.put(`${baseUrl}/${obj.id}`, obj).then((response) => response.data)
}

export default { getAll, create, update }
