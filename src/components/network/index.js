module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Network = {
        computed: {
            bounds() {
                return {
                    maxX: Math.max(...this.nodes.map(n => n.x)),
                    maxY: Math.max(...this.nodes.map(n => n.y)),
                    minX: Math.min(...this.nodes.map(n => n.x)),
                    minY: Math.min(...this.nodes.map(n => n.y)),
                }
            },
            coords() {
                return this.nodes.map(node => {
                    return {
                        x: this.padding + (node.x - this.bounds.minX) * (this.width - 2 * this.padding) / (this.bounds.maxX - this.bounds.minX),
                        y: this.padding + (node.y - this.bounds.minY) * (this.height - 2 * this.padding) / (this.bounds.maxY - this.bounds.minY),
                    }
                })
            },
        },
        created() {
            this.simulation = d3.forceSimulation(this.nodes)
                .force('link', d3.forceLink(this.links).distance(100).strength(0.1))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                // .force('x', d3.forceX())
                // .force('y', d3.forceY())
        },
        data: function() {
            return {
                currentMove: null,
                height: 0,
                links: [
                    {source: {index: 0}, target: {index: 1}},
                    {source: {index: 1}, target: {index: 2}},
                ],
                nodes: [
                    {id: 'Alice', selected: false, super: false, x: null, y: null},
                    {id: 'Bob', selected: false, super: true, x: null, y: null},
                    {id: 'Carol', selected: false, super: false, x: null, y: null},
                ],
                padding: 20,
                simulation: null,
                width: 0,
            }
        },
        methods: {
            color(node) {
                if (!node.selected) return '#aaaaaa'
                else return '#601111'
            },
            drag(e) {
                if (this.currentMove) {
                    this.currentMove.node.fx = (
                        this.currentMove.node.x - (this.currentMove.x - e.screenX) *
                        (this.bounds.maxX - this.bounds.minX) / (this.width - 2 * this.padding)
                    )
                    this.currentMove.node.fy = (
                        this.currentMove.node.y - (this.currentMove.y - e.screenY) *
                        (this.bounds.maxY - this.bounds.minY) / (this.height - 2 * this.padding)
                    )
                    this.currentMove.x = e.screenX
                    this.currentMove.y = e.screenY
                }
            },
            drop() {
                delete this.currentMove.node.fx
                delete this.currentMove.node.fy
                this.currentMove = null
                this.simulation.alpha(1)
                this.simulation.restart()
            },
        },
        mounted: function() {
            this.width = this.$refs.container.clientWidth
            this.height = this.$refs.container.clientHeight

            // Add new node

            // setInterval(() => {
            //     this.nodes.push({id: shortid(), selected: false, super: false, x: null, y: null})
            //     this.simulation.nodes(this.nodes)
            // }, 1000)
        },
        render: templates.network.r,
        staticRenderFns: templates.network.s,
    }

    return Network
}
