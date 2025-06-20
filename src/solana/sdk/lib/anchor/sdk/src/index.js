"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HORSE_RACE_PROGRAM_ID = exports.IDL = void 0;
exports.getProgram = getProgram;
exports.createProvider = createProvider;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const HorseRaceIDL = __importStar(require("./idl/horse_race.json"));
__exportStar(require("./instructions/admin"), exports);
__exportStar(require("./states"), exports);
__exportStar(require("./utils"), exports);
exports.IDL = HorseRaceIDL;
exports.HORSE_RACE_PROGRAM_ID = new web3_js_1.PublicKey(HorseRaceIDL.address);
// Instead of creating the program directly, create a function to get the program with a provider
function getProgram(provider) {
    return new anchor_1.Program(exports.IDL, provider);
}
// Helper function to create provider if needed
function createProvider(connection, wallet) {
    return new anchor_1.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
}
