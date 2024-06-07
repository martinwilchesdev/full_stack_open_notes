import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
        id: 100000,
        content: "This note is not saved to server",
        important: true
    }
    return request.then((response) => response.data.concat(nonExisting))
}

const create = (obj) => {
    return axios.post(baseUrl, obj).then((response) => response.data)
}

const update = (obj) => {
    return axios.put(`${baseUrl}/${obj.id}`, obj).then((response) => response.data)
}

export default { getAll, create, update }
