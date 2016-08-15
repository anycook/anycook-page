anycook page
============
[![Dependency Status](https://david-dm.org/anycook/anycook-page/dev-status.png?theme=shields.io)](https://david-dm.org/anycook/anycook-page#info=devDependencies&view=table)
[![Build Status](https://jenkins.gesundkrank.de/buildStatus/icon?job=anycook-page)](https://jenkins.gesundkrank.de/job/anycook-page/)


Webclient for [anycook-api](https://github.com/anycook/anycook-api).

## Dependencies
- [node.js](http://nodejs.org)

### Installation (on Mac OSX)
1. Install node.js
	```brew install node```
2. Install bower & grunt-cli
	```npm install -g bower grunt-cli```

## Test environment
You can test the whole anycook platform localy. To also test the API locally you need to checkout and run [anycook-api](https://github.com/anycook/anycook-api). The instructions can be found [here](https://github.com/anycook/anycook-api#test-environment).

To start the anycook-page test environment follow these steps:

1. Install dependencies
2. Run ```npm install``` in the project folder to install project specific node dependencies.
3. Run ```bower install``` to install thirdparty JavaScript libraries.
4. Execute ```grunt serve``` to start the test server. Your browser should open the page automatically.

## Credentials
The Javascript API client supports json credential files. The credentials for the test environment are placed in the app folder. The credentials for the production environment in the projects root folder. Grunt replaces test with production when building dist folder. 

## Compiling
To compile and minify the scripts run ```grunt```.


