import React from 'react';
import axios from 'axios';

class SubmitForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {url: ""};
  }

  handleSubmit(e){
    var _this = this;
    e.preventDefault();

    axios.post('http://localhost:3001/jobs', _this.state)
    .then(function (response) {
      _this.setState({url: ""});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleChange(e){
    const url = e.target.value;
    this.setState({url});
  }

  render(){
    return (
      <div>
        <p>Insert a URL (or multiple URLs separated by commas) to start a job.</p>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" value={this.state.url} onChange={this.handleChange.bind(this)} />
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default SubmitForm;
