var contract;
var wallet;

var send_nft_button = document.getElementById("send_nft");
var send_nft_button1 = document.getElementById("send_nft1");
var connect_button = document.getElementById("connect");
var connected_wallet = document.getElementById("connected_wallet");

const contract_address = 'nftmansur.testnet';
const payment_amount = "1000000000000000000000000";

async function load() {
    /* connect near */
    const near = await new nearApi.Near({
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org'
    });
    // connect to the NEAR Wallet
    wallet = new nearApi.WalletConnection(near, 'Knowledge Platform');
    // connect to a NEAR smart contract
    contract = new nearApi.Contract(wallet.account(), contract_address, {
     //   viewMethods: ['getQuestion'],
        changeMethods: ['nft_mint']
      });
    if(wallet.isSignedIn()){
        connect_button.textContent='sign out';
        connected_wallet.textContent = "Welcome " + wallet.getAccountId();
        after_payment();
    }
    
}

load();

async function after_payment(){
    const provider = new nearApi.providers.JsonRpcProvider(
        "https://archival-rpc.testnet.near.org"
      );

    var url_param = parseURLParams();

    if(url_param != undefined ){
        console.log(url_param["transactionHashes"]);
        if(url_param["transactionHashes"] != undefined){ 
            var result = await provider.txStatus(url_param["transactionHashes"][0], wallet.getAccountId());
            if (result){
                console.log(result); 

                document.getElementById("status").innerHTML = '<a href="https://explorer.testnet.near.org/transactions/'+result["transaction"]["hash"]+'" target="_blank"> Click here for transaction</a>';
                
            }
        }
    }
}
function parseURLParams() {
    var url = window.location.href;
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
connect_button.addEventListener('click', async function() {
    console.log(wallet);
    if(!wallet.isSignedIn()){
        wallet.requestSignIn(
            contract_address // contract address
        );
    } else {
        wallet.signOut();
        connect_button.textContent="sign in";
        connected_wallet.textContent = "";
    }
});

send_nft_button.addEventListener('click', async function() {
    if (wallet.isSignedIn()){
        let token_id = "token-"+ (Date.now() % 1000) / 1000;
        console.log(token_id);
    
            var response = await contract.nft_mint({
                "token_id": token_id,
                "metadata": {
                        "title": "Let us Support Ukranian Zoo Community Non Fungible Token reber #4143", 
                        "description": "The photo :)", 
                        "media": "https://raw.githubusercontent.com/digifelis/near-challenge-6/main/front-end/img/5.jpg",
                },
                "receiver_id": wallet.getAccountId()
            },
            "300000000000000", // attached GAS (optional)
            payment_amount// attached deposit in yoctoNEAR (optional)
            )
            console.log(response);
    } else {
        alert("please connect your wallet first");
    }


})

send_nft_button1.addEventListener('click', async function() {
    if (wallet.isSignedIn()){
        let token_id = "token-"+ (Date.now() % 1000) / 1000;
        console.log(token_id);
    
            var response = await contract.nft_mint({
                "token_id": token_id,
                "metadata": {
                        "title": "Let us Support Ukranian Zoo Community Non Fungible Token reber #4143", 
                        "description": "The photo :)", 
                        "media": "https://raw.githubusercontent.com/digifelis/near-challenge-6/main/front-end/img/4.jpg",
                },
                "receiver_id": wallet.getAccountId()
            },
            "300000000000000", // attached GAS (optional)
            payment_amount// attached deposit in yoctoNEAR (optional)
            )
            console.log(response);
    } else {
        alert("please connect your wallet first");
    }


})
