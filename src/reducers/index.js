import { combineReducers } from 'redux'
import * as _ from 'lodash';
import {
  REQUEST_TRAEFIK_PROVIDERS, RECEIVE_TRAEFIK_PROVIDERS,
  REQUEST_CONFIG, RECEIVE_CONFIG, SET_URL, SEARCH
} from '../actions'

function data(state = {
  isFetching: false,
  providers: [],
  fetchedProviders: []
}, action) {
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_TRAEFIK_PROVIDERS:
      var newProviders = filterProviders(action.data, state.search_query || '');
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        providers: newProviders,
        fetchedProviders: action.data,
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
    case SEARCH:
      var newProviders = filterProviders(state.fetchedProviders, action.data);
      return Object.assign({}, state, {
        search_query: action.data,
        providers: newProviders
      })
    default:
      return state
  }
}

function filterProviders(oldProviders, query){
  console.log(query);
    var newProviders = _.cloneDeep(oldProviders);
    for(var conf in oldProviders){        
      for(var b in oldProviders[conf].backends){
        if(!b.includes(query)){
          delete newProviders[conf].backends[b];
        }
      } 
      for(var f in oldProviders[conf].frontends){
        if(!oldProviders[conf].frontends[f].backend.includes(query)){
          delete newProviders[conf].frontends[f];
        }
      }
    }
    return newProviders;
}

function traefikData(state = { }, action) {
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
    case RECEIVE_TRAEFIK_PROVIDERS:
    case REQUEST_CONFIG:
    case RECEIVE_CONFIG:
    case SET_URL:
    case SEARCH:
      return Object.assign({}, state, data(state, action))
    default:
      return state
  }
}

const rootReducer = combineReducers({
  traefikData
})

export default rootReducer