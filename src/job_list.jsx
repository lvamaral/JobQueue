import React from 'react';
import axios from 'axios';

class JobList extends React.Component {
  constructor(props){
    super(props);
    this.loadJobsFromServer = this.loadJobsFromServer.bind(this);
    this.state = {data: [], result: ""};
  }

  componentDidMount() {
   this.loadJobsFromServer();
   setInterval(this.loadJobsFromServer, this.props.pollInterval);
 }

  loadJobsFromServer(){
    axios.get('http://localhost:3001/jobs')
    .then(res => {
     var sorted = res.data.reverse();
     this.setState({ data: sorted });
    }).catch(err => console.log("Couldnt connect to server."));
  }

   buildJobList(){
     if (this.state.data) {
       var jobList = this.state.data;
       return jobList.map((job) => (
         <div className="job-item" key={job.qid} onClick={ ()=> this.getResults(job.qid)}>
           <div className="job-id">
             <p>{job.qid}</p>
           </div>
           <div className="job-url">
             <p>{job.url}</p>
           </div>
           <div className="job-status">
             {this.colorStatus(job.status)}
           </div>
         </div>
       ));
     }
    }

   colorStatus(status){
     if (status === "completed") {
       return (<p className="green">{status}</p>);
     } else if (status === "failed"){
       return(<p className="red">{status}</p>);
     } else {
       return(<p>{status}</p>);
     }
   }

   getResults(id){
     axios.get(`http://localhost:3001/jobs/${id}`)
     .then(res => {
       var qid = res.data[0].qid;
       var status = res.data[0].status;
       var created = res.data[0].createdAt;
       var url = res.data[0].url;
       var result = (status === "completed" ? res.data[0].result : res.data[0].message);
       this.setState({result: {id: qid, status: status, created: created, url: url, result: result}});
     }).catch(err => console.log("Couldnt connect to server."));
   }

   displayResults(){
     var data = this.state.result;
     if (data !== "") {
       return (
         <div>
           <p>ID: {data.id}</p>
           <p>URL: {data.url}</p>
           <p>Created At: {data.created}</p>
           <p>Result:</p>
           <p>{data.result}</p>
         </div>
       );
     }
   }

  render(){
    var jobList = <div></div>
    var result = <div></div>
    jobList = this.buildJobList();
    result = this.displayResults();
    return(
      <div className="dashboard">
        <div className="job-list">
          <h2>Job List</h2>
            <div className="job-item-header">
              <div className="job-id">
                <p>id</p>
              </div>
              <div className="job-url">
                <p>url</p>
              </div>
              <div className="job-status">
                <p>status</p>
              </div>
            </div>
          {jobList}
        </div>
        <div className="job-display">
          <h2>Job Display</h2>
          <div className="display-header">
            <p className="muted">Click on a job to see it's results.</p>
          </div>
          {result}
        </div>
    </div>
    );
  }
}

export default JobList;
