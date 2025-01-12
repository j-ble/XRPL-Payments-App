function getNet() {
    let net
    if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233/"
    if (document.getElementById("dn").checked) net = "wss://s.altnet.rippletest.net:51233/"
    return net
}
let net = getNet()
const client = new xrpl.Client(net)
await client.connect()

let faucetHost = null
const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet

var lines = seeds.value.split('\n')

const standby_wallet = xrpl.Wallet.fromSeed(lines[0])
const operational_wallet = xrpl.Wallet.fromSeed(lines[1])

const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": standbyDestinationField.value
})
const signed = standby_wallet.sign(prepared)
const tx = await client.submitAndWait(signed.tx_blob)

const trustSet_tx = {
    "TransactionType": "TrustSet",
    "Account": standbyDestinationField.value,
    "LimitAmount": {
        "currency": standbyDestinationField.value,
        "issuer": standby_wallet.address,
        "value": standbyDestinationField.value
    }
}

const ts_prepared = await client.autofill(trustSet_tx)
const ts_signed = standby_wallet.sign(ts_prepared)
const ts_tx = await client.submitAndWait(ts_signed.tx_blob)

