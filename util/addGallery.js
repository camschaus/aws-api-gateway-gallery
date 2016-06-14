var Promise = require('bluebird')
var AWS = require('aws-sdk')
var glob = require("glob")
var sizeOf = require('image-size');

var properties = require('../lambda/gallery/properties.json')

var DynamoDB = Promise.promisifyAll(new AWS.DynamoDB({region: 'us-west-2'}))

var seedGalleries = [ 
  {
    name: "JumboPass",
    nameFull: "Jumbo Pass",
    headerSub: "Hiking in Jumbo Pass, BC"
  }, {
    name: "MidnightPeak",
    nameFull: "Midnight Peak Hike",
    headerSub: "Great views of Kananaskis!"
  }, {
    name: "PrairieViewLoop",
    nameFull: "McConnell Ridge and Prairie View Loop",
    headerSub: "A beautiful November day hiking in Kananaskis."
  }
]

seedGalleries.forEach(function(gallery) {
var params = {
  Item: { 
    name: {
      S: gallery.name
      
    },
    nameFull: {
      S: gallery.nameFull
    },
    headerSub: {
      S: gallery.headerSub
    },
    images: {
      L: [ ]
    }
  },
  TableName: properties.galleryDynamoDBTable,
  ReturnConsumedCapacity: 'NONE',
  ReturnItemCollectionMetrics: 'SIZE',
  ReturnValues: 'NONE'
};

// options is optional
glob("../src/images/" + gallery.name + "/fulls/*.jpg", function (er, files) {
  files.forEach(function(file) {
    var imageSize = sizeOf(file)
    var match = file.match(/\/([^/]*)$/)
    var filename = match[1]
    params.Item.images.L.push({
        M: { "filename" : { S: filename },
              "width": { S: imageSize.width.toString()},
              "height": {S: imageSize.height.toString()},
              //"description": {S:""}
              }
      })
    console.log(filename, imageSize.width, imageSize.height)
  })

  console.log(JSON.stringify(params))
  DynamoDB.putItemAsync(params).then(function(result) {
   console.log("result", result)
  })
  .catch(function(error) {
    console.log("ERROR:", error)
  })
  
})

})

