var request = require('request'),
	fs 		= require('fs'),
	url     = "https://www.artstation.com/projects.json";


// create assets dir if not available
var dir = './assets';

if (!fs.existsSync(dir)){
	console.log("assets directory not found, creating directory ...");
    fs.mkdirSync(dir);
}

var page = 1,
  download = true,
	sorting = 'latest';		// other possible values: trending,

// entering into while loop for page 1, increase counter 'page' when finished page 1 contents
var loop = function(){
  
  if (download){
    request({
      url: url,
      qs : {page:page, sorting:sorting},
      method: 'GET'
    }, function (error, response, body) {
      console.log("Accessing www.artstation.com/projects.json?page="+page + '&sorting=' + sorting);
      
      if (error) { 
        console.log("Something wrong!"); 
        loop();
      } else {
        // past this point, we have a json object in var body
        var json = JSON.parse(body);
        
        //if (json.data.length == 0) download = false;                // end of pages, stop download
        
        for (var i in json.data) {
          var targetAssetSrc = json.data[i].cover.small_image_url;	  // .replace("/small/", "/large/") replace small with large in URL to grab the largest photo
          var file = dir + '/' + json.data[i].hash_id + '.jpg'; // so that we can later access the file at www.artstation.com/artwork/{hash_id}
            
            if (fs.existsSync(file)) {
              console.log(file + " file already exists, skipping");
            } else {
              console.log("Downloading to "+ file + " from " + targetAssetSrc);
              request(targetAssetSrc).pipe(fs.createWriteStream(file));
            }
          }
        page++;
        loop();
        }
      });	// end request
    }
  console.log("Finished downloading");
  };

loop();


