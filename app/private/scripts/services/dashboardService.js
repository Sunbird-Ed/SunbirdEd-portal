'use strict';

/**
 * @ngdoc service
 * @name playerApp.dashboardService
 * @description
 * @author Nilesh More
 * # notesService
 * Service in the playerApp.
 */

angular.module('playerApp')
    .service('dashboardService', ['httpService', 'config', '$http', function (httpServiceJava, config, $http) {
        this.getAdminDashboardData = function (req, datasetType) {
            //var url = datasetType === 'creation' ? creationUrl : consumption
            //var url = config.URL.CONTENT_PREFIX + config.URL.NOTES.SEARCH; // TODO- change URL
            //return httpServiceJava.get(mockUrl);
            
            var URL = 'http://52.172.36.121:9000/api/dashboard/v1/org/' + req.org_id +'/creation?period=' + req.period;
            return $http({
                method: 'GET',
                url: URL
            });
            
            
            
            
            var $injector = angular.injector(['ng']);
            var q = $injector.get('$q');
            var deferred = q.defer();

			if (datasetType === 'creation'){
            var response = '{"id":null,"ver":"api","ts":"2017-08-07 07:30:09:787+0000","params":{"resmsgid":null,"msgid":"8e27cbf5-e299-43b0-bca7-8347f7e5abcf","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"org":{"orgId":"sunbird"},"period":"7d","snapshot":{"org.creation.authors.count":{"name":"Number of authors","value":25},"org.creation.reviewers.count":{"name":"Number of reviewers","value":25},"org.creation.content[@status=published].count":{"name":"Number of content items published","value":88},"org.creation.content[@status=draft].count":{"name":"Number of content items created","value":449},"org.creation.content[@status=review].count":{"name":"Number of content items reviewed","value":69}},"series":{"org.creation.content.created_on.count":{"name":"Content created by day","split":"content.created_on","buckets":[{"key_name":"2017-07-24","value":163,"key":1500854400000},{"key_name":"2017-07-25","value":140,"key":1500940800000},{"key_name":"2017-07-26","value":170,"key":1501027200000},{"key_name":"2017-07-27","value":76,"key":1501113600000},{"key_name":"2017-07-28","value":29,"key":1501200000000},{"key_name":"2017-07-29","value":15,"key":1501286400000},{"key_name":"2017-07-30","value":12,"key":1501372800000},{"key_name":"2017-07-31","value":3,"key":1501459200000}]},"org.creation.content[@status=published].published_on.count":{"name":"Live","split":"content.published_on","buckets":[{"key_name":"2017-07-24","value":22,"key":1500854400000},{"key_name":"2017-07-25","value":34,"key":1500940800000},{"key_name":"2017-07-26","value":26,"key":1501027200000},{"key_name":"2017-07-27","value":3,"key":1501113600000},{"key_name":"2017-07-28","value":3,"key":1501200000000}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","buckets":[{"key_name":"2017-07-24","value":29,"key":1500854400000},{"key_name":"2017-07-25","value":8,"key":1500940800000},{"key_name":"2017-07-26","value":22,"key":1501027200000},{"key_name":"2017-07-27","value":1,"key":1501113600000},{"key_name":"2017-07-28","value":3,"key":1501200000000},{"key_name":"2017-07-29","value":0,"key":1501286400000},{"key_name":"2017-07-30","value":4,"key":1501372800000},{"key_name":"2017-07-31","value":2,"key":1501459200000}]},"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","buckets":[{"key_name":"2017-07-24","value":112,"key":1500854400000},{"key_name":"2017-07-25","value":98,"key":1500940800000},{"key_name":"2017-07-26","value":121,"key":1501027200000},{"key_name":"2017-07-27","value":72,"key":1501113600000},{"key_name":"2017-07-28","value":23,"key":1501200000000},{"key_name":"2017-07-29","value":15,"key":1501286400000},{"key_name":"2017-07-30","value":8,"key":1501372800000}]}}}}';
            deferred.resolve(response);
            return deferred.promise;
			}

			if (datasetType === '1m'){
            var response = '{ "id": "api.sunbird.dashboard.org.creation", "ver": "1.0", "ts": "2017-07-31T18:48:14Z+05:30", "params": { "resmsgid": "cdd20745-593d-46b9-895c-62ab79ebdccb", "msgid": null, "err": null, "status": "successful", "errmsg": null }, "responseCode": "OK", "result": { "org": [ { "org_id": "...", "org_name": "..." } ], "period": "7d", "snapshot": { "org.creation.authors.count": { "name": "Number of authors", "value": "421" }, "org.creation.reviewers.count": { "name": "Number of reviewers", "value": "67" }, "org.creation.content[@status=published].count": { "name": "Number of content items published", "value": "12" }, "org.creation.content[@status=draft].count": { "name": "Number of content items published", "value": "21" }, "org.creation.content[@status=review].count": { "name": "Number of content items published", "value": "56" } }, "series": { "org.creation.content.created_on.count": { "name": "Content created by day", "split": "content.created_on", "buckets": [ { "key": "1500595200", "key_name": "2017-07-21", "value": "75" }, { "key": "1500681600", "key_name": "2017-07-22", "value": "33" }, { "key": "1500768000", "key_name": "2017-07-23", "value": "18" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "102" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "102" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "432" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "01" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "142" }, { "key": "1500854400", "key_name": "2017-07-24", "value": "123" }, { "key": "1500595200", "key_name": "2017-07-25", "value": "129" }, { "key": "1501027200", "key_name": "2017-07-26", "value": "93" }, { "key": "1501113600", "key_name": "2017-07-27", "value": "89" } ] }, "org.creation.content[@status=published].published_on.count": { "name": "Live", "split": "content.published_on", "buckets": [ { "key": "1500595200", "key_name": "2017-01-21", "value": "1233" }, { "key": "1500681600", "key_name": "2017-02-22", "value": "123" }, { "key": "1500768000", "key_name": "2017-03-23", "value": "134" }, { "key": "1500854400", "key_name": "2017-04-24", "value": "117" }, { "key": "1500595200", "key_name": "2017-05-25", "value": "512" }, { "key": "1501027200", "key_name": "2017-06-26", "value": "346" }, { "key": "1501027200", "key_name": "2017-07-26", "value": "234" }, { "key": "1501027200", "key_name": "2017-08-26", "value": "526" }, { "key": "1501027200", "key_name": "2017-09-26", "value": "916" }, { "key": "1501027200", "key_name": "2017-10-26", "value": "316" }, { "key": "1501027200", "key_name": "2017-11-26", "value": "416" }, { "key": "1501113600", "key_name": "2017-12-27", "value": "181" } ] }, "org.creation.content[@status=draft].count": { "name": "Draft", "split": "content.created_on", "buckets": [ { "key": "1500595200", "key_name": "2017-01-21", "value": "13" }, { "key": "1500681600", "key_name": "2017-02-22", "value": "233" }, { "key": "1500681600", "key_name": "2017-03-22", "value": "243" }, { "key": "1500681600", "key_name": "2017-04-22", "value": "113" }, { "key": "1500681600", "key_name": "2017-05-22", "value": "373" }, { "key": "1500681600", "key_name": "2017-06-22", "value": "398" }, { "key": "1500681600", "key_name": "2017-07-22", "value": "3" }, { "key": "1500768000", "key_name": "2017-08-23", "value": "1" }, { "key": "1500854400", "key_name": "2017-09-24", "value": "107" }, { "key": "1500595200", "key_name": "2017-10-25", "value": "10" }, { "key": "1501027200", "key_name": "2017-11-26", "value": "136" }, { "key": "1501113600", "key_name": "2017-12-27", "value": "39" } ] }, "org.creation.content[@status=review].count": { "name": "Review", "split": "content.reviewed_on", "buckets": [ { "key": "1500595200", "key_name": "2017-01-21", "value": "13" }, { "key": "1500681600", "key_name": "2017-02-22", "value": "3" }, { "key": "1500768000", "key_name": "2017-03-23", "value": "1" }, { "key": "1500854400", "key_name": "2017-04-24", "value": "17" }, { "key": "1500595200", "key_name": "2017-05-25", "value": "12" }, { "key": "1501027200", "key_name": "2017-06-26", "value": "16" }, { "key": "1501027200", "key_name": "2017-07-26", "value": "896" }, { "key": "1501027200", "key_name": "2017-08-26", "value": "346" }, { "key": "1501027200", "key_name": "2017-09-26", "value": "816" }, { "key": "1501027200", "key_name": "2017-10-26", "value": "136" }, { "key": "1501027200", "key_name": "2017-11-26", "value": "316" }, { "key": "1501113600", "key_name": "2017-12-27", "value": "786" } ] } } } } ';

            deferred.resolve(response);
            return deferred.promise;
			}
        };
    }]);
