import assert from "assert";
import {Apis} from "eidosjs-ws";
import {TransactionBuilder, ops} from "../../lib";

describe("TransactionBuilder", () => {
    // Connect once for all tests
    before(function() {
        return new Promise(function(resolve, reject) {
            Apis.instance("wss://dex.eidos.one", true)
                .init_promise.then(resolve)
                .catch(reject);
        });
    });

    after(function() {
        return new Promise(function(resolve) {
            Apis.close().then(resolve);
        });
    });

    it("Transfer", () => {
        let tr = new TransactionBuilder();

        assert.doesNotThrow(function() {
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.0"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });
        }, "This transfer should not throw");
    });

    it("Sets core required fees", () => {
        return new Promise((resolve, reject) => {
            let tr = new TransactionBuilder();
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.0"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr
                .set_required_fees()
                .then(() => {
                    assert.equal(tr.operations[0][1].fee.asset_id, "1.3.0");
                    assert(tr.operations[0][1].fee.amount > 0);
                    resolve();
                })
                .catch(reject);
        });
    });

    it("Sets required fees", () => {
        return new Promise((resolve, reject) => {
            let tr = new TransactionBuilder();
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.1"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr
                .set_required_fees()
                .then(() => {
                    assert.equal(tr.operations[0][1].fee.asset_id, "1.3.1");
                    assert(tr.operations[0][1].fee.amount > 0);
                    resolve();
                })
                .catch(reject);
        });
    });

    it("Defaults to CORE when fee pool is empty", () => {
        return new Promise((resolve, reject) => {
            let tr = new TransactionBuilder();
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.2" // The fee pool of this asset must be empty or insufficient
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr
                .set_required_fees()
                .then(() => {
                    assert.equal(tr.operations[0][1].fee.asset_id, "1.3.0");
                    assert(tr.operations[0][1].fee.amount > 0);
                    resolve();
                })
                .catch(reject);
        });
    });

    it("Sets and checks required fees for each op", () => {
        return new Promise((resolve, reject) => {
            let tr = new TransactionBuilder();
            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.1"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.1"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.1"
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr.add_type_operation("transfer", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.2" // The fee pool of this asset must be empty or insufficient
                },
                from: "1.2.1",
                to: "1.2.2",
                amount: {amount: 50000, asset_id: "1.3.0"},
                memo: {
                    from: "EON1111111111111111111111111111111114T1Anm",
                    to: "EON1111111111111111111111111111111114T1Anm",
                    nonce: 0,
                    message: ""
                }
            });

            tr.add_type_operation("account_upgrade", {
                fee: {
                    amount: 0,
                    asset_id: "1.3.1"
                },
                account_to_upgrade: "1.2.1",
                upgrade_to_lifetime_member: true
            });

            tr
                .set_required_fees()
                .then(() => {
                    assert.equal(tr.operations[0][1].fee.asset_id, "1.3.1");
                    assert.equal(tr.operations[1][1].fee.asset_id, "1.3.1");
                    assert.equal(tr.operations[2][1].fee.asset_id, "1.3.1");
                    assert.equal(tr.operations[3][1].fee.asset_id, "1.3.0");
                    assert.equal(tr.operations[4][1].fee.asset_id, "1.3.1");
                    assert(
                        tr.operations[4][1].fee.amount >
                            tr.operations[0][1].fee.amount
                    );
                    assert(tr.operations[0][1].fee.amount > 0);
                    resolve();
                })
                .catch(reject);
        });
    });

    it("Sets non-zero fee for proposed operations", () => {
        return new Promise((resolve, reject) => {
            let tr = new TransactionBuilder();

            let proposal = {
                op: tr.get_type_operation("transfer", {
                    fee: {
                        amount: 0,
                        asset_id: "1.3.0"
                    },
                    from: "1.2.1057595",
                    to: "1.2.802379",
                    amount: {amount: 100000, asset_id: "1.3.0"},
                    memo: {
                        from: "EON1111111111111111111111111111111114T1Anm",
                        to: "EON1111111111111111111111111111111114T1Anm",
                        nonce: 0,
                        message: ""
                    }
                })
            };

            let proposed_ops = [proposal];

            tr.add_type_operation("proposal_create", {
                proposed_ops,
                fee_paying_account: "1.2.1",
                fee: {
                    amount: 0,
                    asset_id: "1.3.0"
                }
            });

            tr
                .set_required_fees()
                .then(() => {
                    assert.equal(
                        tr.operations[0][1].proposed_ops[0].op[1].fee.asset_id,
                        "1.3.0"
                    );
                    assert(
                        tr.operations[0][1].proposed_ops[0].op[1].fee.amount > 0
                    );
                    resolve();
                })
                .catch(reject);
        });
    });

    it("Asset create standard", () => {
        let tr = new TransactionBuilder();
        let operationJSON = {
            fee: {
                amount: 0,
                asset_id: 0
            },
            issuer: "1.2.1",
            symbol: "TESTTEST",
            precision: 5,
            common_options: {
                max_supply: "10000000000",
                market_fee_percent: 0,
                max_market_fee: "0",
                issuer_permissions: 79,
                flags: 0,
                core_exchange_rate: {
                    base: {
                        amount: 100000,
                        asset_id: "1.3.0"
                    },
                    quote: {
                        amount: 100000,
                        asset_id: "1.3.1"
                    }
                },
                whitelist_authorities: [],
                blacklist_authorities: [],
                whitelist_markets: [],
                blacklist_markets: [],
                description: JSON.stringify({main: "", market: ""}),
                extensions: null
            },
            is_prediction_market: false,
            extensions: null
        };

        assert.doesNotThrow(function() {
            tr.add_type_operation("asset_create", operationJSON);
        });
    });

    it("Asset create prediction market", () => {
        let tr = new TransactionBuilder();
        let operationJSON = {
            fee: {
                amount: 0,
                asset_id: 0
            },
            issuer: "1.2.1",
            symbol: "TESTTEST",
            precision: 5,
            common_options: {
                max_supply: "10000000000",
                market_fee_percent: 2,
                max_market_fee: "500",
                issuer_permissions: 79,
                flags: 0,
                core_exchange_rate: {
                    base: {
                        amount: 100000,
                        asset_id: "1.3.0"
                    },
                    quote: {
                        amount: 100000,
                        asset_id: "1.3.1"
                    }
                },
                whitelist_authorities: [],
                blacklist_authorities: [],
                whitelist_markets: [],
                blacklist_markets: [],
                description: JSON.stringify({main: "", market: ""}),
                extensions: null
            },
            bitasset_opts: {
                feed_lifetime_sec: 864000,
                force_settlement_delay_sec: 86400,
                force_settlement_offset_percent: 100,
                maximum_force_settlement_volume: 500,
                minimum_feeds: 7,
                short_backing_asset: "1.3.0"
            },
            is_prediction_market: true,
            extensions: null
        };

        assert.doesNotThrow(function() {
            tr.add_type_operation("asset_create", operationJSON);
        });
    });
});
