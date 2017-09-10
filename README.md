# Job Queue Challenge

Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

Example:

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Overview

My solution to this challenge was to build a frontend where the user can start one or multiple jobs at a time, and see their processing and results in real time. My server side job queue runs in a FIFO order, though completion of jobs do not necessarily follow order of processing. Clicking on a job will send a GET request to the server, and then display the results in the realtime frontend dashboard.

## Technologies

The frontend was build with React. The backend is a Node/Express server, using Kue.js to handle queue processing. Kue is backed by Redis to handle the queue. The MongoDB database is hosted online at mLab for easier setup.

The Axios library was used for GET/POST requests, and foremon and nodemon for easier refreshing of the React client and the server.

## Setup

Testing the application should be straightforward. Download the git, install any needed dependencies, then run:

`npm run start-dev`

## Process

I began by setting up the server, DB, and frontend. I used React's 'create react app' for an easier bootstrapped setup for the frontend, and chose to use an online hosted DB to reduce the number of things running in the localhost background. Foreman was very helpful in keeping all the parts refreshed and in sync as I made changes to my local files.

Next up was figuring out the queue part. I was originally planning on using Firebase's database + the Firebase-Queue for this part of the challenge, but I found the Firebase-Queue API a bit too convoluted. I hadn't used Kue before, but from my research it seemed like it would get the job done more efficiently.

Having figured out my way around Kue, I came up with an outline on how the Job Queue API would work, and how all the pieces would tie together. A user submits a url in the frontend, which sends a POST request to the server with the url. This post request creates a new job at Kue's job queue.

Processing the queue involves two parts. First, the job (which at this point is just a URL) is saved into the database with the status of 'pending'. Then the job runs a function which attempts to GET it's associated URL. If the results comes back with a 200 status code (is successful), the job is updated on the database with the fetched HTML, and the status is changed to 'completed'. If the result comes back as an error, the job is updated on the database to show a status of 'failed', and is given an additional message explaining the failure. Thus, the job is considered finished and is removed from the queue.  

On the frontend, I had just two components: a submit form, and a job list. The submit form handles submission of URLs (one or more, to show how the queue handles multiple submissions at a time). The job list component updates every second, sending a GET request to all /jobs and parsing the results. A better way to do this would be to have a socket listening to changes in the database instead of pinging it every second, but for this MVP this solution was good enough. This way, the user can see on the dashboard every job and their current status of 'pending', 'completed', or
'failed' (color coded because despite the lack of focus on styling we are not savages!). On a bigger app, I'd make each individual job item its own component, but for now this wasn't necessary.

Clicking on a job sends a GET request to job/:id, displaying the results on the right hand side of the dashboard.

Overall this was a very fun challenge, and I could see myself using the concept of a job queue dashboard in other scenarios, such as logging the time it takes for database requests to complete. 
