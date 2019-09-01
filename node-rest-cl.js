const l = function(a){
    console.log(a)
}
l('run')

var fs = require('fs');

var Client = require('node-rest-client').Client;

var client = new Client();

var secureData = {UserName:'vkomelkov',UserPassword:'Qwer1111'};

var loginData = {
    data: JSON.stringify(secureData),
    headers: { "Content-Type": "application/json" },
    requestConfig: {
        timeout: 1000, //request timeout in milliseconds
        noDelay: true, //Enable/disable the Nagle algorithm
        keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
        keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
    },
    responseConfig: {
        timeout: 1000 //response timeout
    }
}


client.post("https://ffm.ukrtelecom.net/ServiceModel/AuthService.svc/Login", loginData, function (data, response) {
    cookie = response.headers['set-cookie'];
    var csrftoken =  cookie[3].slice(8,-8);
    var reqArgs = {
        headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
    }
    // var xmlread = fs.readFileSync('datasend.xml');
    // var reqArgs = {
    //     headers: { "Content-Type": "application/atom+xml" , "Accept": "application/atom+xml" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
    // }

    // var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/ActivityCollection?$filter=Owner/Name" + encodeURIComponent(" eq 'Комельков Владіслав Олегович'") + 
    // "&$orderby=StartDate%20desc" + 
    // "&$top=4"
    //  + 
    // "&$select=Title,StatusId,OwnerId,CreatedOn,StartDate,Id,TsiFFMWorkCategoryId,TsiFFMWorkCategoryL2Id,TsiFFMResCategoryId,TsiFFMResCategoryL2Id,CreatedById";

    // var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/ActivityCollection(guid'582ec0d0-b519-48a8-8961-0aba3868d2e5')";


    // var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiVisitStatusHistoryCollection?$filter=CreatedBy/TsiLogin%20eq%20'vkomelkov'&$orderby=CreatedOn%20desc&$top=6";

    // var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/ActivityStatusCollection?$filter=Name" + 
    // encodeURIComponent(" eq 'Выполнена'");

    // var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiResourceTypeTTCollection"

    var lnk = "https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/ContactCollection?$filter=TsiLogin%20eq%20'vkomelkov'";


    client.get(lnk,reqArgs, function (a, b){

        var answer = JSON.parse(a);
        console.log(answer);
        // process.stdout.write(a);
        let readableData = JSON.stringify(answer.d).replace(/(,")/g, ',\n"');
        fs.writeFile('data.json', readableData , function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        // fs.writeFile('data.json', JSON.stringify(answer), function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        // });

        var sendJson;

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


// guid'9dea4d63-6beb-4211-abd9-db4c90eb6496' В пути
// guid'7fa82408-d9f1-41d6-a56d-ce3746701a46' На обьекте
// guid'4bdbb88f-58e6-df11-971b-001d60e938c6' Выполнена
// guid'800150f0-ca30-482c-9274-9a21cb92b291' Отменена

// 394d4b84-58e6-df11-971b-001d60e938c6
