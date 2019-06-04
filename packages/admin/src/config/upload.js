// 该文件待重构
import Vue from 'vue';
import Store from 'store';
import JSZip from 'jszip';
import { getFileExtension } from '@/config/utils';
import { tmpXhr } from '@/service/tmp';
//图片上传location
export const UPLOAD_LOCATION = 'oss';

const apiUpload = {
  /*---------上传OSS相关接口---------*/
  apiGetUploadOssConfig: '/api/PdmService/common/ossConfig',
  apiGetUploadStorage: '/api/PdmService/common/storage',
  apiUploadSaveDB: '/PdmService/common/uploadDB',
  apiUploadLocal: '/api/PdmService/common/localUpload',
  apiContentCopy: '/api/PdmService/common/contentCopy',
  apiDownloadXhr: '/PdmService/common/downloadXhr',
  apiDownloadTpl: '/api/PdmService/common/downloadTpl',

  apiCommonColors: '/PdmService/common/colors'
};

let ossConfig = {
  accessId: '',
  host: '',
  policy: '',
  signature: '',
  expire: 0
};
let drcJson = {
  name: '',
  directory: '',
  version: 0,
  file: null
};
let uploadPath = '';

/**
 * @returns {String} a random string of 24 characters
 */
function _randomStr() {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 24; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

/**
 * check if file size smaller than maxSize
 * @param {File} file
 * @param {Int/String} maxSize
 * @param {Function} fail
 * @returns
 */
function _checkSize(file, maxSize, fail) {
  maxSize = parseInt(maxSize, 10);
  if (!file) {
    if (fail) {
      fail();
    }
    return false;
  }

  if (file.size > maxSize) {
    if (fail) {
      fail();
    }
    return false;
  }

  return true;
}

/***
 * check image ratio
 * @param {File} imgFile
 * @param {Number} ratio
 * @param {Function} fail (['ratio', 'length'] failReason ) => {}
 * @returns {boolean}
 * @private
 */
function _checkImgRatio(imgFile, ratio, fail) {
  const FailReasons = {
    ratio: 'ratio',
    length: 'length'
  };

  return new Promise((resolve, reject) => {
    if (!imgFile) {
      typeof fail === 'function' && fail();
      reject();
    }

    //读取图片数据
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      //加载图片获取图片真实宽度和高度
      var image = new Image();
      image.onload = function() {
        var width = image.width;
        var height = image.height;
        if (Math.abs(width / height - ratio) > 0.1) {
          typeof fail === 'function' && fail(FailReasons.ratio);
          reject();
        } else if (width < 100 || height < 100) {
          typeof fail === 'function' && fail(FailReasons.length);
          reject();
        } else {
          resolve();
        }
      };
      image.src = data;
    };
    reader.readAsDataURL(imgFile);
  });
}

/**
 * check if file extension meets the requirement
 * @param {File} file
 * @param {RegExp} regexp such as /(jpg|jpeg|png|gif)$/i
 * @param {Function} fail
 * @returns
 */
function _checkFileFormat(file, regexp, fail) {
  if (!file) {
    if (fail) {
      fail();
    }
    return false;
  }

  let ext = getFileExtension(file.name);
  if (!ext.match(regexp)) {
    if (fail) {
      fail();
    }
    return false;
  }

  return true;
}

/**
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @returns {Object} response from request
 */
function _sendRequest(method, url, data) {
  var xmlhttp = null;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
  }

  if (xmlhttp != null) {
    xmlhttp.open(method, url, false);
    xmlhttp.setRequestHeader(
      'Authorization',
      Store.get(Vue.prototype.$G.store.token) || ''
    );
    if (window.authorization) {
      if (xmlhttp.setRequestHeader) {
        xmlhttp.setRequestHeader('Authorization', window.authorization);
      }
    }
    xmlhttp.send(data);
    return xmlhttp.responseText;
  } else {
    alert('Your browser does not support XMLHTTP.');
  }
}

function _getUploadPath() {
  if (uploadPath !== '') return uploadPath;

  let response = JSON.parse(
    _sendRequest('get', apiUpload.apiGetUploadStorage, null)
  );
  if (response.state) {
    uploadPath = response.data.dir;
  }

  return uploadPath;
}

/**
 * get oss config
 * @returns
 */
function _getSignature() {
  //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
  let now = Date.parse(new Date()) / 1000;
  if (ossConfig.expire < now + 30) {
    let response = JSON.parse(
      _sendRequest('get', apiUpload.apiGetUploadOssConfig, null)
    );
    ossConfig.accessId = response.accessid;
    ossConfig.host = response.host;
    ossConfig.policy = response.policy;
    ossConfig.signature = response.signature;
    ossConfig.expire = parseInt(response.expire);
    return true;
  }
  return false;
}

/**
 * @param {String} template filename format, 'fileName' will be replaced by random string
 * @param {String} directory
 * @returns {Object} fileAttr, random filename with required format and directory
 *          {FormData} oss upload form data
 */
function _setUploadParam(template, directory) {
  if (UPLOAD_LOCATION === 'oss') {
    _getSignature();
  }
  _getUploadPath();
  let fileAttr = {
    name: template.replace(/fileName/i, _randomStr()),
    directory: directory.replace(/directory/i, uploadPath)
  };
  if (
    fileAttr.name.charAt(0) !== '.' &&
    fileAttr.name.split('.').pop() == 'json'
  ) {
    drcJson.name = fileAttr.name;
    drcJson.directory = fileAttr.directory;
  }

  let formData = null;
  if (UPLOAD_LOCATION === 'oss') {
    formData = new FormData();
    formData.append('OSSAccessKeyId', ossConfig.accessId);
    formData.append('key', fileAttr.directory + '/' + fileAttr.name);
    formData.append('policy', ossConfig.policy);
    formData.append('success_action_status', '200');
    formData.append('signature', ossConfig.signature);
  }
  return { fileAttr: fileAttr, formData: formData };
}

/**
 * update media database after uploading resources
 * @param {File} file
 * @param {String} fileName
 * @param {String} directory
 * @param {Function} callback (params: host, directory + filename, mediaId)
 */
function _updateMedia(file, fileName, directory, callback) {
  let data = {
    filename: fileName,
    mimetype: file.type,
    size: file.size,
    storage: directory
  };
  _updateMediaDB(data, callback);
}

/**
 * update media database relying on the passes data
 * @param {Object} data params: filename, mimetype, size, storage, version
 * @param {Function} callback params: host, directory + filename, mediaId
 */
async function _updateMediaDB(data, callback) {
  let ret = await tmpXhr('post', apiUpload.apiUploadSaveDB, data);
  if (callback) {
    callback(ossConfig.host, data.storage + '/' + data.filename, ret.cid);
  }
  // LinctexFetchPost(apiUpload.apiUploadSaveDB, data).then(ret => {
  //   if (callback) {
  //     callback(ossConfig.host, data.storage + '/' + data.filename, ret.cid);
  //   }
  // });
}

/**
 * @param {File} file
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _fileUploader(file, config, progressEvent, callback) {
  config.template =
    config.template || 'fileName.' + getFileExtension(file.name);

  let { fileAttr, formData } = _setUploadParam(
    config.template,
    config.directory
  );
  _uploadToServer(file, fileAttr, formData, config, progressEvent, callback);
}

/**
 * @param {File} file
 * @param {Object} fileAttr random filename with required format and directory
 * @param {FormData} formData oss upload form data
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _uploadToServer(
  file,
  fileAttr,
  formData,
  config,
  progressEvent,
  callback
) {
  switch (UPLOAD_LOCATION) {
    case 'oss':
      _uploadOss(file, fileAttr, formData, config, progressEvent, callback);
      break;
    case 'local':
      _uploadLocal(file, fileAttr, config, progressEvent, callback);
      break;
    default:
      _uploadOss(file, fileAttr, formData, config, progressEvent, callback);
      break;
  }
}

/**
 * @param {File} file
 * @param {Object} fileAttr random filename with required format and directory
 * @param {FormData} formData oss upload form data
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _uploadOss(file, fileAttr, formData, config, progressEvent, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', ossConfig.host, true);
  formData.append('file', file);

  if (progressEvent) {
    xhr.upload.addEventListener(
      'progress',
      function(event) {
        progressEvent(Math.round((event.loaded / event.total) * 100));
      },
      false
    );
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (config.mediaUpdate) {
        _updateMedia(file, fileAttr.name, fileAttr.directory, callback);
      } else if (callback) {
        callback(ossConfig.host, fileAttr.directory + '/' + fileAttr.name);
      }
    } else if (xhr.status != 200 && xhr.responseText) {
      console.error([xhr.responseText]);
    }
  };
  xhr.send(formData);
}

/**
 * @param {File} file
 * @param {Object} fileAttr random filename with required format and directory
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _uploadLocal(file, fileAttr, config, progressEvent, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', apiUpload.apiUploadLocal, true);

  let formData = new FormData();
  formData.append('file', file);
  formData.append('path', fileAttr.directory);
  formData.append('name', fileAttr.name);

  if (progressEvent) {
    xhr.upload.addEventListener(
      'progress',
      function(event) {
        progressEvent(Math.round((event.loaded / event.total) * 100));
      },
      false
    );
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (config.mediaUpdate) {
        _updateMedia(file, fileAttr.name, fileAttr.directory, callback);
      } else if (callback) {
        callback(
          location.origin + '/storage',
          fileAttr.directory + '/' + fileAttr.name
        );
      }
    } else if (xhr.status != 200 && xhr.responseText) {
      console.error([xhr.responseText]);
    }
  };
  xhr.send(formData);
}

/**
 * @param {File} file
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Object} formatCheck includes func(function to check format), message(error message)
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _imgUploader(file, config, progressEvent, formatCheck, callback) {
  formatCheck = formatCheck || {};
  var _URL = window.URL || window.webkitURL;
  let img = new Image();
  img.onload = function() {
    if (formatCheck.func) {
      let imgAttr = {
        width: this.width,
        height: this.height
      };
      if (!formatCheck.func(imgAttr)) {
        alert(formatCheck.message);
        return;
      }
    }

    _fileUploader(file, config, progressEvent, callback);
  };
  img.src = _URL.createObjectURL(file);
}

/**
 * upload drc zip
 * @param {File} file
 * @param {Object} config includes directory
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _modelUploader(file, config, progressEvent, callback) {
  if (UPLOAD_LOCATION === 'oss') {
    _getSignature();
  }
  _getUploadPath();
  var newZip = new JSZip();
  newZip.loadAsync(file).then(function(zip) {
    let keys = Object.keys(zip.files);
    let dirName =
      config.directory.replace(/directory/i, uploadPath) + '/' + _randomStr();
    drcJson.name = '';
    _unzip(zip, keys, [], 0, dirName, progressEvent, callback);
  });
}

/**
 * upload single zip file to oss
 * @param {Array} fileArr unziped files array
 * @param {Int} index cur file index
 * @param {String} dirName
 * @param {Int} num file num
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _modelUploaderSingle(
  fileArr,
  index,
  dirName,
  num,
  progressEvent,
  callback
) {
  if (index < num) {
    let { fileAttr, formData } = _setUploadParam(fileArr[index].name, dirName);

    // Math.round(event.loaded / event.total * 100);
    _uploadToServer(
      fileArr[index],
      fileAttr,
      formData,
      { mediaUpdate: false },
      function(percent) {
        progressEvent(Math.round(percent / num + (index / num) * 100));
      },
      function() {
        _modelUploaderSingle(
          fileArr,
          index + 1,
          dirName,
          num,
          progressEvent,
          callback
        );
      }
    );
  } else {
    let data = {
      filename: drcJson.name,
      mimetype: 'application/zip',
      size: drcJson.file.size,
      storage: drcJson.directory,
      version: drcJson.version
    };
    _updateMediaDB(data, callback);
  }
}

/**
 * upzip drc zip
 * @param {File} zip drc zip file
 * @param {Array} keys keys of zip files
 * @param {Int} index cur file index
 * @param {String} dirName
 * @param {Function} progressEvent
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _unzip(zip, keys, fileArr, index, dirName, progressEvent, callback) {
  // unzip the indexth file and push it to fileArr
  if (index < keys.length) {
    let singleFile = zip.files[keys[index]];
    let fullpath = singleFile.name;
    let filename = fullpath.replace(/^.*[\\/]/, '');

    // check if the file is a directory
    if (!singleFile.dir) {
      zip.files[keys[index]].async('blob').then(function(fileContent) {
        var newFile = new File([fileContent], filename);
        fileArr.push(newFile);
        if (filename.charAt(0) != '.' && filename.split('.').pop() == 'json') {
          let reader = new FileReader();

          reader.addEventListener('loadend', e => {
            let jsonCont = JSON.parse(e.srcElement.result);
            drcJson.version = jsonCont.metadata.version
              ? jsonCont.metadata.version
              : 0;
          });

          reader.readAsText(fileContent);
          drcJson.file = newFile;
        }
        _unzip(zip, keys, fileArr, index + 1, dirName, progressEvent, callback);
      });
    } else {
      _unzip(zip, keys, fileArr, index + 1, dirName, progressEvent, callback);
    }
  } else {
    // upzip end, turn to upload
    _modelUploaderSingle(
      fileArr,
      0,
      dirName,
      fileArr.length,
      progressEvent,
      callback
    );
  }
}

/**
 * fabric batch upload
 * @param {Object} json fabric json content
 * @param {Array} files fabric zip files
 * @param {Object} info fabric batch upload config
 * @param {Int} index cur image index
 * @param {String} type 'xhr', 'thumb' or 'normal'
 * @param {Object} data upload data
 * @param {Function} callback params: data
 */
function _fabricBatchUploader(
  json,
  files,
  info,
  index,
  type,
  data,
  formatImgArr = [],
  callback
) {
  if (index >= json.length) {
    callback(data);
  } else {
    let filename = '';
    let ext = getFileExtension(json[index]['图片']);
    let name = json[index]['图片'].slice(0, -(ext.length + 1));

    if (type === 'xhr') {
      filename = `${name}.${ext}`;
    } else {
      filename = `${name}_${type}.${ext}`;
    }

    info.nameBar.text('正在上传：' + filename);
    files[info.dir + filename].async('blob').then(function(content) {
      let blobFile = new File([content], filename);

      let template = 'fileName.' + ext;
      let { fileAttr, formData } = _setUploadParam(template, info.storage);

      _uploadToServer(
        blobFile,
        fileAttr,
        formData,
        { mediaUpdate: false },
        null,
        function(host, fullname) {
          if (!data[json[index]['供应商编号']]) {
            data[json[index]['供应商编号']] = {};
          }
          data[json[index]['供应商编号']][type] = fullname;

          let selectedIndex = formatImgArr.findIndex(el => el === type);
          let subArr = formatImgArr.slice(selectedIndex + 1);
          for (let el of subArr) {
            if (files[info.dir + name + '_' + el + '.' + ext]) {
              _fabricBatchUploader(
                json,
                files,
                info,
                index,
                el,
                data,
                formatImgArr,
                callback
              );
              return;
            }
          }
          _fabricBatchUploader(
            json,
            files,
            info,
            index + 1,
            'xhr',
            data,
            formatImgArr,
            callback
          );
        }
      );
    });
  }
}

/**
 * @param {Object} jsonObj json content
 * @param {Object} config includes template, directory, mediaUpdate(if needed to update media)
 * @param {Function} progressEvent
 * @param {Function} formatCheck
 * @param {Function} callback success callback (params: host, directory + filename, mediaId)
 */
function _jsonUploader(jsonObj, config, progressEvent, formatCheck, callback) {
  let json = JSON.stringify(jsonObj);
  let { fileAttr, formData } = _setUploadParam(
    config.template,
    config.directory
  );
  let file = new File([json], fileAttr.directory + '/' + fileAttr.name, {
    type: 'application/json'
  });
  _uploadToServer(file, fileAttr, formData, config, progressEvent, callback);
}

export {
  _randomStr as randomStr,
  _checkSize as checkSize,
  _checkFileFormat as checkFileFormat,
  _checkImgRatio as checkImgRatio,
  _fileUploader as fileUploader,
  _imgUploader as imgUploader,
  _modelUploader as modelUploader,
  _getUploadPath as getUploadPath,
  _fabricBatchUploader as fabricBatchUploader,
  _jsonUploader as jsonUploader
};
