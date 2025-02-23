/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/horse_race.json`.
 */
export type HorseRace = {
    "address": "99ieFmE1u6Pws1Nneo2ksKvZjNsbDtiEbhGSfGUth3BN";
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
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
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
                    "name": "poolVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "pool";
                            }
                        ];
                    };
                },
                {
                    "name": "treasury";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "treasuryVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            }
                        ];
                    };
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
                                "path": "pool.competition";
                                "account": "pool";
                            },
                            {
                                "kind": "account";
                                "path": "pool.pool_hash";
                                "account": "pool";
                            }
                        ];
                    };
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
                    "name": "poolVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "pool";
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
                },
                {
                    "name": "leverageMultiplier";
                    "type": "u64";
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
                    "name": "poolVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "pool";
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
                }
            ];
        },
        {
            "name": "runCreatePoolOracleTransformer";
            "discriminator": [
                200,
                65,
                121,
                126,
                37,
                233,
                200,
                41
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "poolOracle";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    111,
                                    114,
                                    97,
                                    99,
                                    108,
                                    101
                                ];
                            },
                            {
                                "kind": "arg";
                                "path": "pool";
                            },
                            {
                                "kind": "arg";
                                "path": "priceFeed";
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
                    "name": "pool";
                    "type": "pubkey";
                },
                {
                    "name": "priceFeed";
                    "type": "string";
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
            "name": "runCreateTreasury";
            "discriminator": [
                82,
                98,
                53,
                241,
                26,
                97,
                130,
                101
            ];
            "accounts": [
                {
                    "name": "payer";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "treasuryVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "treasury";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121
                                ];
                            }
                        ];
                    };
                }
            ];
            "args": [
                {
                    "name": "maxAdmins";
                    "type": "u8";
                },
                {
                    "name": "minSignatures";
                    "type": "u8";
                },
                {
                    "name": "initialAdmins";
                    "type": {
                        "vec": "pubkey";
                    };
                }
            ];
        },
        {
            "name": "runDepositToTreasury";
            "discriminator": [
                196,
                198,
                205,
                187,
                190,
                132,
                4,
                182
            ];
            "accounts": [
                {
                    "name": "treasury";
                    "writable": true;
                },
                {
                    "name": "treasuryVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "depositor";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "runSettlePoolByPrice";
            "docs": [
                "Settle a Pool"
            ];
            "discriminator": [
                171,
                89,
                52,
                200,
                177,
                251,
                136,
                83
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "competition";
                    "writable": true;
                    "relations": [
                        "pool"
                    ];
                },
                {
                    "name": "pool";
                    "writable": true;
                },
                {
                    "name": "poolVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "pool";
                            }
                        ];
                    };
                },
                {
                    "name": "treasury";
                    "writable": true;
                },
                {
                    "name": "treasuryVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
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
                    "name": "lowerBoundPrice";
                    "type": "u64";
                },
                {
                    "name": "upperBoundPrice";
                    "type": "u64";
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
        },
        {
            "name": "runUpdatePoolPriceFeed";
            "docs": [
                "Update a Pool Price Feed"
            ];
            "discriminator": [
                231,
                14,
                29,
                101,
                113,
                15,
                145,
                140
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "poolOracle";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    111,
                                    111,
                                    108,
                                    95,
                                    111,
                                    114,
                                    97,
                                    99,
                                    108,
                                    101
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "pool_oracle.pool";
                                "account": "poolOracleTransformer";
                            },
                            {
                                "kind": "account";
                                "path": "pool_oracle.price_feed";
                                "account": "poolOracleTransformer";
                            }
                        ];
                    };
                },
                {
                    "name": "priceUpdate";
                }
            ];
            "args": [];
        },
        {
            "name": "runWithdrawFromTreasury";
            "discriminator": [
                91,
                83,
                58,
                157,
                170,
                173,
                109,
                130
            ];
            "accounts": [
                {
                    "name": "treasury";
                    "writable": true;
                },
                {
                    "name": "treasuryVault";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    116,
                                    114,
                                    101,
                                    97,
                                    115,
                                    117,
                                    114,
                                    121,
                                    95,
                                    118,
                                    97,
                                    117,
                                    108,
                                    116
                                ];
                            }
                        ];
                    };
                },
                {
                    "name": "recipient";
                    "writable": true;
                },
                {
                    "name": "pool";
                    "writable": true;
                },
                {
                    "name": "authority";
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "amount";
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
        },
        {
            "name": "poolOracleTransformer";
            "discriminator": [
                165,
                246,
                143,
                134,
                31,
                187,
                230,
                30
            ];
        },
        {
            "name": "priceUpdateV2";
            "discriminator": [
                34,
                241,
                35,
                99,
                157,
                126,
                244,
                205
            ];
        },
        {
            "name": "treasury";
            "discriminator": [
                238,
                239,
                123,
                238,
                89,
                1,
                168,
                253
            ];
        }
    ];
    "events": [
        {
            "name": "betCancelled";
            "discriminator": [
                32,
                179,
                128,
                184,
                125,
                193,
                106,
                104
            ];
        },
        {
            "name": "betCreated";
            "discriminator": [
                32,
                153,
                105,
                71,
                188,
                72,
                107,
                114
            ];
        },
        {
            "name": "betSettled";
            "discriminator": [
                57,
                145,
                224,
                160,
                62,
                119,
                227,
                206
            ];
        },
        {
            "name": "competitionCreated";
            "discriminator": [
                20,
                172,
                54,
                140,
                71,
                253,
                74,
                235
            ];
        },
        {
            "name": "insufficientFunds";
            "discriminator": [
                1,
                162,
                237,
                78,
                144,
                121,
                44,
                184
            ];
        },
        {
            "name": "poolCreated";
            "discriminator": [
                202,
                44,
                41,
                88,
                104,
                220,
                157,
                82
            ];
        },
        {
            "name": "poolSettled";
            "discriminator": [
                71,
                220,
                136,
                147,
                65,
                185,
                90,
                47
            ];
        },
        {
            "name": "withdrawal";
            "discriminator": [
                6,
                187,
                215,
                71,
                92,
                85,
                90,
                83
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "unauthorized";
            "msg": "Unauthorized: Not a whitelisted admin or deployer.";
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
                        "name": "poolVaultKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "status";
                        "type": {
                            "defined": {
                                "name": "betStatus";
                            };
                        };
                    },
                    {
                        "name": "leverageMultiplier";
                        "type": "u64";
                    },
                    {
                        "name": "createdAt";
                        "type": "u64";
                    },
                    {
                        "name": "updatedAt";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "betCancelled";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "betKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "user";
                        "type": "pubkey";
                    },
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
                    },
                    {
                        "name": "cancelledAt";
                        "type": "i64";
                    }
                ];
            };
        },
        {
            "name": "betCreated";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "betKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "user";
                        "type": "pubkey";
                    },
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
                        "name": "poolVaultKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "poolKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "competition";
                        "type": "pubkey";
                    },
                    {
                        "name": "leverageMultiplier";
                        "type": "u64";
                    },
                    {
                        "name": "createdAt";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "betSettled";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "betKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "user";
                        "type": "pubkey";
                    },
                    {
                        "name": "userBalanceBefore";
                        "type": "u64";
                    },
                    {
                        "name": "userBalanceAfter";
                        "type": "u64";
                    },
                    {
                        "name": "poolBalanceBefore";
                        "type": "u64";
                    },
                    {
                        "name": "poolBalanceAfter";
                        "type": "u64";
                    },
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "leverageMultiplier";
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
                        "name": "hasWinningRange";
                        "type": "bool";
                    },
                    {
                        "name": "winningLowerBoundPrice";
                        "type": "u64";
                    },
                    {
                        "name": "winningUpperBoundPrice";
                        "type": "u64";
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
            "name": "competitionCreated";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "competition";
                        "type": "pubkey";
                    },
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
                        "name": "numOfPools";
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
            };
        },
        {
            "name": "insufficientFunds";
            "docs": [
                "Emitted when there aren’t enough funds in the treasury to withdraw."
            ];
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "treasuryBalance";
                        "type": "u64";
                    },
                    {
                        "name": "amountRequested";
                        "type": "u64";
                    },
                    {
                        "name": "recipient";
                        "type": "pubkey";
                    },
                    {
                        "name": "treasury";
                        "type": "pubkey";
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
                        "name": "competition";
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
                        "name": "bump";
                        "type": "u8";
                    },
                    {
                        "name": "vaultKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "vaultBump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "poolCreated";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "poolHash";
                        "type": "pubkey";
                    },
                    {
                        "name": "vaultKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "competition";
                        "type": "pubkey";
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
            "name": "poolOracleTransformer";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "pool";
                        "type": "pubkey";
                    },
                    {
                        "name": "maxPrice";
                        "type": "u64";
                    },
                    {
                        "name": "minPrice";
                        "type": "u64";
                    },
                    {
                        "name": "priceFeed";
                        "type": "string";
                    },
                    {
                        "name": "active";
                        "type": "bool";
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
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "poolSettled";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "poolKey";
                        "type": "pubkey";
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
                        "name": "hasWinningRange";
                        "type": "bool";
                    },
                    {
                        "name": "poolBalanceBefore";
                        "type": "u64";
                    },
                    {
                        "name": "poolBalanceAfter";
                        "type": "u64";
                    },
                    {
                        "name": "winningBetsBalance";
                        "type": "u64";
                    },
                    {
                        "name": "losingBetsBalance";
                        "type": "u64";
                    },
                    {
                        "name": "numberOfBets";
                        "type": "u8";
                    },
                    {
                        "name": "numberOfWinningBets";
                        "type": "u8";
                    },
                    {
                        "name": "numberOfLosingBets";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "priceFeedMessage";
            "repr": {
                "kind": "c";
            };
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "feedId";
                        "docs": [
                            "`FeedId` but avoid the type alias because of compatibility issues with Anchor's `idl-build` feature."
                        ];
                        "type": {
                            "array": [
                                "u8",
                                32
                            ];
                        };
                    },
                    {
                        "name": "price";
                        "type": "i64";
                    },
                    {
                        "name": "conf";
                        "type": "u64";
                    },
                    {
                        "name": "exponent";
                        "type": "i32";
                    },
                    {
                        "name": "publishTime";
                        "docs": [
                            "The timestamp of this price update in seconds"
                        ];
                        "type": "i64";
                    },
                    {
                        "name": "prevPublishTime";
                        "docs": [
                            "The timestamp of the previous price update. This field is intended to allow users to",
                            "identify the single unique price update for any moment in time:",
                            "for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.",
                            "",
                            "Note that there may not be such an update while we are migrating to the new message-sending logic,",
                            "as some price updates on pythnet may not be sent to other chains (because the message-sending",
                            "logic may not have triggered). We can solve this problem by making the message-sending mandatory",
                            "(which we can do once publishers have migrated over).",
                            "",
                            "Additionally, this field may be equal to publish_time if the message is sent on a slot where",
                            "where the aggregation was unsuccesful. This problem will go away once all publishers have",
                            "migrated over to a recent version of pyth-agent."
                        ];
                        "type": "i64";
                    },
                    {
                        "name": "emaPrice";
                        "type": "i64";
                    },
                    {
                        "name": "emaConf";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "priceUpdateV2";
            "docs": [
                "A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.",
                "It contains:",
                "- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.",
                "- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.",
                "- `price_message`: The actual price update.",
                "- `posted_slot`: The slot at which this price update was posted."
            ];
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "writeAuthority";
                        "type": "pubkey";
                    },
                    {
                        "name": "verificationLevel";
                        "type": {
                            "defined": {
                                "name": "verificationLevel";
                            };
                        };
                    },
                    {
                        "name": "priceMessage";
                        "type": {
                            "defined": {
                                "name": "priceFeedMessage";
                            };
                        };
                    },
                    {
                        "name": "postedSlot";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "treasury";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "adminAuthorities";
                        "type": {
                            "vec": "pubkey";
                        };
                    },
                    {
                        "name": "minSignatures";
                        "type": "u8";
                    },
                    {
                        "name": "totalDeposits";
                        "type": "u64";
                    },
                    {
                        "name": "totalWithdrawals";
                        "type": "u64";
                    },
                    {
                        "name": "vaultKey";
                        "type": "pubkey";
                    },
                    {
                        "name": "vaultBump";
                        "type": "u8";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "verificationLevel";
            "docs": [
                "Pyth price updates are bridged to all blockchains via Wormhole.",
                "Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.",
                "The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,",
                "so we also allow for partial verification.",
                "",
                "This enum represents how much a price update has been verified:",
                "- If `Full`, we have verified the signatures for two thirds of the current guardians.",
                "- If `Partial`, only `num_signatures` guardian signatures have been checked.",
                "",
                "# Warning",
                "Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update."
            ];
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "partial";
                        "fields": [
                            {
                                "name": "numSignatures";
                                "type": "u8";
                            }
                        ];
                    },
                    {
                        "name": "full";
                    }
                ];
            };
        },
        {
            "name": "withdrawal";
            "docs": [
                "Emitted after a successful withdrawal."
            ];
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "recipient";
                        "type": "pubkey";
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
