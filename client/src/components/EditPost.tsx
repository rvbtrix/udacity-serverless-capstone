import * as React from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchPost } from '../api/posts-api'
import { UpdatePostRequest } from '../types/UpdatePostRequest'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditPostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}

interface EditPostState {
  file: any
  uploadState: UploadState,
  description: string
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    description: ''
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      const editPost: UpdatePostRequest = {
        description: this.state.description,
      }

      await patchPost(this.props.auth.getIdToken(), this.props.match.params.postId, editPost)

      alert('Post Updated!')
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
    }
  }


  render() {
    return (
      <div>
        <h1>Edit Description</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
          <Input
              fluid
              actionPosition="left"
              placeholder="Description"
              onChange={this.handleDescriptionChange}
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
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Save
        </Button>
      </div>
    )
  }
}
