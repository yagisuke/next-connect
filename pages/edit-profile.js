import Avatar from '@material-ui/core/Avatar'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Snackbar from '@material-ui/core/Snackbar'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import VerifiedUserTwoTone from '@material-ui/icons/VerifiedUserTwoTone'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CloudUpload from '@material-ui/icons/CloudUpload'
import FaceTwoTone from '@material-ui/icons/FaceTwoTone'
import EditSharp from '@material-ui/icons/EditSharp'
import withStyles from '@material-ui/core/styles/withStyles'
import Router from 'next/router'

import { authInitialProps } from '../lib/auth'
import { getAuthUser, updateUser } from '../lib/api'

class EditProfile extends React.Component {
  state = {
    _id: '',
    name: '',
    email: '',
    about: '',
    avatar: '',
    avatarPreview: '',
    openSuccess: false,
    openError: false,
    error: '',
    updatedUser: null,
    isSaving: false,
    isLoading: true
  }

  componentDidMount() {
    const { auth } = this.props

    this.userData = new FormData()
    getAuthUser(auth.user._id)
      .then(user => {
        this.setState({
          ...user,
          isLoading: false
        })
      }).catch(err => {
        this.setState({ isLoading: false })
      })
  }

  handleChange = ({ target }) => {
    let inputValue

    if (target.name === 'avatar') {
      inputValue = target.files[0]
      this.setState({ avatarPreview: URL.createObjectURL(inputValue) })
    } else {
      inputValue = target.value
    }
    this.userData.set(target.name, inputValue)
    this.setState({ [target.name]: inputValue })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({ isSaving: true })
    updateUser(this.state._id, this.userData)
      .then(updatedUser => {
        this.setState({ updatedUser, openSuccess: true })
        setTimeout(() => Router.push(`/profile/${this.state._id}`), 6000)
      })
      .catch(this.showError)
  }

  handleClose = () => this.setState({ openError: false })

  showError = err => {
    const error = (err.response && err.response.data) || err.message
    this.setState({ error, openError: true, isSaving: false })
  }

  render() {
    const { classes } = this.props
    const {
      name, email, about, avatar, avatarPreview,
      isLoading, isSaving, updatedUser, openSuccess,
      openError, error
    } = this.state

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant="h5" component="h1">
            Edit Profile
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar src={avatarPreview || avatar} className={classes.bigAvatar} />
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={this.handleChange}
              className={classes.input}
            />
            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image
                <CloudUpload />
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About</InputLabel>
              <Input
                type="text"
                name="about"
                value={about}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Button
                type="submit"
                fullWidth
                disabled={isSaving || isLoading}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </FormControl>
          </form>
        </Paper>
        
        {error && <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={openError}
          onClose={this.handleClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{error}</span>}
        />}
        <Dialog
          open={openSuccess}
          disableBackdropClick={true}
        >
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            Profile Updated
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updatedUser.name} was successfully updated!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up('md')]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.25em'
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: 'none',
    color: 'white'
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.secondary.light
  },
  icon: {
    padding: '0px 2px 2px 0px',
    verticalAlign: 'middle',
    color: 'green'
  },
  input: {
    display: 'none'
  }
})

EditProfile.getInitialProps = authInitialProps(true)

export default withStyles(styles)(EditProfile)
