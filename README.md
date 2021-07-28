# Assignment Example

## Setup

### Contract

1. go into the contract directory: `cd contract`
2. install dependencies: `yarn`
3. compile the contract into WASM: `yarn asb`
4. deploy the contract `yarn near dev-deploy build/release/contract.wasm`
5. store the contract id in an environment variable `CONTRACT_ID=$(cat neardev/dev-account)`
6. you can then call contract methods `yarn near call $CONTRACT_ID <METHOD_NAME> '{"id":"4241345707"}' --accountId <YOUR_ACCOUNT_ID>`

### Front-End

1. go into the front-end directory `cd front-end`
2. install dependencies `yarn`
3. replace the example contract id with yours `sed -i "s/dev-1626994298245-51059421517553/$(cat ../contract/neardev/dev-account)/" js/*.js`
3. run the front-end with `yarn live-server`
