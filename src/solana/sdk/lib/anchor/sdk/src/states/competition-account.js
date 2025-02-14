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
    console.log(typeof programData.account.minPayoutRatio);
    return {
        competitionKey: programData.publicKey.toBase58(),
        tokenA: programData.account.tokenA.toString(),
        priceFeedId: programData.account.priceFeedId,
        admin: programData.account.admin.map(a => a.toString()),
        houseCutFactor: typeof programData.account.houseCutFactor === 'number' ? programData.account.houseCutFactor : programData.account.houseCutFactor.toNumber(),
        minPayoutRatio: typeof programData.account.minPayoutRatio === 'number' ? programData.account.minPayoutRatio : programData.account.minPayoutRatio.toNumber(),
        interval: typeof programData.account.interval === 'number' ? programData.account.interval : programData.account.interval.toNumber(),
        startTime: typeof programData.account.startTime === 'number' ? programData.account.startTime : programData.account.startTime.toNumber(),
        endTime: typeof programData.account.endTime === 'number' ? programData.account.endTime : programData.account.endTime.toNumber()
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
    return convertProgramToCompetitionData({ publicKey: compAddress, account: fetchedData });
}
async function getCompetitionAccount(program, competitionPubkey) {
    return program.account.competition.fetch(competitionPubkey);
}
async function getAllCompetitions(program) {
    const competitionAccounts = await program.account.competition.all();
    return competitionAccounts.map((comp) => convertProgramToCompetitionData({ publicKey: comp.publicKey, account: comp.account }));
}
async function getAllLiveCompetitions(program) {
    const competitionAccounts = await program.account.competition.all();
    const filteredComp = competitionAccounts.filter((comp) => {
        return comp.account.endTime > Date.now();
    });
    return filteredComp.map((comp) => convertProgramToCompetitionData({ publicKey: comp.publicKey, account: comp.account }));
}
