import http from 'axios'
import {HANDYNOTE_SERVICE_API} from '@/../config'

const Model = {}
const BaseAPIUrl = process.env.HANDYNOTE_SERVICE_API || HANDYNOTE_SERVICE_API

Model.getNoteList = (params) => {
  return http.get(BaseAPIUrl + '/notes', { params: params })
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

Model.getFolderList = () => {
  return http.get(BaseAPIUrl + '/folders')
}

Model.addFolder = (params) => {
  return http.post(BaseAPIUrl + '/folders/', params)
}

Model.updateFolder = (id, params) => {
  return http.post(BaseAPIUrl + '/folders/' + id, params)
}

Model.deleteFolder = (id) => {
  return http.delete(BaseAPIUrl + '/folders/' + id)
}

export default Model
