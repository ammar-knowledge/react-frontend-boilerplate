
import axios from 'axios';
import cookie from 'react-cookie';
import { message } from 'antd';

import { tokenKey, resourceMapping } from 'data/config';
import { makeFormData } from 'common/utils';

/*
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  console.log('Response.data', data);
  return response;
}, function (error) {
  // Do something with response error
  console.log('Response.error', error);
  if (error.status === 401) {
    cookie.remove(tokenKey);
  }
  return Promise.reject(error);
});
*/


/*
   axios#request(config)
   axios#get(url[, config])
   axios#delete(url[, config])
   axios#head(url[, config])

   axios#post(url[, data[, config]])
   axios#put(url[, data[, config]])
   axios#patch(url[, data[, config]])
 */

export function httpErrorCallback(resp) {
  console.error('axios Response:', resp);
  if (resp.data.message !== undefined) {
    message.error(`请求失败!: ${resp.data.message}`);
  } else {
    message.error('请求失败!');
  }
}

export function httpRequest(path, config) {
  if (config.headers === undefined) {
    config.headers = {};
  }
  config.headers['Content-Type'] = undefined;
  const token = cookie.load(tokenKey);
  if (token) {
    config.headers[tokenKey] = token;
  }
  config.url = globalConfig.apiUrl + path;
  return axios(config);
}
/* Without data */
export function httpGet(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'get';
  return httpRequest(path, config);
}
export function httpDelete(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'delete';
  return httpRequest(path, config);
}
export function httpHead(path, config) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'head';
  return httpRequest(path, config);
}
/* With data */
export function httpPost(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'post';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}
export function httpPut(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'put';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}
export function httpPatch(path, data, config, isRawData) {
  if (config === undefined) {
    config = {};
  }
  config.method = 'patch';
  config.data = isRawData ? JSON.stringify(data) : makeFormData(data);
  return httpRequest(path, config);
}


class Resource {
  constructor(path) {
    this.path = path;
  }

  create(obj, isRawData) {
    return httpPost(this.path, obj, {}, isRawData);
  }

  update(obj, isRawData) {
    return httpPut(this.path + obj.id, obj, {}, isRawData)
  }

  updateAll(ids, obj, isRawData) {
    return httpPut(this.path + ids.join(), obj, {}, isRawData)
  }

  delete(id) {
    return httpDelete(this.path + id);
  }

  deleteAll(ids) {
    return httpDelete(this.path + ids.join());
  }

  get(id) {
    return httpGet(this.path + id);
  }

  // var query = {
  //     type    : STRING,
  //     page    : NUMBER,
  //     perpage : NUMBER,
  //     filters : [[FIELD, OP, VALUE], [FIELD, OP, VALUE], ...],
  //     sort    : [[FIELD, ORDER], [FIELD, ORDER], ...]
  // };
  objects(query) {
    const q = query instanceof ApiQuery ? query.dict() : query;
    return httpGet(this.path, {
      params: { q: JSON.stringify(q) },
    });
  }

  all(query) {
    if (query === undefined) {
      query = {};
    }
    query.page = 1;
    query.perpage = -1;
    return this.objects(query);
  }
}


function initResources(mapping) {
  /* <globalConfig> defined in /static/config.js */
  let models = {}
  mapping.forEach(function(args) {
    const name = args[0];
    const path = args[1];
    console.log('Resource:', name, path);
    models[name] = new Resource(path);
  });
  return models;
}

export const Api = initResources(resourceMapping);

export class ApiQuery {
  constructor(page, perpage, filters, sort) {
    this.page = page === undefined ? 1 : page;
    this.perpage = perpage === undefined  ? 20 : perpage;
    this.filters = filters === undefined ? [] : filters;
    this.sort = sort === undefined ? [] : sort;
  }

  updateFilter(name, operation, value) {
    // console.log('updateFilter', name, operation, value);
    let newFilters = [];
    let matched = false;
    if ((operation == "ilike" || operation == "like")
        && (value !== undefined && value !== "")) {
      value = `%${value}%`;
    }

    this.filters.forEach(function(item) {
      if (item[0] === name && item[1] === operation) {
        matched = true;
        if (value !== undefined && value !== "") {
          newFilters.push([name, operation, value]);
        }
      } else {
        newFilters.push(item);
      }
    });

    if (!matched && value !== undefined && value !== "") {
      newFilters.push([name, operation, value]);
    }
    // console.log('newFilters:', newFilters);
    this.filters = newFilters;
  }

  updateSort(name, order) {
    let newSort = []
    let matched = false;
    this.sort.forEach(function(item) {
      if (item[0] === name) {
        matched = true;
        if (order !== undefined) {
          newSort.push([name, order]);
        }
      } else {
        newSort.push(item);
      }
    });
    if (!matched && order !== undefined) {
      newSort.push([name, order]);
    }
    this.sort = newSort;
  }

  dict() {
    return {
      type: this.type,
      page: this.page,
      perpage: this.perpage,
      filters: this.filters,
      sort: this.sort,
    };
  }
}
