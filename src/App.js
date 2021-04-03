import {AppBar, Grid, Toolbar, Typography} from '@material-ui/core';

import './App.css';
import Search from './components/Search';

function App() {
  return (
      <>
          <AppBar>
              <Toolbar>
                  <Typography variant="h6" className="TitleBar" >Shorten Any URL</Typography>
              </Toolbar>
          </AppBar>
          <Grid className="App" container direction='column' justify='center' alignItems='center'>
              <Search/>
          </Grid>
      </>

  );
}

export default App;
