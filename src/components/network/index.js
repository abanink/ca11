module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const Network = {
        beforeDestroy() {
            window.removeEventListener('resize', this.onResizeHandler)
        },
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

        },
        data: function() {
            return {
                currentMove: null,
                height: 0,
                padding: 15,
                simulation: null,
                width: 0,
            }
        },
        methods: {
            classes(block, modifier) {
                const classes = {}
                if (block === 'node') {
                    classes.super = modifier.super
                    if (modifier.id === app.state.user.identity.publicKey) {
                        classes.own = true
                    }
                }
                return classes
            },
            color(node) {
                // if (node.id === app.state.user.identity.publicKey) return '#601111'
                // console.log(node)
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
            onResize() {
                this.width = this.$refs.container.clientWidth
                this.height = this.$refs.container.clientHeight
            },
            simulate: function() {
                if (this.simulation) this.simulation.stop()
                this.simulation = d3.forceSimulation(this.nodes, this.links)
                    .force('charge', d3.forceManyBody())
                    .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                    .force('link', d3.forceLink(this.edges).distance(100).strength(0.1))

                this.simulation.restart()
            },
        },
        mounted: function() {
            this.onResizeHandler = this.onResize.bind(this)
            this.onResize()

            window.addEventListener('resize', this.onResizeHandler)
            this.simulate()
        },
        render: templates.network.r,
        staticRenderFns: templates.network.s,
        store: {
            edges: 'calls.sig11.network.edges',
            nodes: 'calls.sig11.network.nodes',
        },
        watch: {
            nodes: function() {
                this.simulation.nodes(this.nodes)
            },
        },
    }

    return Network
}
