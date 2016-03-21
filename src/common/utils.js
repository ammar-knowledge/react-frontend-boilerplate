function appendFiles(fd, name, files) {
  files.forEach(function(item) {
    if (item instanceof FileList) {
      var cnt = item.length;
      for (var i = 0; i < cnt; i++) {
        var file = item[i];
        fd.append(name, file);
      }
    } else if (item instanceof File) {
      fd.append(name, item);
    }
  });
}

export function makeFormData(obj) {
  var fd = new FormData();
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    /* console.log('fd.k-v: ', key, value); */
    if (value === undefined || value === null) {
      fd.append(key, '');
    } else if (value instanceof FileList) {
      // Append files
      appendFiles(fd, key, [value]);
    } else if (value instanceof Array && value.length > 0 && (value[0] instanceof FileList || value[0] instanceof File)) {
      // Append files
      appendFiles(fd, key, value);
    } else if (value === true || value === false) {
      // Boolean value
      fd.append(key, value ? 1 : 0);
    } else if (value instanceof Array) {
      value.forEach(function(item) {
        fd.append(key, item);
      });
    } else if (value instanceof Object) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value);
    }
  });
  return fd
}

export function getStatusClassArray(status, originValue) {
  const value = (originValue === undefined || originValue === null) ? originValue : String(originValue);
  const obj = {
    'error': status.errors,
    'validating': status.isValidating,
    'success': value && !status.errors && !status.isValidating
  }
  return Object.keys(obj).filter(function(key) {
    return obj[key];
  });
}

export function getStatusClasses(status, originValue) {
  return getStatusClassArray(status, originValue).join(' ');
}

export function getStatusHelp(status) {
    return status.isValidating ? "正在校验中.." : status.errors ? status.errors.join(',') : null
}

export function updateFilters(oldFilters, name, operation, value) {
  let newFilters = [];
  let matched = false;
  oldFilters.forEach(function(item) {
    if (item[0] === name && item[1] === operation) {
      if (value !== undefined) {
        newFilters.push([name, operation, value]);
      }
      matched = true;
    } else {
      newFilters.push(item);
    }
  });

  if (!matched) {
    newFilters.push([name, operation, value]);
  }
  return newFilters;
}
