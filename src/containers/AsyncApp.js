import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProviders, fetchConfigReady, setUrl } from '../actions'
import UrlInput from '../components/UrlInput'
import Flow from '../components/Flow'
import SvgFlow from '../components/SvgFlow'
import GoFlow from '../components/GoFlow'
import ThreeJSFlow from '../components/ThreeJSFlow'
import DagreFlow from '../components/DagreFlow'

class AsyncApp extends Component {
  timer = null

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
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
        this.timer = window.setInterval(() => this.loadData(dispatch, this.props.traefikData.traefik_url), 5000);
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

  render() {
    const { traefik_url, traefikData, isFetching, lastUpdatedProviders } = this.props
    return (
      <div>
        <UrlInput value={traefikData.traefik_url}
          onClick={this.handleChange} />
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
        {/*{traefikData.providers &&
          <Flow data={traefikData} />
        }*/}
        {/*{traefikData.providers &&
          <GoFlow data={traefikData} />
        }*/}
        {/*traefikData.providers &&
          <SvgFlow data={traefikData} />
        */}
        {/*{traefikData.providers &&
          <ThreeJSFlow data={traefikData} />
        }*/}
        {traefikData.providers &&
          <DagreFlow data={traefikData} />
        }
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
      isFetching: true
    }

  return {
    traefik_url,
    isFetching,
    lastUpdatedProviders,
    traefikData
  }
}

export default connect(mapStateToProps)(AsyncApp)