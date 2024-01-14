# JSON Log Browser

Json logs can be really big records in single line, sometimes you cannot find the right data in the beginning of the record, which makes shifting through logs really difficult. To deal with this problem you have ELK, Splunk. But for local desktop/laptop its just much simpler to view the application logs in a text editor and use find with regex to get most of the job done. But if you need more filtering capability, and want the important columns to show only, then this tool comes in.

This is a ui + backend application to view any logs in json format in browser, and filter using  attributes of the json log record. Just copy the log into a file name mylog.log. Run both backend exprssjs server and frontend react application. It does not use any kind of database, it reads the entire file on every request, reads line by line matching all the criteria, criteria are all combined with 'AND' condition, and return matched lines to ui. You can copy paste new file everytime and just click search, the data shows up in UI. UI was inspired from kibana so you get filters, expand each table cell, double click to copy contents of a cell even if some of the content is hidden, expand entire json row into a formatted json viewer by clicking on the expand icon.

## Features

* Build a datamodel of the json log record
* Datamodel feeds into filtering form.
* Datamodel determines the columns of display table, so that only specific fields can be viewed.
* Filter json using attributes which are deeply nested
* There is a ui utility to generate the datamodel from few json logs records. Choose the attributes you are intersted in and delete the rest, save it in local storage and keep using it.
* Amend datamodel by adding new set of json logs and it will show the additional newly discovered fields to be saved in datamodel
* Datamodel is persisted in localstorage so that you don't have to build it everytime you start this app.
* Search criteria is also persisted in local storage, so that you can stop start server but you wont loose the search criteria.


## Building the application
It is a barebones react vite application with expressjs backend.

```
copy log file into mylog.log.
$ npm install
$ npm run fe
$ npm run be
```

Windows terminal shortcut to start the backend and frontend in a split terminal
```
wt -d "c:\myprojects\json-log-browser" -p "fe" cmd /k npm run fe ; split-pane -d "c:\myprojects\json-log-browser" cmd /k npm run be
```
Or, 
There is also a vscode tasks.json file which can be used to quickly start using VScode->RunTaks->"fe be"

## Starting first time
You don't have to follow this if you already have the record datamodel. But here is a nice way to start. 
#### Steps for seting from ui
* Click on "Edit data model"
* In the field "Inferred log data model" enter something barebones so that it brings up some log records `{level: "INFO"}`
* Hit search, and click on expand icon to view the log in json editor
* Copy the entire json from the json editor to clipboard, it has a copy icon to do it
* Paste the copied stuff in the field "Infer Form data model from logs"
* Now this is a multiline log, so click "Read one multiline log record"
* Click on "Save to local storage" and then click "load from local storage"
* Click search

#### Alternative Steps by copying log lines from mylog.log file
* Copy and Paste few log lines from "Infer Form data model from logs"
* Now this is a multiline log, so click "Read single line log record(s)" <-- this is the only difference
* Click on "Save to local storage" and then click "load from local storage"
* Click search


## How I personally use this application
I use IntelliJ IDEA or eclipse and redirect the logs to mylog.log file. Run this application to filter and view logs. It ignores all non-json log lines, which is good as application startups are usually non-json logs. I also delete unnecessary lines in mylog.log from top of the log and rerun search. IntelliJ IDEA dumps a lot of null characters in the beginning of the file, but thats okay, json log browser will ignore those.

## Contribution
If you want to contribute you are more than welcome. Feel free to fork or send PRs. 
If you find any annoying bug raise github issues. I know its not optimized I have just tested for 10,000 log lines. There is no pagination or virtual scrolling or lazy loading. 


npx npm-check-updates -u

## Release 
1/14/2024 - Usable version

# AWS setup
https://medium.com/codemonday/github-actions-for-ci-cd-with-ec2-codedeploy-and-s3-e93e75bf1ce0
In github: In our repository click Settings add our IAM key that we create above
files: 
  ./ecosystem.config.js
  ./appspec.yml  // aws codedeploy requires this filename its fixed and located in root of the project
  ./scripts/reload-pm2.sh
  ./.github/workflows/ci-cd.yml