const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});
const wallet = new nearApi.WalletConnection(near, "assign-a-friend");

const params = new URLSearchParams(window.location.search);
const assignmentId = params.get("id");

window.onload = async () => {
  const assignerIdElement = document.getElementById("assigner-id");
  const assigneeIdElement = document.getElementById("assignee-id");
  const textElement = document.getElementById("text");
  const amountElement = document.getElementById("amount");

  const assignment = await wallet
    .account()
    .viewFunction("dev-1626994298245-51059421517553", "getAssignment", {
      id: assignmentId,
    });

  assignerIdElement.textContent = assignment.assignerId;
  assigneeIdElement.textContent = assignment.assigneeId;
  textElement.textContent = assignment.text;
  amountElement.textContent = assignment.payment;
};

const form = document.getElementById("complete-assignment");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fd = new FormData(event.target);

  wallet.account().functionCall({
    contractId: "dev-1626994298245-51059421517553",
    methodName: "completeAssignment",
    args: { id: assignmentId, answer: fd.get("answer") },
  });
});
