var Promise = require('bluebird')
var AWS = require('aws-sdk')

var DynamoDB = Promise.promisifyAll(new AWS.DynamoDB({region: 'us-west-2'}))

var properties = require('./properties.json')

var returnError = function(context, message) {
    console.log("failing with error: " + message)
    var error = new Error(message)
    context.fail(error)
}

// list all galleries
exports.galleriesGet = function(event, context) {
	var response = { "status": "ok" }
	var params = {
  		TableName: properties.galleryDynamoDBTable,
  		AttributesToGet: [ 'name', 'nameFull', 'headerSub' ]
  	}

  	console.log("galleriesGet - scan", JSON.stringify(event))

  	DynamoDB.scanAsync(params).then(function(items) {
  		console.log("got items", items)
  		response.data = items
  		context.succeed(response)
  	})
  	.catch(function(error) {
  		console.log("Error: ", error)
  		returnError(context, "InternalError")
  		return
  	})
}

// get single gallery
exports.galleryGet = function(event, context) {
	console.log("galleryGet", JSON.stringify(event))

	var result = {}
  var params = {
    Key: { 
      name: {
        S: ''
      }
    },
    TableName: properties.galleryDynamoDBTable,
    AttributesToGet: [ 'nameFull', 'images', 'headerSub' ],
    ConsistentRead: true,
  }

  if(!event.parameters.name) {
    returnError(context, "no name supplied")
    return
  }

  params.Key.name.S = event.parameters.name

  console.log("Lookup", event.parameters.name)
  DynamoDB.getItemAsync(params).then(function(item) {
    if(Object.keys(item).length === 0) {
      console.log("NOT FOUND")
      returnError(context, "NotFound")
      return
    }
    console.log("Got", JSON.stringify(item))
    result.name = event.parameters.name
    result.nameFull = item.Item.nameFull.S
    result.headerSub = item.Item.headerSub.S
    result.images = item.Item.images.L.map(function(image) {
      return { 
        "filename": image.M.filename.S,
        "width": image.M.width.S,
        "height": image.M.height.S,
        "description": ""
      }
    })
    console.log("result", result)

    context.succeed(result)
  })
  .catch(function(error) {
    console.log("Error: ", error)
    returnError(context, "InternalError")
    return
  })
}
