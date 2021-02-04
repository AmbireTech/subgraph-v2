import { Channel } from "../generated/schema"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"

export function getOrInitChannel(txid: string): Channel {
    let channel = Channel.load(txid)
    
    if(!channel) {
        channel = new Channel(txid)
        channel.channelId = Bytes.fromI32(0) as Bytes
        channel.tokenAddr = Bytes.fromI32(0) as Bytes
        channel.creator = Bytes.fromI32(0) as Bytes
        channel.tokenAmount = BigInt.fromI32(0)
        channel.timestamp = 0
        channel.validators = []
        channel.validUntil = BigInt.fromI32(0)
        channel.spec = '0'
    }

    return channel as Channel
}