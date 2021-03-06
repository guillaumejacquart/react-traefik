import fetch from 'isomorphic-fetch'
import { API_URL } from '../Conf'

export const REQUEST_CONFIG = 'REQUEST_CONFIG'
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG'
export const SET_URL = 'SET_URL'
export const REQUEST_TRAEFIK_PROVIDERS = 'REQUEST_TRAEFIK_PROVIDERS'
export const RECEIVE_TRAEFIK_PROVIDERS = 'RECEIVE_TRAEFIK_PROVIDERS'
export const INVALIDATE_DATA = 'INVALIDATE_DATA'
export const SEARCH = 'SEARCH'

export function invalidateData() {
  return {
    type: INVALIDATE_DATA
  }
}

function requestConfig() {
  return {
    type: REQUEST_CONFIG
  }
}

function receiveConfig(json) {
  return {
    type: RECEIVE_CONFIG,
    data: json
  }
}

function requestTraefikProviders() {
  return {
    type: REQUEST_TRAEFIK_PROVIDERS
  }
}

function receiveTraefikProviders(json) {
  return {
    type: RECEIVE_TRAEFIK_PROVIDERS,
    data: json,
    receivedAt: Date.now()
  }
}

export function setUrl(url) {
  return dispatch => {
    return dispatch({
      type: SET_URL,
      data: url
    })
  }
}

export function search(query) {
  return dispatch => {
    return dispatch({
      type: SEARCH,
      data: query
    })
  }
}

export function fetchConfigReady() {
  return dispatch => {
    dispatch(requestConfig())
    return fetch(`${API_URL}/api/url`)
      .then(response => response.json())
      .then((json) => {
        if (json.status === 'ok') {
          return dispatch(receiveConfig({
            configReady: true,
            traefik_url: json.url
          }));
        }
        return dispatch(receiveConfig({
          configReady: false,
          error: json
        }));
      })
      .catch(function (error) {
        dispatch(receiveConfig({
          configReady: false,
          error: error
        }))
      });
  }
}

export function fetchProviders(traefik_url) {
  return dispatch => {
    dispatch(requestTraefikProviders())
    return fetch(`${API_URL}/api/url`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: traefik_url
      })
    })
      .then(response => response.json())
      .then((json) => {
        if (json.status === 'ok') {
          return fetchProvidersData(dispatch);
        }
        throw new Error(json)
      })
      .catch(function (error) {
        dispatch(receiveConfig({
          configReady: false,
          error: error
        }))
      });
  }
}

function fetchProvidersData(dispatch) {
  return fetch(`${API_URL}/api/providers`)
    .then(response => response.json())
    .catch(function (error) {
      dispatch(receiveConfig({
        configReady: false
      }))
    })
    .then(json => {
      if(json.errno){
        return dispatch(receiveConfig({
          configReady: false,
          error: json
        }))
      }
      return dispatch(receiveTraefikProviders(json))
    })
}
