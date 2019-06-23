import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import url from '../Constants.js';
import { Button, Grid, Typography, Card, Table, TableBody, 
  TableCell, TableRow, CircularProgress, AppBar, Toolbar } from '@material-ui/core';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: 'loading',
      jobs: [],
      applied: [],
    }
  };

  onLogout = () => {
    this.setState({route: 'signin'});
    sessionStorage.removeItem('token');
  }

  componentDidMount = () => {
    fetch(url+'/home', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token') 
      }
    })
    .then(res => res.json())
    .then(data => {
      if(data === false){
        this.setState({route: 'signin'});
      }
      else{
        this.setState({jobs: data[0],applied: data[1], route: "home"})
      }
    })
  }

  onApply = (id) => {
    fetch(url+'/apply', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        token: sessionStorage.getItem('token'),
        id: id
      })
    })
    .then(res => console.log(res))
  }

  render() {
    if(this.state.route === 'loading'){
      return(
        <Grid container justify="center" alignItems="center" style={{marginTop: "300px"}}>
          <CircularProgress style={{color: "#ffffff"}}/>
        </Grid>
      );     
    }
    else if(this.state.route === 'home'){
      return(
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button onClick={this.onLogout} variant="contained" color="#ffffff">
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{marginTop: '50px'}}>
            <Grid container justify="center" alignItems="center">
              <Grid container direction="column" justify="center" alignItems="center">
                <Typography variant="display2">
                  JOB LIST
                </Typography>
                <Table style={{margin: '30px'}}>
                  <TableBody>
                    {this.state.jobs.map( job => {
                      return(
                        <TableRow> 
                          <TableCell align="center">ID: {job.job_id}</TableCell>
                          <TableCell align="center">{job.name}</TableCell>
                          <TableCell align="center">
                            <Button variant="contained" color="secondary" onClick={() => this.onApply(job.job_id)}>
                              apply
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </div>  
        </div>
      );
    }
    else if(this.state.route === 'signin'){
      return(
        <Redirect to="/"/>
      );
    }
  }
}

export default Home;
