module.exports = function(docClient) {

    function User(){};
    User.prototype.docClient = docClient;
    User.prototype.Schema = {
        TableName : "profile-chat-api.User",
        KeySchema: [
            { AttributeName: "accessCode", KeyType: "HASH"}  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "accessCode", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };
    
    /* DDL */
    User.prototype.tableName = function(){
        return this.Schema.TableName;
    };
    User.prototype.describeTable = function(callback){
        return docClient.service.describeTable(
            { TableName: this.Schema.TableName }, callback);
    };
    User.prototype.createTable = function(callback){
        return docClient.service.createTable(this.Schema, callback);
    };
    User.prototype.updateTable = function(updateParam, callback){
        if (typeof updateParam === 'function' && !callback) {
            callback = updateParam;
            updateParam = {};
        }
        if (!updateParam && callback) {
            updateParam = {};
        }

        updateParam.TableName = this.Schema.TableName;
        
        // todo:
        // validate updateParam

        return docClient.service.updateTable(updateParam, callback);
    };
    User.prototype.deleteTable = function(callback){
        return docClient.service.deleteTable(
            { TableName: this.Schema.TableName }, callback);
    };

    /* DML */
    User.prototype.put = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.put(params, callback);
    };
    User.prototype.get = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.get(params, callback);
    };
    User.prototype.update = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.update(params, callback);
    };
    User.prototype.delete = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.delete(params, callback);
    };
    User.prototype.query = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.query(params, callback);
    };
    User.prototype.scan = function(params, callback){
        params.TableName = this.Schema.TableName;
        return docClient.scan(params, callback);
    };

    /* Custom Method */
    // todo

    console.log('[models.User] init ok!!');
    return new User();
};