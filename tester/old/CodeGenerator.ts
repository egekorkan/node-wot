import * as TD from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import * as TDParser from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/td-parser';
import * as TdFunctions from './tdFunctions';
import ThingDescription, { Interaction } from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import logger from '/home/eko/Code/node-wot/packages/node-wot-logger/src/logger';
import fs = require('fs');
import {findInteractionByName}  from "/home/eko/Code/node-wot/packages/node-wot-td-tools/src/td-helpers";

export class CodeGenerator {
    private td: ThingDescription;
    private requests:any;
    
    constructor(tdesc: ThingDescription, testConf:any) {
        this.td = tdesc;
        let requestsLoc:string = testConf.RequestsLocation;
        this.requests =  JSON.parse( fs.readFileSync(requestsLoc,"utf8"));
    }

    public createRequest(requestName:string, testScenario:number,interactionIndex:number):JSON{
        let inter:Interaction ;
        return this.requests[testScenario][interactionIndex].interactionValue;
        /*
		try {
			inter = findInteractionByName(this.td, requestName);
		} catch (error) {
			logger.error("Interaction "+requestName+  " doesn't exist in this TD")
			throw error;
		}
        
		let type:string = inter.semanticTypes[0];
        if(type == "Property"){
            if (inter.writable){
				return this.requests[requestName][testScenario];
            } else {
                return null;
            }
        } else if (type == "Action"){
            if (inter.inputData){
				return this.requests[requestName][testScenario];
            } else {
                return null;
            }
        } else {
            logger.error("only property and action interaction types are supported for testing")
            return null;
        }
        */
    }

    //check the type of the interaction
        // if it is property 
            // not writable do nothing
            // if it is writable get the values
        //if it is action
            // if it has input, get and send the values
            // if it doesnt have input, do nothing
}