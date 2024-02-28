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
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      {"query": `{
        pool(id: "${poolAddress}") {
          mints(first:1000,skip:${skip*1000}){
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
            "Content-Type": "application/json"
          }
      }).then(async function(res) {
        res = res.data.data.pool.mints;
        res_length = res.length;
        result.push(...res);
        skip++;
      }).catch(()=>{return false;})
  }
  return result
}

export async function get_ids(poolAddress) {

  let result = await query_pool(poolAddress)
  
  if(!result)
    return false;


    let ids = [];
    let logs = [];
    let owner = [];
  
    for(let i=0;i<result.length;i++){
      let tx_res = await provider.
        getTransactionReceipt(result[i].transaction.id);
      logs.push(tx_res.logs);
      owner.push(result[i].origin)
    }
    const intrfc = new ethers.utils.Interface(abi);
    console.log("Mints without NFT (directly to liquidity pool):")
    for(let i=0;i<logs.length;i++){
      let added = false;
      for(let k =0;k<logs[i].length;k++){
        
        if(logs[i][k].address == NON_FONGIBLE_FACTORY_MANAGER){
          let args = intrfc.parseLog(logs[i][k]).args
          if(args.tokenId){
            let id = Number(args.tokenId)
            if(!ids.find(i=>i.id === id))
              ids.push({"id":id,"owner":owner[i]});
            added = true;
            break;
          }
        }
      }
      if(!added)
        console.log(result[i].transaction.id)
    }
 
    let ids_clean = [];
    for(let id of ids){
      if (!isNaN(id.id))
        ids_clean.push(id);
    }

    return ids_clean;
  
}

export async function get_positions(positionsIds){

  
  let poolContract = new ethers.Contract(
    NON_FONGIBLE_FACTORY_MANAGER,
    abi,
    provider);

  const positionsCalls = [];
  for (let id of positionsIds) {
    positionsCalls.push(
        poolContract.positions(id.id)
    )
  }

  const callResponses = await Promise.allSettled(positionsCalls).then((res)=>{
    for(let i=res.length-1;i>=0;i--){
      
      if(!res[i] || res[i].status=='rejected'){
        res.splice(i,1);
        positionsIds.splice(i,1);
      }
    }
    return res
  }).catch((e)=>{
    console.log(e)
    return false;
  })
  if(!callResponses)
    return false;

  const positionsInfos = callResponses.map((position,i) => {
    return {
      owner:positionsIds[i].owner,
      id:positionsIds[i].id,
      tickLower: position.value.tickLower,
      tickUpper: position.value.tickUpper,
      liquidity: JSBI.toNumber(JSBI.divide(
        JSBI.BigInt(position.value.liquidity),
        JSBI.BigInt(10**14)))/10000
    }
  })


  return positionsInfos;
}



