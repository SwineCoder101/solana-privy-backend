/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/horse_race.json`.
 */
export type HorseRace = {
    "address": "3U8ZsW8cd3GNcu69AhksaNEoeBCh8sHywvCHbm7mxaHz";
    "metadata": {
        "name": "horseRace";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
        {
            "name": "runCancelBet";
            "docs": [
                "Cancel a Bet"
            ];
            "discriminator": [
                154,
                97,
                164,
                238,
                225,
                178,
                79,
                134
            ];
            "accounts": [
                {
                    "name": "user";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "bet"
                    ];
                },
                {
                    "name": "bet";
                    "writable": true;
                },
                {
                    "name": "pool";
                    "writable": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [];
        },
        {
            "name": "runCreateBet";
            "docs": [
                "Create a Bet"
            ];
            "discriminator": [
                83,
                62,
                238,
                252,
                115,
                109,
                59,
                27
            ];
            "accounts": [
                {
                    "name": "user";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "betHashAcc";
                    "writable": true;
                },
                {
                    "name": "bet";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    98,
                                    101,
                                    116
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "user";
                            },
                            {
                                "kind": "arg";
                                "path": "poolKey";
                            },
                            {
                                "kind": "account";
                                "path": "betHashAcc";
                            }
                        ];
                    };
                },
                {
                    "name": "pool";
                    "writable": true;
                },
                {
                    "name": "systemProgram";
                    "docs": [
                        "System program"
                    ];
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                },
                {
                    "name": "lowerBoundPrice";
                    "type": "u64";
                },
                {
                    "name": "upperBoundPrice";
                    "type": "u64";
                },
                {
                    "name": "poolKey";
                    "type": "pubkey";
                },
                {
                    "name": "competition";
                    "type": "pubkey";
                }
            ];
        },
        {
            "name": "runCreateCompetition";
            "discriminator": [
                85,
                21,
                141,
                208,
                23,
                187,
                111,
                68
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "compHashAcc";
                    "writable": true;
                },
                {
                    "name": "competition";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    111,
                                    109,
                                    112,
                                    101,
                                    116,
                                    105,
                                    116,
                                    105,
                                    111,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "compHashAcc";
                            }
                        ];
                    };
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "tokenA";
                    "type": "pubkey";
                },
                {
                    "name": "priceFeedId";
                    "type": "string";
                },
                {
                    "name": "admin";
                    "type": {
                        "vec": "pubkey";
                    };
                },
                {
                    "name": "houseCutFactor";
                    "type": "u8";
                },
                {
                    "name": "minPayoutRatio";
                    "type": "u8";
                },
                {
                    "name": "interval";
                    "type": "u64";
                },
                {
                    "name": "startTime";
                    "type": "u64";
                },
                {
                    "name": "endTime";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "runCreatePool";
            "docs": [
                "Create a Pool"
            ];
            "discriminator": [
                225,
                56,
                189,
                2,
                220,
                61,
                209,
                12
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "poolHashAcc";
                    "writable": true;
                },
                {
                    "name": "competitionAcc";
                    "writable": true;
                },
                {
                    "name": "pool";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "competitionAcc";
                            },
                            {
                                "kind": "account";
                                "path": "poolHashAcc";
                            }
                        ];
                    };
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "startTime";
                    "type": "u64";
                },
                {
                    "name": "endTime";
                    "type": "u64";
                },
                {
                    "name": "treasury";
                    "type": "pubkey";
                }
            ];
        },
        {
            "name": "runSettlePool";
            "docs": [
                "Settle a Pool"
            ];
            "discriminator": [
                96,
                137,
                173,
                253,
                147,
                165,
                192,
                218
            ];
            "accounts": [];
            "args": [
                {
                    "name": "competitionKey";
                    "type": "pubkey";
                }
            ];
        },
        {
            "name": "runUpdateCompetition";
            "discriminator": [
                210,
                126,
                133,
                97,
                83,
                143,
                202,
                83
            ];
            "accounts": [
                {
                    "name": "competition";
                    "writable": true;
                },
                {
                    "name": "authority";
                    "signer": true;
                }
            ];
            "args": [
                {
                    "name": "tokenA";
                    "type": "pubkey";
                },
                {
                    "name": "priceFeedId";
                    "type": "string";
                },
                {
                    "name": "admin";
                    "type": {
                        "vec": "pubkey";
                    };
                },
                {
                    "name": "houseCutFactor";
                    "type": "u8";
                },
                {
                    "name": "minPayoutRatio";
                    "type": "u8";
                },
                {
                    "name": "interval";
                    "type": "u64";
                },
                {
                    "name": "startTime";
                    "type": "u64";
                },
                {
                    "name": "endTime";
                    "type": "u64";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "bet";
            "discriminator": [
                147,
                23,
                35,
                59,
                15,
                75,
                155,
                32
            ];
        },
        {
            "name": "competition";
            "discriminator": [
                193,
                49,
                76,
                118,
                106,
                22,
                221,
                106
            ];
        },
        {
            "name": "pool";
            "discriminator": [
                241,
                154,
                109,
                4,
                17,
                177,
                109,
                188
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "invalidTimeRange";
            "msg": "Invalid time range.";
        },
        {
            "code": 6001;
            "name": "invalidOracleId";
            "msg": "Invalid oracle id provided, please check the latest oracle id";
        },
        {
            "code": 6002;
            "name": "oracleInactive";
            "msg": "Oracle is inactive.";
        },
        {
            "code": 6003;
            "name": "outsideOracleTimeRange";
            "msg": "Oracle is outside the time range.";
        }
    ];
    "types": [
        {
            "name": "bet";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "user";
                        "type": "pubkey";
                    },
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "competition";
                        "type": "pubkey";
                    },
                    {
                        "name": "lowerBoundPrice";
                        "type": "u64";
                    },
                    {
                        "name": "upperBoundPrice";
                        "type": "u64";
                    },
                    {
                        "name": "poolKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "status";
                        "type": {
                            "defined": {
                                "name": "betStatus";
                            };
                        };
                    }
                ];
            };
        },
        {
            "name": "betStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "active";
                    },
                    {
                        "name": "cancelled";
                    },
                    {
                        "name": "settled";
                    }
                ];
            };
        },
        {
            "name": "competition";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "tokenA";
                        "type": "pubkey";
                    },
                    {
                        "name": "priceFeedId";
                        "type": "string";
                    },
                    {
                        "name": "houseCutFactor";
                        "type": "u8";
                    },
                    {
                        "name": "minPayoutRatio";
                        "type": "u8";
                    },
                    {
                        "name": "admin";
                        "type": {
                            "vec": "pubkey";
                        };
                    },
                    {
                        "name": "interval";
                        "type": "u64";
                    },
                    {
                        "name": "startTime";
                        "type": "u64";
                    },
                    {
                        "name": "endTime";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "pool";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "poolHash";
                        "type": "pubkey";
                    },
                    {
                        "name": "competitionKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "startTime";
                        "type": "u64";
                    },
                    {
                        "name": "endTime";
                        "type": "u64";
                    },
                    {
                        "name": "treasury";
                        "type": "pubkey";
                    }
                ];
            };
        }
    ];
};
