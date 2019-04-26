import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Post from '../../components/index/Post'

class ProfileTabs extends React.Component {
  state = {
    tab: 0
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
  }

  render() {
    const { tab } = this.state
    const { posts, user, auth } = this.props

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
          >
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            {posts.map(post => (
              <Post key={post._id} post={post} auth={auth} />
            ))}
          </TabContainer>
        )}
      </div>
    )
  }
}

const TabContainer = ({ children }) => (
  <Typography component="div" style={{ padding: "1em" }}>
    { children }
  </Typography>
)

export default ProfileTabs
