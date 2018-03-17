import Pica from 'pica'
import {maxUploadPicSize} from '@/../config'

export * from '@/util/filters'

export const prepareFolderData = (topItem, inputData) => {
  if (typeof inputData !== 'object' || inputData.length === 0) return [topItem]

  let rootItem = JSON.parse(JSON.stringify(topItem)) // deep copy
  rootItem.children = []

  let itemMap = new Map()
  itemMap.set(topItem.id, rootItem)

  let maxLevel = 0
  let levelMap = new Map()

  inputData.forEach(item => {
    const curLevel = item.ancestor_ids.length
    maxLevel = Math.max(curLevel, maxLevel)
    itemMap.set(item._id, {
      id: item._id,
      label: item.name,
      ancestor_ids: item.ancestor_ids,
      children: []
    })
    let levelItem = {itemId: item._id, parentId: item.parent_id}
    if (levelMap.has(curLevel)) {
      levelMap.get(curLevel).push(levelItem)
    } else {
      levelMap.set(curLevel, [levelItem])
    }
  })
  // console.log(itemMap)
  // console.log('maxLevel is: ' + maxLevel)
  // console.log(levelMap)

  for (let i = maxLevel; i > 0; i--) {
    if (!levelMap.has(i)) continue
    let levelItems = levelMap.get(i)
    levelItems.forEach(item => {
      if (itemMap.has(item.parentId) && itemMap.has(item.itemId)) {
        itemMap.get(item.parentId).children.push(itemMap.get(item.itemId))
      }
    })
  }

  return [itemMap.get(topItem.id)]
}

const getImgObj = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.src = url
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

const pica = new Pica()

export const getResizedImgData = async (origImgData) => {
  const MAX_SIZE = maxUploadPicSize
  let ret = origImgData
  let origImgObj = await getImgObj(origImgData)
  console.log('original img width: ' + origImgObj.width + ', height: ' + origImgObj.height)

  if (origImgObj.width > MAX_SIZE || origImgObj.height > MAX_SIZE) {
    // calculate resized width & height
    let resizedWidth = origImgObj.width
    let resizedHeight = origImgObj.height
    if (resizedHeight > resizedWidth) {
      resizedHeight = Math.min(resizedHeight, MAX_SIZE)
      resizedWidth = resizedHeight * (origImgObj.width / origImgObj.height)
    } else {
      resizedWidth = Math.min(resizedWidth, MAX_SIZE)
      resizedHeight = resizedWidth * (origImgObj.height / origImgObj.width)
    }
    console.log('resized img width: ' + resizedWidth + ', height: ' + resizedHeight)

    let resizedCanvas = document.createElement('canvas')
    resizedCanvas.width = resizedWidth
    resizedCanvas.height = resizedHeight

    let result = await pica.resize(origImgObj, resizedCanvas)
    ret = result.toDataURL('image/jpeg')
  }

  return ret
}

export const getCurUsrId = () => { return window.localStorage.getItem('hn-user') }

export const getCurUsrRootFolderId = () => { return window.localStorage.getItem('hn-user') + '-Root' }

export const getCurUsrRecentFolderId = () => { return window.localStorage.getItem('hn-user') + '-Recent' }

export const getCurUsrStarFolderId = () => { return window.localStorage.getItem('hn-user') + '-Starred' }

export const getCurUsrTrashFolderId = () => { return window.localStorage.getItem('hn-user') + '-Trash' }
