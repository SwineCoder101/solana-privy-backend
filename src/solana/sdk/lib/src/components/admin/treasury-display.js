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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const web3_js_1 = require("@solana/web3.js");
// Use the REACT_APP_SOLANA_RPC_URL env variable, fallback to devnet if not set.
const SOLANA_RPC_URL = process.env.REACT_APP_SOLANA_RPC_URL || "https://api.devnet.solana.com";
// Treasury PDA as provided.
const TREASURY_PDA = new web3_js_1.PublicKey("3Fanwf9uVRFUscsRkXHo4qTkUbFFmjzUSett4dU7qhgs");
const TreasuryDisplay = () => {
    const [balance, setBalance] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchBalance = async () => {
            try {
                // Create a connection instance
                const connection = new web3_js_1.Connection(SOLANA_RPC_URL, "processed");
                const lamports = await connection.getBalance(TREASURY_PDA);
                setBalance(BigInt(lamports));
            }
            catch (err) {
                console.error("Error fetching treasury balance:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            }
        };
        fetchBalance();
    }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", { className: "text-xl font-semibold mb-2" }, "Treasury Details"),
        error && react_1.default.createElement("p", { className: "text-red-500" },
            "Error: ",
            error),
        balance !== null ? (react_1.default.createElement("p", null,
            "Balance: ",
            balance.toString(),
            " lamports (",
            (Number(balance) / web3_js_1.LAMPORTS_PER_SOL).toFixed(2),
            " SOL)")) : (react_1.default.createElement("p", null, "Loading..."))));
};
exports.default = TreasuryDisplay;
