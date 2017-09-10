import React from 'react';
import ReactDOM from 'react-dom';
import SubmitForm from './submit_form';
import JobList from './job_list';

function App() {
 return (
  <div>
   <SubmitForm />
   <JobList pollInterval={1000}/>
 </div>
 );
}


ReactDOM.render(<App />, document.getElementById('root'));
