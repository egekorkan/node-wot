import  ThingDescription from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import Interaction from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import * as TDParser from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/td-parser';
import fs = require('fs');
import logger from '/home/eko/Code/node-wot/packages/node-wot-logger/src/logger';
var Validator  = require("jsonschema").Validator;

var v = new Validator();

export function validateRequest(requestName : string, request:JSON, schemaLoc:string) : Array<any> {
    let reqSchema : any = fs.readFileSync(schemaLoc+"Requests/"+requestName+".json","utf8");
    
    return v.validate(request,JSON.parse(reqSchema)).errors;
}

export function validateResponse(responseName : string, response:JSON, schemaLoc:string) : Array<any> {
    let resSchema : any = fs.readFileSync(schemaLoc+"Responses/"+responseName+".json","utf8");
    return v.validate(response,JSON.parse(resSchema)).errors;
    
}

export function validateTD(td : ThingDescription) : boolean {
    return true;
}