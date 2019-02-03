const graphlib = require('graphlib')

const D3 = require('./d3')


class Network {
    constructor(app) {
        this.app = app
        // Reactive d3'ified graphlib.
        if (this.app.env.isBrowser) {
            this.d3 = new D3(this.app)
        }

        this.graph = new graphlib.Graph({directed: false})
        // Nodes with a transport.
        this.endpoints = new Map()
    }


    addEndpoint(endpoint, parent = null) {
        this.endpoints.set(endpoint)
        this.addNode(endpoint.serialize(), parent)
    }


    addNode(node, parent = null) {
        this.graph.setNode(node.id, node)
        if (parent) this.graph.setEdge(parent.id, node.id)
        if (this.d3) this.d3.addNode(node, parent)
    }


    broadcast(msg, {excludes = []} = {}) {
        for (const [endpoint] of this.endpoints.entries()) {
            if (excludes.length && excludes.includes(endpoint)) continue
            endpoint.send(msg)
        }
    }


    export() {
        const exportGraph = graphlib.json.write(this.graph)

        return {
            edges: exportGraph.edges,
            identity: this.identity,
            nodes: exportGraph.nodes,
        }
    }


    async identify(node) {
        node.id = await this.app.crypto.hash(node.key)
        node.headless = this.app.env.isNode

        this.identity = node
        this.app.logger.info(`${this}network from node ${this.identity.id.substr(0, 8)}...`)
        this.graph.setNode(node.id, node)
    }


    import({edges, nodes}) {
        for (const node of nodes) {
            if (!this.graph.node(node.v)) {
                this.graph.setNode(node.v, node.value)
            }
        }

        for (const edge of edges) {
            if (!this.graph.edge(edge.v, edge.w)) {
                this.graph.setEdge(edge.v, edge.w)
            }
        }

        if (this.d3) {
            this.app.setState({sig11: {network: this.d3.graph(this.graph)}})
        }
    }


    /**
     * Find a Node in the graph by it's id and return it. When
     * node is already a Node instance, it will return with the Node.
     * @param {Node} node - A node id or a {@link Node}.
     * @returns {Node} - A Node instance or a serializable Node representation.
     */
    node(node) {
        let match = null

        if (typeof node === 'string') {
            match = this.graph.node(node)
        } else match = this.graph.node(node.id)
        return match
    }


    removeEndpoint(endpoint) {
        this.endpoints.delete(endpoint)
        this.app.logger.debug(`${this}endpoint removed: ${endpoint.id.substr(0, 8)}...`)
        this.removeNode(endpoint.serialize())
    }


    removeNode(node) {
        this.app.logger.debug(`${this}node removed: ${node.id.substr(0, 8)}...`)
        this.graph.removeNode(node.id)
        if (this.d3) this.d3.removeNode(node.id)
    }


    /**
    * Generate a representational name for this module.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[network] `
    }

}

module.exports = Network
