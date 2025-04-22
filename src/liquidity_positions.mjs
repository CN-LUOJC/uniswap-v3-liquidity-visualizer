import { ethers } from 'ethers';
import JSBI from 'jsbi';
import axios from 'axios';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const abi = require('./api.json');

const NON_FONGIBLE_FACTORY_MANAGER = 
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

let provider;

export async function connect(provider_url){
    provider = new ethers.providers.JsonRpcProvider(provider_url);
    return await provider._networkPromise.then(()=>{return true }).catch(()=>{()=>{return false}})
    
}


async function query_pool(poolAddress){
  let skip = 0
  let result = []
  let res_length = true;

  while(res_length){

    await axios.post(
      "https://gateway.thegraph.com/api/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B",
      {"query": `{
        pool(id: "${poolAddress}") {
          mints(first:10,skip:${skip*10}){
            origin
            transaction{
              id
            }
          }
        }
      }`
      },
      {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6f00558683c69327ea64eab69e40f53c"
          }
      }).then(async function(res) {
        console.log(res.data.data.pool.mints)
        res = res.data.data.pool.mints;
        res_length = res.length;
        // res_length = 0;
        result.push(...res);
        skip++;
      }).catch(()=>{return false;})
  }
  return result
}

export async function get_ids(poolAddress) {
  let result = await query_pool(poolAddress);
  
  if (!result) {
    return false;
  }

  let ids = [];
  let logs = [];
  let owner = [];

  console.log("Result from query_pool:", result);
  
  for (let i = 0; i < result.length; i++) {
    let tx_res = await provider.getTransactionReceipt(result[i].transaction.id);
    logs.push(tx_res.logs);
    owner.push(result[i].origin);
  }

  console.log("Transaction Logs:", logs);

  const intrfc = new ethers.utils.Interface(abi);
  console.log("Mints without NFT (directly to liquidity pool):");

  for (let i = 0; i < logs.length; i++) {
    let added = false;

    console.log("Checking log address:", logs[i][0].address);

    for (let k = 0; k < logs[i].length; k++) {
      if (logs[i][k].address == NON_FONGIBLE_FACTORY_MANAGER) {
        let args = intrfc.parseLog(logs[i][k]).args;
        if (args.tokenId) {
          let id = Number(args.tokenId);

          console.log("Parsed tokenId:", id);

          if (!ids.find(i => i.id === id)) {
            ids.push({"id": id, "owner": owner[i]});
            added = true;
            break;
          }
        }
      }
    }

    if (!added) {
      console.log("No valid tokenId found for transaction:", result[i].transaction.id);
    }
  }

  let ids_clean = [];
  for (let id of ids) {
    if (!isNaN(id.id)) {
      ids_clean.push(id);
    }
  }

  console.log("Cleaned IDs:", ids_clean);

  return ids_clean;
}


export async function get_positions(positionsIds) {
  
  let poolContract = new ethers.Contract(
    NON_FONGIBLE_FACTORY_MANAGER,
    abi,
    provider
  );
  console.log('12');
  const positionsCalls = positionsIds.map(async (id) => {

    try {
      console.log("Fetching position for ID:", id.id);
      const position = await poolContract.positions(id.id);
      console.log("Fetched position:", position);
      return position;
    } catch (error) {
      console.error("Error fetching position:", error);
      return null;
    }
  });

  try {
    const callResponses = await Promise.allSettled(positionsCalls);
    console.log('positionsCalls', positionsCalls);
    console.log('Call Responses:', callResponses);

    const validResponses = callResponses.filter(response => response.status === 'fulfilled');
    const validPositionsIds = positionsIds.filter((_, index) => callResponses[index].status === 'fulfilled');

    if (validResponses.length === 0) {
      console.error("No valid responses");
      return false;
    }

    console.log('Valid Responses:', validResponses);
    console.log('Valid Positions IDs:', validPositionsIds);

    const positionsInfos = validResponses.map((position, i) => {
      if (!position.value) {
        console.error(`Position at index ${i} does not have a valid value`);
        return null;
      }

      return {
        owner: validPositionsIds[i].owner,
        id: validPositionsIds[i].id,
        tickLower: position.value.tickLower,
        tickUpper: position.value.tickUpper,
        liquidity: position.value.liquidity
          ? JSBI.toNumber(JSBI.divide(
              JSBI.BigInt(position.value.liquidity),
              JSBI.BigInt(10 ** 14))) / 10000
          : 0
      };
    }).filter(info => info !== null);

    console.log('Processed Positions Infos:', positionsInfos);

    return positionsInfos;

  } catch (e) {
    console.error("Error in fetching positions:", e);
    return false;
  }
}




