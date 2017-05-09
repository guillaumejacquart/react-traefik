import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProviders, fetchBackends, fetchFrontends } from '../actions'
import UrlInput from '../components/UrlInput'
import Flow from '../components/Flow'
import SvgFlow from '../components/SvgFlow'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  loadData(dispatch, traefik_url) {
    dispatch(fetchProviders(traefik_url))
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.traefik_url !== prevProps.traefik_url) {
      const { dispatch, traefik_url } = this.props
      this.loadData(dispatch, traefik_url);
    }
  }

  handleChange(next_traefik_url) {
    const { dispatch } = this.props
    this.loadData(dispatch, next_traefik_url)
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, traefik_url } = this.props
    this.loadData(dispatch, traefik_url)
  }

  render() {
    const { traefik_url, traefikData, isFetching, lastUpdatedProviders } = this.props
    return (
      <div>
        <UrlInput value={traefik_url}
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
        {traefikData.providers &&
          <Flow data={traefikData} />
        }
        {traefikData.providers &&
          <SvgFlow data={traefikData} />
        }
      </div>
    )
  }
}

AsyncApp.propTypes = {
  traefik_url: PropTypes.string,
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