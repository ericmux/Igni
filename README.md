# Igni
WebGL-based Physics Engine for the Web. 


## Setting up the environment:

### Global packages:

- Install node and npm:
    brew install node
    npm install -g npm
- Install Typescript, Typings and Webapack:
    npm install -g typings typescript webpack
- Install Webpack Dev Server:
    npm install -g webpack-dev-server

### Local packages

- Build dependencies:
    npm install 
    npm link typescript

### Debugging:
    webpack-dev-server --progress --colors -d

### Building to production:
    webpack