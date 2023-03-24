/* eslint-disable prefer-const */
import { BigInt, log } from '@graphprotocol/graph-ts'
import { GreenBTCGlobal, GreenBTCNFTInfo } from '../types/schema'

import { Transfer } from '../types/HskGBTC/HskGBTC'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export function handleTransfer(event: Transfer): void {
  // Check the staking reward notify events
  let greenBTCGlobal = GreenBTCGlobal.load('GREEN')
  if (greenBTCGlobal === null) {
    greenBTCGlobal = new GreenBTCGlobal('GREEN')
    greenBTCGlobal.totalNFT = ZERO_BI
    greenBTCGlobal.save()
  }

  let from = event.params.from.toHexString()
  if(from != ADDRESS_ZERO) {
    log.error('From not zero: {} {} {}', [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toString()])
    return
  }

  let to = event.params.to
  if((to===null) || to.toHexString() == ADDRESS_ZERO) {
    log.error('To is zero: {} {} {} ', [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toString()])
    return
  }

  let tokenId = event.params.tokenId.toString()
  let greenBTCNFT = GreenBTCNFTInfo.load(tokenId)

  if(greenBTCNFT=== null) {
    let greenBTCNFT = new GreenBTCNFTInfo(tokenId)
    greenBTCNFT.owner = to.toHexString()
    greenBTCNFT.hashTrx = event.transaction.hash.toHexString()
    greenBTCNFT.timeTrx = event.block.timestamp.toString()
    greenBTCNFT.blockHeight = event.block.number.toString()
    greenBTCNFT.save()
  } else {
    log.error('Repeated: {} {} {} ', [event.params.from.toHexString(), event.params.to.toHexString(), event.params.tokenId.toString()])
    return
  }

  greenBTCGlobal.totalNFT = greenBTCGlobal.totalNFT.plus(ONE_BI) 
  greenBTCGlobal.save()
}