import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProviders, fetchConfigReady, setUrl, search } from '../actions'
import UrlInput from '../components/UrlInput'
import Search from '../components/Search'
import ThreeJSFlow from '../components/ThreeJSFlow'

class AsyncApp extends Component {
  timer = null

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  loadData(dispatch, traefik_url) {
    dispatch(fetchProviders(traefik_url))
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchConfigReady())
  }

  componentDidUpdate(prevProps) {
    const { dispatch, traefik_url } = this.props
    if(!this.props.traefikData){
      return;
    }

    if (this.props.traefikData.traefik_url !== prevProps.traefikData.traefik_url) {
      if (this.props.traefikData.configReady) {
        if(!this.props.traefikData.providers){
          this.loadData(dispatch, this.props.traefikData.traefik_url);
        }
        this.timer = window.setInterval(() => this.loadData(dispatch, this.props.traefikData.traefik_url), 15000);
      } 
    }

    if(!this.props.traefikData.configReady && this.timer){
        window.clearTimeout(this.timer);
        delete this.timer;
    }
  }

  handleChange(next_traefik_url) {
    const { dispatch } = this.props
    dispatch(setUrl(next_traefik_url))
  }

  handleSearchChange(query) {
    const { dispatch } = this.props
    dispatch(search(query))
  }

  render() {
    const { traefik_url, traefikData, isFetching, lastUpdatedProviders } = this.props
    return (
    <div>
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="/">Traefik - diagram</a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="https://github.com/guillaumejacquart/react-traefik">Doc</a>
            </li>
          </ul>
          
          <UrlInput value={traefikData.traefik_url}  onClick={this.handleChange} />
        </div>
      </nav>
      <div className="container">
        {traefikData.providers &&
        <Search onChange={this.handleSearchChange} />
        }
        <p>
          {lastUpdatedProviders &&
            <span>
              Last updated at {new Date(lastUpdatedProviders).toLocaleTimeString()}.
              {' '}
            </span>
          }
        </p>
        {isFetching && !traefikData.providers &&
          <h2>Loading...</h2>
        }
        {!isFetching && !traefikData.traefik_url &&
          <h3 className="text-center">Fill out your traefik url in the navigation header</h3>
        }
      </div>
      <div>
        {traefikData.providers &&
          <ThreeJSFlow data={traefikData} />
        }
      </div>
    </div>
    )
  }
}

AsyncApp.propTypes = {
  traefikData: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdatedProviders: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { traefik_url, traefikData } = state
  const {
    isFetching,
    lastUpdatedProviders
  } = {
      isFetching: false
    }

  return {
    traefik_url,
    isFetching,
    lastUpdatedProviders,
    traefikData
  }
}

export default connect(mapStateToProps)(AsyncApp)