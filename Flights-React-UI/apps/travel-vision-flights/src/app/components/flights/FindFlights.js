import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import FlightCards from './FlightCards';

export default class FindFlight extends Component {
  constructor(props) {
    super(props);

    this.getFormattedDate = (date) => {
      const year = date.getFullYear();

      let month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;

      let day = (1 + date.getDate()).toString();
      day = day.length > 1 ? day : '0' + day;

      return year + '-' + month + '-' + day;
    };

    this.getFlightInfo = (event) => {
      event.preventDefault();
      this.findAirport(this.state.fromcity, 'fromairport', this);
      this.findAirport(this.state.tocity, 'toairport', this);
    };

    this.findAirport = (city, key) => {
      fetch(
        'https://skyscanner-skyscanner-flight-search-v1.p.mashape.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=' +
          city,
        {
          method: 'GET',
          headers: {
            'X-Mashape-Key': process.env.REACT_APP_MASHAPE_API_KEY,
            'X-Mashape-Host':
              'skyscanner-skyscanner-flight-search-v1.p.mashape.com',
          },
        }
      )
        .then(
          (response) => {
            return response.json();
          },
          (error) => {}
        )
        .then((jsonData) => {
          this.setState({ [key]: jsonData.Places[0].PlaceId });
          console.log(this.state);
          if (
            this.state.toairport.length > 0 &&
            this.state.fromairport.length > 0
          ) {
            this.findFlight();
          }
        });
    };

    this.findFlight = () => {
      let datefrom;
      let dateto;
      if (this.state.fromdate === '') datefrom = 'anytime';
      else {
        let df = new Date(this.state.fromdate);
        datefrom = this.getFormattedDate(df);
      }
      if (this.state.todate === '') dateto = 'anytime';
      else {
        let dt = new Date(this.state.todate);
        dateto = this.getFormattedDate(dt);
      }
      console.log('Date From: ' + datefrom);
      console.log('Date To: ' + dateto);

      fetch(
        'https://skyscanner-skyscanner-flight-search-v1.p.mashape.com/apiservices/browsedates/v1.0/US/USD/en-US/' +
          this.state.fromairport +
          '/' +
          this.state.toairport +
          '/' +
          datefrom +
          '/' +
          dateto,
        {
          method: 'GET',
          headers: {
            'X-Mashape-Key': process.env.REACT_APP_MASHAPE_API_KEY,
            'X-Mashape-Host':
              'skyscanner-skyscanner-flight-search-v1.p.mashape.com',
          },
        }
      )
        .then(
          (response) => {
            return response.json();
          },
          (error) => {}
        )
        .then((jsonData) => {
          console.log(jsonData);
          if (jsonData.ValidationErrors != null) this.setState({ flights: [] });
          else this.setState({ flights: jsonData.Quotes });
        });
    };

    this.handleOnchange = (event) => {
      this.setState({ [event.target.id]: event.target.value });
    };

    this.state = {
      fromcity: '',
      tocity: '',
      fromdate: '',
      todate: '',
      fromairport: '',
      toairport: '',
      flights: [],
    };
  }
  render() {
    return (
      <div className="container">
        <Form>
          <FormGroup>
            <Label for="fromcity">From City</Label>
            <Input
              type="text"
              name="fromcity"
              id="fromcity"
              placeholder="City Flying From"
              onChange={this.handleOnchange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="tocity">To City</Label>
            <Input
              type="text"
              name="tocity"
              id="tocity"
              placeholder="City Flying To"
              onChange={this.handleOnchange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="fromdate">From Date (Leave Blank for Anytime)</Label>
            <Input
              type="date"
              name="fromdate"
              id="fromdate"
              onChange={this.handleOnchange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="todate">To Date (Leave Blank for Anytime)</Label>
            <Input
              type="date"
              name="todate"
              id="todate"
              onChange={this.handleOnchange}
            />
          </FormGroup>
          <Button onClick={this.getFlightInfo}>Check Availability</Button>
        </Form>
        <br />
        {this.state.flights.length > 1 ? (
          <FlightCards concstate={this.state} />
        ) : null}
      </div>
    );
  }
}
