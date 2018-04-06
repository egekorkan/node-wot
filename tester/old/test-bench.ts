/*
IMPORTANT! Please change the import paths according to your installation of your node wot
Below is the import path of the servient
'/home/eko/Code/node-wot/packages/node-wot/src/servient';
/home/eko/Code is where my node-wot installed so you should change that part
*/
// global W3C WoT Scripting API definitions
import _ from 'wot-typescript-definitions';
import Servient from '/home/eko/Code/node-wot/packages/node-wot/src/servient';
import HttpClientFactory from "/home/eko/Code/node-wot/packages/node-wot-protocols-http-client/src/http-client-factory";
import HttpServer from '/home/eko/Code/node-wot/packages/node-wot-protocols-http-server/src/http-server';
import ThingDescription from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import * as TD from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/thing-description';
import * as TDParser from '/home/eko/Code/node-wot/packages/node-wot-td-tools/src/td-parser';
import * as TdFunctions from './tdFunctions';
import fs = require('fs');
import { CodeGenerator } from './CodeGenerator'
import { TestReport } from './TestReport'
import { Tester } from './Tester'
import * as SchemaValidator from './SchemaValidator'


// for level only - use console for output
import logger from '/home/eko/Code/node-wot/packages/node-wot-logger/src/logger';
logger.level = 'info';

logger.info('INFO');
logger.debug('DEBUG');
logger.silly('SILLY');
// a test config file is always configured like this
export interface testConfig {
    TBname?: string;
    ThingTdLocation?: string;
    ThingTdName?: string;
    SchemaLocation?: string;
    TestReportsLocation?: string;
    RequestsLocation?: string;
    Repetitions?: number;
}

//getting the test config and extraction anything possible
let testConfig: testConfig = JSON.parse(fs.readFileSync('./test-config.json', "utf8"));
//the name of this test bench
let tbName: string = testConfig["TBname"];
//get the Thing Description of this Test Bench
let tbTdString: string = fs.readFileSync('../' + tbName + '.jsonld', "utf8");
let tbTd: ThingDescription = TDParser.parseTDString(tbTdString);

//get the Td of the Thing under test (tut)
let tutName = testConfig.ThingTdName;
let tutTdLocation = testConfig.ThingTdLocation;
//creating the Thing Description
let tutTdString: string = fs.readFileSync(tutTdLocation + tutName + ".jsonld", "utf8");
let tutTd: ThingDescription = TDParser.parseTDString(tutTdString);

//creating the Test Bench as a servient. It will test the Thing as a client and interact with the tester as a Server
let srv = new Servient();
logger.info('Created Test Bench');
srv.addServer(new HttpServer(TdFunctions.findPort(tbTd))); //at the port specified in the TD
srv.addClientFactory(new HttpClientFactory());
let WoT = srv.start();

//creating the test bench from the description
WoT.createFromDescription(tbTd).then(tb => {
    logger.info("Created Test Bench");
    logger.info("You can access it on " + tbTd.base + tbTd.name)
    tb.setProperty("TestConfig", testConfig);
    //now the Thing under Test (tut) will be extracted like a consumed thing
    //the current problem is that node-wot cannot have everything that is written in a TD, so the Thing is consumed but the TD that is given in the
    // test config is used for generating stuff and testing it 
    WoT.consumeDescriptionUri(tutTd.base + tutName).then(tut => {
        logger.info("Fetched Thing " + tutName);

        let tester: Tester = new Tester(testConfig, tutTd, tut);
        //tester.initiate();
        /*
        tester.testReport.addTestCycle();
         tester.testReport.addTestScenario();
        tester.testScenario(0,0,true).then(()=>{
            console.log("nice")
        }).catch((error:Error)=>{
            console.log("not nice", error)
        });
        */
        /*
        tester.testCycle(0,true).then(()=>{
            console.log("nice")
        }).catch(()=>{
            console.log("not nice")
        });
        */
/*
        tester.testThing(testConfig.Repetitions, true).then(testReport => {
            testReport.printResults();
            testReport.storeReport(testConfig.TestReportsLocation);
        }).catch(() => {
            logger.error("Something went wrong")
        });
*/

        tb.onInvokeAction("Initiate", function () {
            try {
                return tester.initiate();
            } catch (error) {
                logger.error("Initiation Error. " + error + "\nExiting")
                return false;
            }
        });

        tb.onInvokeAction("TestThing", function (input) {
            //console.log(input);
            tester.testThing(testConfig.Repetitions, input).then(testReport => {
                testReport.printResults();
                testReport.storeReport(testConfig.TestReportsLocation);
                tb.setProperty("TestReport",testReport.getResults());
                console.log()
            }).catch(() => {
                logger.error("Something went wrong");
            });
        });

    }).catch((err) => logger.error('Problem in consumeDescriptionUri function ', err));

});



