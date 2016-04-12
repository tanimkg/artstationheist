var request = require('request'),
	fs 		= require('fs'),
	url     = "https://www.artstation.com/projects.json";

var EventEmitter	= require('events').EventEmitter;
var ee 				= new EventEmitter();

// create assets dir if not available
var dir = './assets';

if (!fs.existsSync(dir)){
	console.log("assets directory not found, creating directory ...");
    fs.mkdirSync(dir);
}

var page = 1,
	sorting = 'latest';		// other possible values: trending,

// entering into while loop for page 1, increase counter 'page' when finished page 1 contents

	console.log("Accessing www.artstation.com/projects.json?page="+page + '&sorting=' + sorting);

ee.on("singlePageDone", parseSinglePage(page));

	

function parseSinglePage(page){

	request(url + '?page=' + page + '&sorting=' + sorting, function (error, response, body) {
		if (error) { page = -1; return console.log("Something wrong!");}

		// past this point, we have a json object in var body

		// entering into second loop to grab each image of current page

		var json = JSON.parse(body);

		for (var i = 0; i < json.data.length; i++) {

			var targetAssetSrc = json.data[i].cover.small_image_url,	// .replace("/small/", "/large/") replace small with large in URL to grab the largest photo
				toBeFilename = json.data[i].slug;

			if (fs.existsSync(dir+'/'+toBeFilename)) {
				
				console.log(toBeFilename + " file already exists, skipping");

			} else {

				console.log("Downloading "+ toBeFilename + " from " + targetAssetSrc);

				request(targetAssetSrc).pipe(fs.createWriteStream(dir+'/'+toBeFilename)); 
				
			}
			

		}	
	    
	      
	});	// end request

	page += 1;

	ee.emit("singlePageDone");

}
