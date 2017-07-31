# health_autodesk

Service health test service

configurations in ./config.json:
port 4200
sampling interval 60000ms
maximum samples to keep 60

endpoints available:
  /health/:service_name        - is service up true/false
  /availability/:service_name  - percentage over past 60 min as described
  /services                    - json of all services with current status & availability
  
example:
  curl localhost:4200/services
  #{
    "bim360dm-dev":{
      "healthy":true,
      "availability":"100%"
    },
    "commands.bim360dm-dev":{
      "healthy":true,
      "availability":"100%"
    },
    "bim360dm-staging":{
      "healthy":true,
      "availability":"100%"
    },
    "eventing-dev":{
      "healthy":false,
      "availability":"0%"
    },
    "360-staging":{
      "healthy":true,
      "availability":"100%"
    }
  }
  
  Notes a.k.a things I would do if this was a real project:
    1. replace in memory array db with a real one (redis)
    2. file structure
    3. move sampling interval into separate process (which would be easier if db didn't belong to one process)
    4. client interface
    5. more unit test - made some as a POC but obviously not much coverage
