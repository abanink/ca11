const graphlib = require('graphlib')


class Network {
    constructor(app, id) {
        this.app = app
        this.graph = new graphlib.Graph({directed: false})

        this.id = id
        this.graph.setNode(id, {super: true})

        // this.nodes = new Map()
    }


    addNode({id, transport}) {
        // this.nodes.set(id, new Node({id, transport}))
        this.graph.setNode(id, {super: false})
        if (transport) {
            this.graph.setEdge(this.id, id)
        }
        // eslint-disable-next-line no-console
    }


    findNode(id) {
        // return this.nodes.get(id)
    }


    /**
     * Find a Node in the graph by it's id and return it. When
     * node is already a Node instance, it will return with the Node.
     * @param {Node} node - A node id or a {@link Node}.
     * @returns {Node} - A Node instance or a serializable Node representation.
     */
    node(node) {
        if (typeof node === 'string') {
            node = this.graph.node(node)
        }
        return node
    }


    removeNode(id) {
        this.graph.removeNode(id)
        // eslint-disable-next-line no-console
        // console.log(`nodes: ${this.nodes.size}`)
    }


    serialize() {
        return graphlib.json.write(this.graph)
    }
}

module.exports = Network
