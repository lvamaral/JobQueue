import React from 'react';

class SubmitForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleSubmit(e){
    e.preventDefault();
    console.log("nice");
  }


  render(){
    return (
      <div>
        <p>Insert a URL (or multiple URLs separated by commas) to start a job.</p>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input value=""/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default SubmitForm;
