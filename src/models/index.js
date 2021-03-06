import http from 'axios'

const Model = {}
const BaseAPIUrl = process.env.HANDYNOTE_SERVICE_API || 'http://localhost:3000/api'

Model.getBaseImgUrl = () => {
  return BaseAPIUrl + '/images'
}

Model.getBaseAttachUrl = () => {
  return BaseAPIUrl + '/attachments'
}

Model.getHttpPrototype = () => {
  return http
}

Model.login = (params) => {
  return http.post(BaseAPIUrl + '/tokens', params)
}

Model.getNoteList = (params) => {
  return http.get(BaseAPIUrl + '/notes', { params: params })
}

Model.getNoteStatistics = (params) => {
  return http.get(BaseAPIUrl + '/notes/statistics', { params: params })
}

Model.addNote = (params) => {
  return http.post(BaseAPIUrl + '/notes', params)
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

Model.updateImage = (id, params) => {
  return http.post(BaseAPIUrl + '/images/' + id, params)
}

Model.getAttachmentList = (params) => {
  return http.get(BaseAPIUrl + '/attachments', { params: params })
}

Model.deleteAttachment = (id) => {
  return http.delete(BaseAPIUrl + '/attachments/' + id)
}

Model.getFolderList = (params) => {
  return http.get(BaseAPIUrl + '/folders', { params: params })
}

Model.addFolder = (params) => {
  return http.post(BaseAPIUrl + '/folders', params)
}

Model.updateFolder = (id, params) => {
  return http.post(BaseAPIUrl + '/folders/' + id, params)
}

Model.orderFolder = (ids) => {
  const jsonRequest = {
    action: 'adjust_order',
    ids: ids
  }
  return http.post(BaseAPIUrl + '/folders/action', jsonRequest)
}

Model.deleteFolder = (id) => {
  return http.delete(BaseAPIUrl + '/folders/' + id)
}

Model.getTrash = () => {
  return http.get(BaseAPIUrl + '/trash')
}

Model.emptyTrash = () => {
  return http.post(BaseAPIUrl + '/trash/empty')
}

Model.revertTrash = () => {
  return http.post(BaseAPIUrl + '/trash/revert')
}

Model.deleteTrash = (id) => {
  return http.delete(BaseAPIUrl + '/trash/' + id)
}

Model.restoreTrash = (id) => {
  return http.post(BaseAPIUrl + '/trash/' + id + '/restore')
}

export default Model
