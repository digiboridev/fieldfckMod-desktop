const l = function(a){
    console.log(a)
}
l('run')

var fs = require('fs');

// fs.readFile('TsiResourceTypeTTCollection.json',function(err,data){
//     let arr = JSON.parse(data);
//     console.log(arr[2])     
// })

var Client = require('node-rest-client').Client;

var client = new Client();

var secureData = {UserName:'vkomelkov',UserPassword:'Qwer5151'};

var loginData = {
    data: JSON.stringify(secureData),
    headers: { "Content-Type": "application/json" },
}



client.post("https://ffm.ukrtelecom.net/ServiceModel/AuthService.svc/Login", loginData, function (data, response) {
    cookie = response.headers['set-cookie'];
    l(cookie[3])
    var csrftoken =  cookie[3].slice(8,-8);
    var reqArgs = {
        headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
    }

    var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiMobileConnectionHistoryCollection";
    


    client.get(lnk,reqArgs, function (a, b){

        var answer = JSON.parse(a);
        console.log(answer);
        // process.stdout.write(a);
        let readableData = JSON.stringify(answer.d).replace(/(,")/g, ',\n"');
        fs.writeFile('data.json', readableData , function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        var sendJson;

        //update ethernet
        
        fs.readFile('datasend.json',function(err,data){
            sendJson = data;
            console.log(JSON.parse(sendJson))

            var putLnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiMobileConnectionHistoryCollection";

            var reqArgs2 = {
                data:sendJson,
                headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
            }

            client.post(putLnk,reqArgs2,function(a,b){
                process.stdout.write(a)
            })

            
        })

        // update activity data 
        
        // fs.readFile('datasend.json',function(err,data){
        //     sendJson = data;
        //     console.log(JSON.parse(sendJson))

        //     var putLnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiVisitStatusHistoryCollection";

        //     var reqArgs2 = {
        //         data:sendJson,
        //         headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
        //     }

        //     client.post(putLnk,reqArgs2,function(a,b){
        //         process.stdout.write(a)
        //     })

            
        // })
        

        //location sec

        // var locLnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/LocationHistoryCollection"
        // client.get(locLnk,reqArgs,function(a,b){
        //     // process.stdout.write(a)
        //     fs.writeFile('location.json',a,function(err){
        //         if(err) throw err;
        //         console.log('Saved')
        //     })
        // })

        // fs.readFile('locationsend.json',function(err,data){
        //     sendJson = data;
        //     console.log(JSON.parse(sendJson));
        //     var reqArgs3 = {
        //         data:sendJson,
        //         headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
        //     }
        //     client.post(locLnk,reqArgs3,function(a,b){
        //         process.stdout.write(a);
        //     })
        // })

        //
    });
    // var mobLnk = "https://ffm.ukrtelecom.net/0/Mobile/Services/MobileDataService.ashx?functionName=getCurrentTimeInUTC"
    //     client.get(mobLnk,reqArgs,function(a,b){
    //         process.stdout.write(b)
    //         // console.log(a)
    //         // fs.writeFile('mobile.json',a,function(err){
    //         //     if(err) throw err;
    //         //     console.log('Saved')
    //         // })
    //     })
});

console.log(new Date(1586948699298)  )