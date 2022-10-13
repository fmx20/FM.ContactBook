# FM.ContactBook
Contact book demo app

Server: ASP Core Web API  
Client: Angular 14 Web Application  
DB: SQLite  

The server can either be run as a console app or hosted as a windows service.  

To start the demo, you first have to run the Build.cmd file. This will build the server and client app into the release folder.  
After the successful build, you have to start the server executable from within the release folder.  
The server will start at port 9085 and takes care of the api endpoints, as well as providing the client app.  
So after starting the server you can open the client app in the browser with: [http://localhost:9085/login](http://localhost:9085/login).  
To change the listen port, you have to edit the appsettings.json file in the release folder.  
