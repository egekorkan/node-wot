import  ThingDescription from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import Interaction from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import * as TDParser from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/td-parser';
import fs = require('fs');
import logger from '/home/eko/Code/node-wot/packages/node-wot-logger/src/logger';
export function findProtocol(td : ThingDescription) : string {
	let base:string = td.base;
	let columnLoc:number = base.indexOf(":");
	return base.substring(0,columnLoc);
}

export function findPort(td : ThingDescription) : number { 
	let base:string = td.base;
	let columnLoc:number= base.indexOf(':',6);
	let divLoc:number = base.indexOf('/',columnLoc);
	let returnString:string = base.substring(columnLoc+1, divLoc);
	return parseInt(returnString);
}

export function generateSchemas(td:ThingDescription,schemaLocation:string) : void{
    let padInitial:string = "{\n\t\"$schema\": \"http://json-schema.org/draft-04/schema#\",\n\t\"title\": \"";
    let tdInteractions:any= td.interaction;
        var mkdirp = require("mkdirp");
    mkdirp(schemaLocation + "Requests")
    mkdirp(schemaLocation + "Responses")
    let reqSchemaCount : number = 0;
    let resSchemaCount : number = 0; 
    // extract interactions
    for (var i = 0; i < tdInteractions.length; i++) {
        let curInter : any  = tdInteractions[i];
        let type :string = curInter.semanticTypes[0];
        let name :string = curInter.name;

        let inputData :any;
        let outputData :any;
        //try if you have input data
        
        try{
            inputData = curInter.inputData;
            let inString:string =  JSON.stringify(inputData);

            //substring is to avoid the brackets at the ends
            let schema :string =padInitial+name+"\",\n\t"+inString.substring(1,inString.length-1)+"}";
            let writeLoc :string = schemaLocation+"Requests/"+name+".json";

            fs.writeFileSync(writeLoc,schema);
            reqSchemaCount ++;
        }catch(Error){
            //not a problem, maybe it doesnt have input
        }

        try{
            outputData = curInter.outputData;
           let outString:string =  JSON.stringify(outputData);

           //substring is to avoid the brackets at the ends
            let schema :string =padInitial+name+"\",\n\t"+outString.substring(1,outString.length-1)+"}";
            let writeLoc :string = schemaLocation+"Responses/"+name+".json";
            
            fs.writeFileSync(writeLoc,schema);
            resSchemaCount++;
        }catch(Error){
            //not a problem, maybe it doesnt have output
        }
        
    }
    logger.info(reqSchemaCount +" request schemas and "+ resSchemaCount+" response schemas have been created")
}
/*                    {
                        "$ref": "/home/eko/Code/Thing-Description-Code-Generator/TDs/responseOverhead.json#/responseOverhead"
                    },
                    */
