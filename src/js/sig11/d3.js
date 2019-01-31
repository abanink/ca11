/**
 * Helper class to convert between graphlib
 * and D3's graph format and to adjust state.
 */
class D3 {
    constructor(app) {
        this.app = app
        this.state = this.app.state.calls.sig11.network
    }


    addNode(node, parent) {
        node = this.node(node)
        this.state.nodes.push(node)
        if (parent) {
            parent = this.state.nodes.find((i) => i.id === parent.id)
            if (parent) {
                this.state.edges.push({
                    source: {
                        index: this.state.nodes.indexOf(node),
                    },
                    target: {
                        index: this.state.nodes.indexOf(parent),
                    },
                })
            }
        }
    }


    /**
     * Translate to a d3 graph representation.
     * @param {Graph} graph - A graphlib Graph.
     * @returns {Object} - Nodes and Edges in d3 format.
     */
    graph(graph) {
        const nodeIds = graph.nodes()

        const nodes = graph.nodes().map((i) => {
            const value = graph.node(i)
            let node = this.node(value)
            return node
        })

        const edges = graph.edges().map((i) => {
            return {
                source: {index: nodeIds.indexOf(i.v)},
                target: {index: nodeIds.indexOf(i.w)},
            }
        })

        return {edges, nodes}
    }


    node(value) {
        Object.assign(value, {
            fx: null,
            fy: null,
            selected: false,
            x: 0, y: 0,
        })
        return value
    }


    /**
     * The network is kept in state in d3 format, because d3-force
     * is used to represent the network layout. This is only used
     * on the CA11 side.
     * @param {*} id - The node id.
     */
    removeNode(id) {
        for (const [index, node] of this.state.nodes.entries()) {
            if (node.id === id) {
                for (const [_index, edge] of this.state.edges.entries()) {
                    if (edge.source.index === index || edge.target.index === index) {
                        this.state.edges.splice(_index, 1)
                    }
                }

                this.state.nodes.splice(index, 1)
            }
        }
    }
}

module.exports = D3
