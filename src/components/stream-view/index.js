module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const slotSize = 6
    let slots = []
    for (let i = 0; i < slotSize; i++) {
        slots.push({
            id: shortid(),
            type: 'placeholder',
        })
    }

    const StreamView = {
        computed: Object.assign({
            /**
             * The selected property is a timestamp when set,
             * so the selected streams can be ordered
             * accordingly.
             * @returns {Array} - Selected streams ordered by selection time.
             */
            slots: function() {
                let activeSlots = []
                const localStream = this.stream[this.stream.type]
                if (localStream.selected && localStream.id) {
                    activeSlots.push(localStream)
                }
                if (this.call) {
                    // const streams = Object.values(this.call.streams).filter((i) => {
                    //     return i.selected && slots.find((j) => j.id === i.id)
                    // })

                    const streams = Object.values(this.call.streams).filter((i) => i.selected)

                    activeSlots = activeSlots.concat(streams)
                }

                activeSlots.sort((a, b) => {
                    if (a.selected < b.selected) return -1
                    if (a.selected > b.selected) return 1
                    return 0
                })

                // slotCache = []
                // for (const [index, stream] of streamSlots.entries()) {
                //     slotCache.push(slots[index])
                //     slots[index] = stream
                // }

                if (activeSlots.length < slotSize) {
                    for (let i = activeSlots.length; i < slotSize; i++) {
                        activeSlots.push(slots[i])
                    }
                }


                return activeSlots
            },
        }, app.helpers.sharedComputed()),
        methods: {
            classes: function(block) {
                const classes = {}
                // if (block === 'component') {
                //     classes[`x${this.selectedStreams.length}`] = true
                // }
                return classes
            },
        },
        mounted: function() {
            // Start with a selected local stream.
            this.stream.selected = true
        },
        props: ['call'],
        render: templates.stream_view.r,
        staticRenderFns: templates.stream_view.s,
        store: {
            stream: 'settings.webrtc.media.stream',
        },
    }

    return StreamView
}
