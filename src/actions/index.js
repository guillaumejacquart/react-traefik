import fetch from 'isomorphic-fetch'

export const REQUEST_TRAEFIK_PROVIDERS = 'REQUEST_TRAEFIK_PROVIDERS'
export const RECEIVE_TRAEFIK_PROVIDERS = 'RECEIVE_TRAEFIK_PROVIDERS'
export const REQUEST_TRAEFIK_BACKENDS = 'REQUEST_TRAEFIK_BACKENDS'
export const RECEIVE_TRAEFIK_BACKENDS = 'RECEIVE_TRAEFIK_BACKENDS'
export const REQUEST_TRAEFIK_FRONTENDS = 'REQUEST_TRAEFIK_FRONTENDS'
export const RECEIVE_TRAEFIK_FRONTENDS = 'RECEIVE_TRAEFIK_FRONTENDS'
export const INVALIDATE_DATA = 'INVALIDATE_DATA'

export function invalidateData() {
  return {
    type: INVALIDATE_DATA
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

function requestTraefikBackends(provider_id) {
  return {
    type: REQUEST_TRAEFIK_BACKENDS,
	provider_id
  }
}

function receiveTraefikBackends(provider_id, json) {
  return {
    type: RECEIVE_TRAEFIK_BACKENDS,
	provider_id,
    data: json.data,
    receivedAt: Date.now()
  }
}

function requestTraefikFrontends(provider_id) {
  return {
    type: REQUEST_TRAEFIK_FRONTENDS,
	provider_id
  }
}

function receiveTraefikFrontends(provider_id, json) {
  return {
    type: RECEIVE_TRAEFIK_FRONTENDS,
	provider_id,
    data: json.data,
    receivedAt: Date.now()
  }
}

export function fetchProviders(traefik_url) {
  return dispatch => {
    dispatch(requestTraefikProviders())
    return fetch(`${traefik_url}/api/providers`)
      .then(response => response.json())
      .then(json => dispatch(receiveTraefikProviders(json)))
  }
}

export function fetchBackends(traefik_url, provider_id) {
  return dispatch => {
    dispatch(requestTraefikBackends(provider_id))
    return fetch(`${traefik_url}/api/providers/${provider_id}/backends`)
      .then(response => response.json())
      .then(json => dispatch(receiveTraefikBackends(provider_id, json)))
  }
}

export function fetchFrontends(traefik_url, provider_id) {
  return dispatch => {
    dispatch(requestTraefikFrontends(provider_id))
    return fetch(`${traefik_url}/api/providers/${provider_id}/frontends`)
      .then(response => response.json())
      .then(json => dispatch(receiveTraefikFrontends(provider_id, json)))
  }
}