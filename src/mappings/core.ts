/* eslint-disable prefer-const */
import { BigInt } from '@graphprotocol/graph-ts'
import { GreenBTCGlobal, GreenBTCNFTInfo } from '../types/schema'

import { Transfer } from '../types/HskGBTC/HskGBTC'

export let ZERO_BI = BigInt.fromI32(0)
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export function handleTransfer(event: Transfer): void {
  // Check the staking reward notify events
  let greenBTCGlobal = GreenBTCGlobal.load('GREEN')
  if (greenBTCGlobal === null) {
    greenBTCGlobal = new GreenBTCGlobal('GREEN')
    greenBTCGlobal.totalNFT = ZERO_BI
    greenBTCGlobal.save()
  }

  let from = event.params.from.toString()
  if(from !== ADDRESS_ZERO) return

  let to = event.params.to
  if(!to) return
  if(to.toString() === ADDRESS_ZERO) return

  let tokenId = event.params.tokenId.toString()
  let greenBTCNFT = new GreenBTCNFTInfo(tokenId)
  greenBTCNFT.Owner = to.toString()
  greenBTCNFT.Transaction = event.transaction.hash.toHexString()
  greenBTCNFT.timeLastTx = event.block.timestamp.toString()

  greenBTCNFT.save()
}