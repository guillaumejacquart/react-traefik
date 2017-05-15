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
  var newProviders;
  switch (action.type) {
    case REQUEST_TRAEFIK_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_TRAEFIK_PROVIDERS:
      newProviders = filterProviders(action.data, state.search_query || '');
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
      newProviders = filterProviders(state.fetchedProviders, action.data);
      return Object.assign({}, state, {
        search_query: action.data,
        providers: newProviders
      })
    default:
      return state
  }
}

function filterProviders(oldProviders, query){
    if(!query.length){
      return oldProviders;
    }
    
    var newProviders = _.cloneDeep(oldProviders);
    var backendsFound = [];
    var frontendFounds = [];
    var serversFounds = [];
    
    for(var conf in oldProviders){        
      for(var b in oldProviders[conf].backends){
        if(b.includes(query)){
          backendsFound.push(b);
          serversFounds = serversFounds.concat(Object.keys(oldProviders[conf].backends[b].servers));
          continue;
        }
        
        for(var s in oldProviders[conf].backends[b].servers){
          if(oldProviders[conf].backends[b].servers[s].url.includes(query)){
            backendsFound.push(b);
            serversFounds.push(s);
            continue;
          }
        }
      }
      for(var f in oldProviders[conf].frontends){
        var fBackend = oldProviders[conf].frontends[f].backend;
        if(f.includes(query)){
          frontendFounds.push(f);
          backendsFound.push(fBackend);
          continue;
        }
        
        if(backendsFound.indexOf(fBackend) >= 0){
          frontendFounds.push(f);
          backendsFound.push(fBackend);
        }
        
        for(var r in oldProviders[conf].frontends[f].routes){
          if(oldProviders[conf].frontends[f].routes[r].rule.includes(query)){
            frontendFounds.push(f);
            backendsFound.push(fBackend);
            serversFounds = serversFounds.concat(Object.keys(oldProviders[conf].backends[fBackend].servers));
            continue;
          }
        }
      }
    }
    
    for(var conf in oldProviders){   
      for(var b in oldProviders[conf].backends){
        if(backendsFound.indexOf(b) < 0 ){
          delete newProviders[conf].backends[b];
          continue;
        }
        
        for(var s in oldProviders[conf].backends[b].servers){
          if(serversFounds.indexOf(s) < 0){
            delete newProviders[conf].backends[b].servers[s];
          }
        }
      }
      
      for(var f in oldProviders[conf].frontends){
        if(frontendFounds.indexOf(f) < 0 ){
          delete newProviders[conf].frontends[f];
        }
      }
      
      if(!Object.keys(newProviders[conf].backends).length){
        delete newProviders[conf];
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