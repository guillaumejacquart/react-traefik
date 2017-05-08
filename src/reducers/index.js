import { combineReducers } from 'redux'
import {
  REQUEST_TRAEFIK_PROVIDERS, RECEIVE_TRAEFIK_PROVIDERS,
  REQUEST_TRAEFIK_BACKENDS, RECEIVE_TRAEFIK_BACKENDS,
  REQUEST_TRAEFIK_FRONTENDS, RECEIVE_TRAEFIK_FRONTENDS
} from '../actions'

function data(state = {
  isFetching: false,
  providers: [],
  backends: [],
  frontends: []
}, action) {
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_TRAEFIK_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        providers: action.data,
        lastUpdatedProviders: action.receivedAt
      })
    case REQUEST_TRAEFIK_BACKENDS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_TRAEFIK_BACKENDS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        backends: action.data,
        lastUpdatedBackendss: action.receivedAt
      })
    case REQUEST_TRAEFIK_FRONTENDS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_TRAEFIK_FRONTENDS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        frontends: action.data,
        lastUpdatedFrontends: action.receivedAt
      })
    default:
      return state
  }
}

function traefikData(state = { }, action) {
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
    case RECEIVE_TRAEFIK_PROVIDERS:
    case REQUEST_TRAEFIK_BACKENDS:
    case RECEIVE_TRAEFIK_BACKENDS:
    case REQUEST_TRAEFIK_FRONTENDS:
    case RECEIVE_TRAEFIK_FRONTENDS:
      return Object.assign({}, state, data(state, action))
    default:
      return state
  }
}

const rootReducer = combineReducers({
  traefikData
})

export default rootReducer