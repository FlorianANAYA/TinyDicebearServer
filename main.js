

const path = require('path');
const expressLib = require('express');
const Avatar = require('@dicebear/avatars').default;
const maleSprites = require('@dicebear/avatars-male-sprites').default;
const femaleSprites = require('@dicebear/avatars-female-sprites').default;

const port = 3300;

const moods = ["happy", "sad", "surprised"];

function main()
{
    console.log("Starting server");
    var expressApp = expressLib();
    
    expressApp.listen(port, function()
    {
        console.log('Dicebear implementation for SimEvent running at http://localhost:' + port);
    });
    
    expressApp.get(/api\/male\/[\w\%]+\.svg$/i, maleRequest);
    expressApp.get(/api\/female\/[\w\%]+\.svg$/i, femaleRequest);
}


function maleRequest(request, response)
{
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    var filenameMatch = request.originalUrl.match(/([^\/]+)(?=\.\w+)?(?=\w\[\]\=)?$/);
    if (filenameMatch !== null)
    {
        var filename = decodeURIComponent(filenameMatch[0]);
        
        var mood = "";
        var moodMatch = filename.match(/(?=[^\/]+)(?=\?mood\=)?(\w+$)/);
        if (moodMatch !== null)
        {
            filename = filename.substring(0, filename.indexOf('.svg'));
            if (moods.indexOf(moodMatch[0]) !== -1)
                mood = moodMatch[0];
            // console.log("[" + ip + "] Received a male request for " + filename + ", mood=" + mood);
            var avatar = new Avatar(maleSprites);
            var svg = avatar.create(filename, {mood: [mood]});
            response.set('Content-Type', 'image/svg+xml');
            response.send(svg);
        }
    }
}


function femaleRequest(request, response)
{
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    var filenameMatch = request.originalUrl.match(/([^\/]+)(?=\.\w+)?(?=\w\[\]\=)?$/);
    if (filenameMatch !== null)
    {
        var filename = decodeURIComponent(filenameMatch[0]);
        
        var mood = "";
        var moodMatch = filename.match(/(?=[^\/]+)(?=\?mood\=)?(\w+$)/);
        if (moodMatch !== null)
        {
            filename = filename.substring(0, filename.indexOf('.svg'));
            if (moods.indexOf(moodMatch[0]) !== -1)
                mood = moodMatch[0];
            // console.log("[" + ip + "] Received a female request for " + filename + ", mood=" + mood);
            var avatar = new Avatar(femaleSprites);
            var svg = avatar.create(filename, {mood: [mood]});
            response.set('Content-Type', 'image/svg+xml');
            response.send(svg);
        }
    }
}


main();