var masterDigest = require('request-digest');

var user = "admin";
var geslo = "344780";

var firstCallPostData = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetDeviceSettings xmlns="http://purenetworks.com/HNAP1/"/></soap:Body></soap:Envelope>';
var secondCallPostData = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><SetAPClientSettings xmlns="http://purenetworks.com/HNAP1/"><RadioID>RADIO_2.4GHz</RadioID><Enabled>true</Enabled><SSID>fritz_klubska</SSID><MacAddress>74:DA:DA:5F:66:85</MacAddress><ChannelWidth>0</ChannelWidth><SupportedSecurity><SecurityInfo><SecurityType>WPA2-PSK</SecurityType><Encryptions><string>AES</string></Encryptions></SecurityInfo></SupportedSecurity><Key>SH_test!</Key></SetAPClientSettings></soap:Body></soap:Envelope>';

function start() {
    var digestRequest = require('request-digest')('user', 'geslo');

    //Digest algorithm= SHA - 256, realm = "HNAP Authentication", qop = "auth,auth-int",
    //    nonce = "386d568eca70bb5898cb", opaque = "543182ed", Digest algorithm= MD5,
    //        realm = "HNAP Authentication", qop = "auth,auth-int", nonce = "386d568eca70bb5898cb", opaque = "543182ed"

    // CTRL + KK // bookmark on/off
    // CTRL + KC // comment
    // CTRL + KU // UNcomment
    // CTRL + KD // poravnava kode

    digestRequest.requestAsync({
        host: 'http://192.168.0.20',
        path: '/HNAP1',
        port: 80,
        method: 'POST',
        json: false,
        body: firstCallPostData,
        body2: secondCallPostData,
        soap2: '"http://purenetworks.com/HNAP1/SetAPClientSettings"',
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': '"http://purenetworks.com/HNAP1/GetDeviceSettings"',
            'Content-Length': '1000'
        }
    })
        .then(function (response) {
            console.log(response.body);
        })
        .catch(function (error) {

            console.log('+++++++++++++++++++++++++++++');
            console.log(error.statusCode);
            //console.log(error);

            /*
            if (error.statusCode == 401)
            {
                console.log('BINGO');
                makeAuthorizeRequest(error, digestRequest);
            }
            else
            {
                // TODO ?

                console.log(error);
                console.log(error.statusCode);
                console.log(error.body);
            }
            */

        });

}

start();


// SECOND POST CALL
function makeAuthorizeRequest(data, previousRequest)
{



    return;


    var WWW = data.response.headers['www-authenticate'];

    console.log(WWW);

    previousRequest.requestAsync({
        host: 'http://192.168.0.20',
        path: '/HNAP1',
        port: 80,
        method: 'POST',
        json: false,
        body: secondCallPostData,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': '"http://purenetworks.com/HNAP1/SetAPClientSettings"',
            'Content-Length': '1000',
            'Authorize': WWW
        }
    })
        .then(function (response) {


            console.log(response.statusCode);

            //console.log(response.body);


        })
        .catch(function (error) {


            console.log(error.statusCode);
            console.log(error.body)

            /*
            if (error.statusCode == 401) {
                console.log('BINGO');
                makeAuthorizeRequest(error);
            }
            else {
                // TODO ?

                console.log(error);
                console.log(error.statusCode);
                console.log(error.body);
            }
            */

        });

    //console.log(data.response.headers);

    // TODO:
    // TODO:
    // TODO:TODO:



    return;

    //console.log(data.response.headers['www-authenticate']);

    //console.log(WWW);
    
    var foundValue = "";
    var res = WWW.toLowerCase();

    var splited = res.split(", ");

    console.log(splited)
    //console.log(WWW.length)
    var firstQuote = splited.find("nonce")

    for (i = 0; i < splited.length; i++) {
        if (firstQuote == "nonce"){
            console.log("DELA!");
        } else {
            console.log("NE DELA!");
        }
    }
     
    var digestRequestSecond = require('request-digest')('user', 'geslo');

    digestRequestSecond.requestAsync({
        host: 'http://192.168.0.20',
        path: '/HNAP1',
        port: 80,
        method: 'POST',
        json: false,
        body: secondCallPostData,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': '"http://purenetworks.com/HNAP1/SetAPClientSettings"',
            'Content-Length': '1000'
        }
    })
        .then(function (response) {
            console.log(response.body);
        })
        .catch(function (error) {

            if (error.statusCode == 401) {
                console.log('BINGO');
                makeAuthorizeRequest(error);
            }
            else {
                // TODO ?

                console.log(error);
                console.log(error.statusCode);
                console.log(error.body);
            }
        });
    
}
