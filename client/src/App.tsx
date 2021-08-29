import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { History } from 'history'


import Auth from './auth/Auth'
import { AddPost } from './components/AddPost'
import { EditPost } from './components/EditPost'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Posts } from './components/Posts'
import { UserProfile } from './components/UserProfile'

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: History
}

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }


  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {this.logInLogOutButton()}
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Menu position="right">
          <Menu.Item>
          <Link  to="/users">
            Profile
          </Link>
          </Menu.Item>
          <Menu.Item name="logout" onClick={this.handleLogout}>
            Log Out
          </Menu.Item>
        </Menu.Menu>
      )
    } else {
      return (
        <Menu.Menu position="right">
          <Menu.Item name="login" onClick={this.handleLogin}>
            Log In
          </Menu.Item>
        </Menu.Menu>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Posts {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/users"
          exact
          render={props => {
            return <UserProfile {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/posts/:postId/edit"
          exact
          render={props => {
            return <EditPost {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/posts/add"
          exact
          render={props => {
            return <AddPost {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
