import * as React from 'react'
import { History } from 'history'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { addPost, uploadFile } from '../api/posts-api'
import { CreatePostRequest } from '../types/CreatePostRequest'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface AddPostProps {

  auth: Auth
  history: History
}

interface AddPostState {
  file: any
  uploadState: UploadState,
  description: string
}

export class AddPost extends React.PureComponent<
  AddPostProps,
  AddPostState
> {
  state: AddPostState = {
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
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const newPost: CreatePostRequest = {
        description: this.state.description,
      }
      this.setState({
        description: ''
      })
      const uploadUrl = await addPost(this.props.auth.getIdToken(), newPost)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('Post Created!')

      //this.props.history.push('/');
      
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>New Post</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Input
              fluid
              actionPosition="left"
              placeholder="Description"
              onChange={this.handleDescriptionChange}
            />
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
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
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Post</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Post</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Post
        </Button>
      </div>
    )
  }
}
