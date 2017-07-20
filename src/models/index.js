import http from 'axios'
import {BaseAPIUrl} from '@/../config'

const Model = {}

Model.getNoteList = () => {
  return http.get(BaseAPIUrl + '/notes')
}

Model.addNote = (params) => {
  return http.post(BaseAPIUrl + '/notes/', params)
}

Model.getNote = (id) => {
  return http.get(BaseAPIUrl + '/notes/' + id)
}

Model.updateNote = (id, params) => {
  return http.post(BaseAPIUrl + '/notes/' + id, params)
}

Model.deleteNote = (id) => {
  return http.delete(BaseAPIUrl + '/notes/' + id)
}

export default Model
