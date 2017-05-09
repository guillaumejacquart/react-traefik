import fetch from 'isomorphic-fetch'
import { API_URL } from '../conf'

export const REQUEST_TRAEFIK_PROVIDERS = 'REQUEST_TRAEFIK_PROVIDERS'
export const RECEIVE_TRAEFIK_PROVIDERS = 'RECEIVE_TRAEFIK_PROVIDERS'
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

export function fetchProviders(traefik_url) {
  return dispatch => {
    dispatch(requestTraefikProviders())
    return fetch(`${API_URL}/api/url`, {
        method: 'put',
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
      });
  }
}

function fetchProvidersData(dispatch) {
  return fetch(`${API_URL}/api/providers`)
    .then(response => response.json())
    .then(json => dispatch(receiveTraefikProviders(json)))
}
