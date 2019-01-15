import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Container, Table } from 'reactstrap';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            locData: [],
            climateData: []
        };
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.value,'Searched value');
        let locationAPI = `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${this.state.value}`;
        axios.get(locationAPI).then(res=> {
            console.log(res.data);
            this.setState({locData: res.data[0].woeid}, () => this.api());
            console.log(this.state.locData, 'response')
        }).catch(function (error) {
            console.log(error);
        })
    }

    api = () => {
        console.log('api clicked')
        let climateAPI = `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${this.state.locData}`;
        console.log(climateAPI, 'API')
        axios.get(climateAPI).then(res=> {
            console.log(res.data);
            this.setState({climateData: res.data.consolidated_weather})
            console.log(this.state.climateData, 'retreived data')
        });
    }

    showSearchResults = () => {
        if( this.state.value !== '' && this.state.locData.length !== 0) {
            return (
                <Container>
                    <hr/>
                    <h1>Temperature details of {this.state.value}</h1>
                    <hr/>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Min Temp</th>
                                    <th>Max Temp</th>
                                    <th>Avg Temp</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.climateData.map(function(data, key) {
                                return (
                                    <tr key = {key}>
                                        <th>{data.applicable_date}</th>
                                        <th>{data.min_temp}</th>
                                        <th>{data.max_temp}</th>
                                        <th>{data.the_temp}</th>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                </Container>
            );
        }
    }
    render() {
        return (
            <div className="container">
                <div className="App-header">Climate Changes</div>
                <div>
                    <div>
                        <form className="search-form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>Search for City</label>
                                <div>
                                    <input className="search-text-box" type="text" name="name" onChange={this.handleChange} />
                                    <button className="btn btn-secondary btn-sm" type="submit">Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {this.showSearchResults()}
                </div>
            </div>
        );
    }
}

export default App;