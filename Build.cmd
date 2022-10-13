dotnet publish --output .\release --runtime win-x64 --configuration Release --self-contained=true -p:PublishSingleFile=true .\source\FM.ContactBook.Server\FM.ContactBook.Server.csproj

cd .\source\FM.ContactBook.Client
npm install && ng build --output-path ..\..\release\app