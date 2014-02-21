anycook page
============
[![Dependency Status](https://david-dm.org/anycook/anycook-page/dev-status.png?theme=shields.io)](https://david-dm.org/anycook/anycook-page#info=devDependencies&view=table)



Webclient for [anycook-api](https://github.com/anycook/anycook-api).

## Dependencies
- [node.js](http://nodejs.org)
- [compass](http://compass-style.org)
- [yeoman](http://yeoman.io)

### Installation (on Mac OSX)
1. Install [brew](http://brew.sh)
	```ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"```
2. Install node.js
	```brew install node```
3. Install compass
	```sudo gem install compass```
4. Install yeoman
	```npm install -g yeoman```
4. Install grunt-cli
	```npm install -g grunt-cli```

## Test environment
You can test the whole anycook platform localy. To also test the API locally you need to checkout and run [anycook-api](https://github.com/anycook/anycook-api). The instructions can be found [here](https://github.com/anycook/anycook-api#test-environment).

To start the anycook-page test environment follow these steps:

1. Install dependencies
2. Run ```npm install``` in the project folder to install project specific node dependencies.
3. Run ```bower install``` to install thirdparty JavaScript libraries.
4. Execute ```grunt serve``` to start the test server. Your browser should open the page automatically.

## Compiling
To compile and minify the scripts run ```grunt```.

## Uploading to S3
The build scripts supports uploading to Amazons S3. Add your AWS credentials to a file named ```aws-credentials.json``` in your project root. Its content has to look like this: 

```json
{
  "accessKeyId": "...",
  "secretAccessKey": "...",
  "bucket": "anycook.de",
  "region": "eu-west-1"
}
```

To upload, run ```grunt upload```.


