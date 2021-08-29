import * as React from 'react'
import { History } from 'history'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { UserProfileRequest } from '../types/UserProfileRequest'
import { getUser, saveUserProfile } from '../api/user-api'
import * as EmailValidator from 'email-validator';

interface UserProfileProps {
  auth: Auth
  history: History
}

interface UserProfileState {
  name: string,
  lastName: string,
  email: string
}

export class UserProfile extends React.PureComponent<
  UserProfileProps,
  UserProfileState
> {
  state: UserProfileState = {
    name: '',
    lastName: '',
    email: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }
  handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: event.target.value })
  }
  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {

      if (!EmailValidator.validate(this.state.email)) {
        alert('Invalid Email!')
      } else {
        const profile: UserProfileRequest = {
          name: this.state.name,
          lastName: this.state.lastName,
          email: this.state.email
        }

        await saveUserProfile(this.props.auth.getIdToken(), profile)

        alert('Profile Updated!')
      }

    } catch (e) {
      alert('Error: ' + e.message)
    } finally {

    }
  }

  async componentDidMount() {
      const user = await getUser(this.props.auth.getIdToken())
      if(user) {
        this.setState({
          name: user.name,
          lastName: user.lastName,
          email: user.email
        })
      }
   
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Input
              fluid
              actionPosition="left"
              placeholder="Name"
              defaultValue={this.state.name || ''}
              onChange={this.handleNameChange}
            />
            <Input
              fluid
              actionPosition="left"
              placeholder="Last Name"
              defaultValue={this.state.lastName || ''}
              onChange={this.handleLastNameChange}
            />
            <Input
              fluid
              actionPosition="left"
              placeholder="Name"
              defaultValue={this.state.email || ''}
              onChange={this.handleEmailChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Save
        </Button>
      </div>
    )
  }
}
