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
        // eslint-disable-next-line no-console
        console.log(`nodes: ${this.nodes.size}`)
    }


    findNode(id) {
        return this.nodes.get(id)
    }


    removeNode(id) {
        this.nodes.delete(id)
        // eslint-disable-next-line no-console
        console.log(`nodes: ${this.nodes.size}`)
    }
}

module.exports = Network
