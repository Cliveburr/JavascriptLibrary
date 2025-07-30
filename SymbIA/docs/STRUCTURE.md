


/interfaces
    # Project to define the interfaces for communication between the API and the WEB

/core
    - Reference to /interfaces
    # Project for all the logic that backend will use
    /src

/api
    - Reference to /interfaces
    - Reference to /core
    # Backend project API in Node.js, Typescript, Express
    ** Always use models and interfaces from /interfaces references
    ** Only use contollers pattner
    /src

/web
    - Reference to /interfaces
    # Frontend in React, Typescript
    # Use custom SCSS
    # Futuristic, minimalist style
    /src
