"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompetitonAddress = void 0;
exports.convertCompetitionToProgramData = convertCompetitionToProgramData;
exports.convertProgramToCompetitionData = convertProgramToCompetitionData;
exports.getCompetitionData = getCompetitionData;
exports.getCompetitionAccount = getCompetitionAccount;
exports.getAllCompetitions = getAllCompetitions;
exports.getAllLiveCompetitions = getAllLiveCompetitions;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
function convertCompetitionToProgramData(competitionData) {
    return {
        tokenA: new web3_js_1.PublicKey(competitionData.tokenA),
        priceFeedId: competitionData.priceFeedId,
        admin: competitionData.admin.map(a => new web3_js_1.PublicKey(a)),
        houseCutFactor: new anchor_1.BN(competitionData.houseCutFactor),
        minPayoutRatio: new anchor_1.BN(competitionData.minPayoutRatio),
        interval: new anchor_1.BN(competitionData.interval),
        startTime: new anchor_1.BN(competitionData.startTime),
        endTime: new anchor_1.BN(competitionData.endTime)
    };
}
function convertProgramToCompetitionData(programData) {
    console.log(typeof programData.minPayoutRatio);
    return {
        tokenA: programData.tokenA.toString(),
        priceFeedId: programData.priceFeedId,
        admin: programData.admin.map(a => a.toString()),
        houseCutFactor: typeof programData.houseCutFactor === 'number' ? programData.houseCutFactor : programData.houseCutFactor.toNumber(),
        minPayoutRatio: typeof programData.minPayoutRatio === 'number' ? programData.minPayoutRatio : programData.minPayoutRatio.toNumber(),
        interval: typeof programData.interval === 'number' ? programData.interval : programData.interval.toNumber(),
        startTime: typeof programData.startTime === 'number' ? programData.startTime : programData.startTime.toNumber(),
        endTime: typeof programData.endTime === 'number' ? programData.endTime : programData.endTime.toNumber()
    };
}
//------------------------------------------------------- Data Finders
const findCompetitonAddress = (competitionHash, programId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.COMPETITION_SEED), Buffer.from(competitionHash.toBuffer())], new web3_js_1.PublicKey(programId || ""))[0];
};
exports.findCompetitonAddress = findCompetitonAddress;
// ------------------------------------------------------- Data Fetchers
async function getCompetitionData(competitionHash, program) {
    const compAddress = (0, exports.findCompetitonAddress)(competitionHash, program.programId.toString());
    const fetchedData = await program.account.competition.fetch(compAddress);
    return convertProgramToCompetitionData(fetchedData);
}
async function getCompetitionAccount(program, competitionPubkey) {
    return program.account.competition.fetch(competitionPubkey);
}
async function getAllCompetitions(program) {
    const competitionAccounts = await program.account.competition.all();
    return competitionAccounts.map((comp) => convertProgramToCompetitionData(comp.account));
}
async function getAllLiveCompetitions(program) {
    const competitionAccounts = await program.account.competition.all();
    const filteredComp = competitionAccounts.filter((comp) => {
        return comp.account.endTime > Date.now();
    });
    return filteredComp.map((comp) => convertProgramToCompetitionData(comp.account));
}
