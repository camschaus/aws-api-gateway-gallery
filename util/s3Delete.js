var Promise = require('bluebird')
var AWS = require('aws-sdk')

var S3 = Promise.promisifyAll(new AWS.S3())

// ALL OBJECTS IN THIS BUCKET WILL BE DELETED!
var bucket = "gallery.schaus.ca"

var params = {
	'Bucket' : bucket
}

S3.listObjectsAsync(params).then(function(objects) {
	//console.log(objects);
	var obj = objects.Contents.map(function(object) {
		return { 
			Key: object.Key
		}
	})

	var deleteParams = {
		Bucket: bucket,
		Delete: {
			Objects: obj
		}
	}
	S3.deleteObjectsAsync(deleteParams).then(function(result) {
		console.log("Delete result", result)
	})
	
})
.catch(function(error) {
	console.log("Error:", error)
})
