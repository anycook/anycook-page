anycook-page
============

Webclient for [anycook-api](https://github.com/anycook/anycook-api).

## Dependencies
- [node.js](http://nodejs.org)
- [compass](http://compass-style.org)
- [yeoman](http://yeoman.io)

### Installation (on Mac OSX)
1. Install [brew](http://brew.sh)
```shell
	ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```
2. Install node.js
	```brew install node```
3. Install compass
	```sudo gem install compass```
4. Install yeoman
	```npm install -g yeoman

## Test environment
You can test the whole anycook platform localy. To also test the API locally you need to checkout and run [anycook-api](https://github.com/anycook/anycook-api). The instructions can be found [here](https://github.com/anycook/anycook-api#test-environment).

To start the anycook-page test environment follow these steps:
1. Install dependencies
2. Run ```npm install``` in the project folder to install project specific node dependencies.
3. Run ```bower install``` to install thirdparty JavaScript libraries.
4. Execute ```grunt serve``` to start the test server. Your browser should open the page automatically.

## Compiling
To compile and minify the scripts run ```grunt```.
