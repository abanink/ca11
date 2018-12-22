module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallTransfer = {
        methods: {
            classes: function(block) {
                let classes = {}
                if (block === 'attended-button') {
                    classes.active = (this.call.transfer.type === 'attended')
                } else if (block === 'blind-button') {
                    classes.active = (this.call.transfer.type === 'blind')
                    classes.disabled = (this.transferStatus !== 'select')
                }

                return classes
            },
            transferMode: function(type) {
                if (this.transferStatus !== 'select') return
                app.setState({transfer: {type}}, {path: `calls.calls.${this.call.id}`})
            },
        },
        props: ['call'],
        render: templates.call_transfer.r,
        staticRenderFns: templates.call_transfer.s,
        store: {
            description: 'calls.description',
        },
    }

    return CallTransfer
}
