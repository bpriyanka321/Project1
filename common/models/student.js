'use strict';
var results = [];
var path = require('path');
const csv = require('node-csv').createParser();
var async = require('async');

module.exports = function (Student) {
    Student.getDetails = function (data, callback) {    
     csv.mapFile(path.join(__dirname, './mycsv.csv'), function (err, data) {
       console.log('data -> ', data);
        results = data.map(obj => {
             if (obj.mobileNumber.length === 11)
                  return obj;
                }).filter((obj) => { return obj != undefined });

            console.log("result-->",results);       
      async.map(results, getStudentDetails, (err, res) => {
          if(res){
            console.log('res-------------',res);

            callback(null, res);

          }
                 });

              })
            };   
         
         function getStudentDetails(result, callback) {
             console.log("results.....", result);
             Student.create(result).then(res => {
                   console.log('response', res);
                    callback(null,res);
                     }).catch(err =>{
                         console.log('error---------',err);
                         callback(err, null);
                     });
                      };  
                         
            Student.remoteMethod(
             'getDetails',{
                    returns:
                        { root: true, type: 'object' },

                    accepts: [{
                        arg: 'data',
                        type: 'object',
                        http: {
                        source: "body"
                                }
                            }],
                     http: {
                        path: '/getDetails', verb: "post"
                          }
                        })
                  };

