import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { addPost, getPostFeed } from '../../lib/api'

import NewPost from './NewPost'
import Post from './Post'

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: '',
    image: '',
    isAddingPost: false
  }

  componentDidMount() {
    this.postData = new FormData()
    this.getPosts()
  }

  getPosts = () => {
    const { auth } = this.props
    getPostFeed(auth.user._id).then(posts => this.setState({ posts }))
  }

  handleChange = ({ target }) => {
    let inputValue

    if (target.name === 'image') {
      inputValue = target.files[0]
    } else {
      inputValue = target.value
    }
    this.postData.set(target.name, inputValue)
    this.setState({ [target.name]: inputValue })
  }

  handleAddPost = () => {
    const { auth } = this.props

    this.setState({ isAddingPost: true })
    addPost(auth.user._id, this.postData)
      .then(postData => {
        const updatePosts = [postData, ...this.state.posts]
        this.setState({
          posts: updatePosts,
          isAddingPost: false,
          text: '',
          image: ''
        })
        this.postData.delete('image')
      })
      .catch(err => {
        console.error(err)
        this.setState({ isAddingPost: false })
      })
  }

  render() {
    const { classes, auth } = this.props
    const { posts, text, image, isAddingPost } = this.state

    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h1" align="center" color="primary" className={classes.title}>
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          isAddingPost={isAddingPost}
          handleChange={this.handleChange}
          handleAddPost={this.handleAddPost}
        />
        {posts.map(post => (
          <Post
            key={post._id}
            auth={auth}
            post={post}
          />
        ))}
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
})

export default withStyles(styles)(PostFeed)
