import { combineReducers } from 'redux'
import {
  REQUEST_TRAEFIK_PROVIDERS, RECEIVE_TRAEFIK_PROVIDERS,
  REQUEST_CONFIG, RECEIVE_CONFIG, SET_URL
} from '../actions'

function data(state = {
  isFetching: false,
  providers: [],
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
    case REQUEST_CONFIG:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_CONFIG:
      return Object.assign({}, state, {
        configReady: action.data,
        traefik_url: action.data.url
      })
    case SET_URL:
      return Object.assign({}, state, {
        traefik_url: action.data,
        configReady: {
          url: action.data
        }
      })
    default:
      return state
  }
}

function traefikData(state = { }, action) {
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
    case RECEIVE_TRAEFIK_PROVIDERS:
    case REQUEST_CONFIG:
    case RECEIVE_CONFIG:
    case SET_URL:
      return Object.assign({}, state, data(state, action))
    default:
      return state
  }
}

const rootReducer = combineReducers({
  traefikData
})

export default rootReducer