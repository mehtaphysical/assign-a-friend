const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});
const wallet = new nearApi.WalletConnection(near, "assign-a-friend");

const button = document.getElementById("sign-in");

button.addEventListener("click", () => {
  wallet.requestSignIn({
    contractId: "dev-1626994298245-51059421517553",
  });
});

const form = document.getElementById("assignment-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fd = new FormData(event.target);

  wallet.account().functionCall({
    contractId: "dev-1626994298245-51059421517553",
    methodName: "createAssignment",
    args: {
      accountId: fd.get("accountId"),
      text: fd.get("text"),
    },
    attachedDeposit: fd.get("amount"),
  });
});
