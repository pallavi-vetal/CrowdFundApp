import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import './App.css';
import { Campaign } from './components/Campaign';
import { Home } from './components/Home';
import { NotFound } from './components/NotFound';
import history from './history';
import CreateCampaign from './components/CreateCampaign';



class App extends Component {

  render() {
    return (
      <Router history={history}>
        <Container>

          <Menu secondary>
            <Menu.Item
              name='home'
              onClick={this.navigateToHome}
            />
             <Menu.Item
            name='Create Campaign'
            onClick={this.onSubmitCampaign}
            primary
          />
          </Menu>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/createCampaign' component={CreateCampaign} />
            <Route path='/campaigns/:address' component={Campaign} />
            <Route component={NotFound} />
          </Switch>

        </Container>
      </Router>
    );
  }
   onSubmitCampaign(event){
    event.preventDefault();
    history.push(`/createCampaign`)
  
   }

  navigateToHome(e){
    e.preventDefault();
    history.push('/');
  }
}

export default App;
