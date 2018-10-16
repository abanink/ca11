const Graph = require('graphlib').Graph

const Node = require('./node')


class Network {
    constructor(app) {
        this.app = app
        this.graph = new Graph({directed: false})
        this.nodes = new Map()
    }


    addNode({id, transport}) {
        this.nodes.set(id, new Node({id, transport}))
        console.log(`node added: ${this.nodes.size} nodes in network`)
    }


    findNode(id) {
        return this.nodes.get(id)
    }


    removeNode(id) {
        this.nodes.delete(id)
        console.log(`node removed: ${this.nodes.size} nodes in network`)
    }
}

module.exports = Network
