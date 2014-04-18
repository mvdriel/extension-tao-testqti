define([ 'jquery' ], function($) {

    function ResultServerApi(endpoint, params) {

        this.endpoint = endpoint;
        this.testServiceCallId = params.testServiceCallId;
        this.testDefinition = params.testDefinition;
        this.testCompilation = params.testCompilation;

        //private variable
        var qtiRunner = null;
        this.setQtiRunner = function(runner) {
            qtiRunner = runner;
        };

        this.getQtiRunner = function() {
            return qtiRunner;
        };
    }

    ResultServerApi.prototype.submitItemVariables = function(itemId,
            serviceCallId, responses, scores, events, params, callback) {

        var that = this;

        $.ajax({
            url : this.endpoint + 'storeItemVariableSet?serviceCallId='
                    + encodeURIComponent(this.testServiceCallId)
                    + '&QtiTestDefinition='
                    + encodeURIComponent(this.testDefinition)
                    + '&QtiTestCompilation='
                    + encodeURIComponent(this.testCompilation),
            data : JSON.stringify(responses),
            type : 'post',
            contentType : 'application/json',
            dataType : 'json',
            success : function(reply) {
                if (reply.success) {
                    var fbCount = 0;
                    if (reply.itemSession) {

                        var runner = that.getQtiRunner();
                        if (runner) {
                            fbCount = runner.showFeedbacks(reply.itemSession,
                                    callback);
                        }
                    }

                    if (!fbCount) {
                        callback(0);
                    }
                }
            }
        });
    };

    return ResultServerApi;
});