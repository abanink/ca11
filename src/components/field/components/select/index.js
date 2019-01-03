module.exports = (app, base) => {
    /**
    * @memberof fg.components
    */
    const FieldSelect = {
        extends: base,
        methods: {
            emptySelectOption: function() {
                // Handle syncing an empty option to the model.
                let emptyOption = {id: null, name: null}
                // Use the first option to determine additional keys.
                if (this.options.length) {
                    for (let key of Object.keys(this.options[0])) {
                        emptyOption[key] = null
                    }
                }
                return emptyOption
            },
            updateModel: function(event) {
                let value = event.target.value
                if (!value) {
                    this.$emit('input', this.emptySelectOption())
                } else {
                    for (const option of this.options) {
                        if (option.id === value) {
                            this.$emit('input', app.utils.copyObject(option))
                        }
                    }
                }
            },
        },
        props: {
            empty: {
                default: app.$t('no options available'),
                type: String,
            },
            idfield: {
                default: 'id',
            },
            options: {
                default: () => [],
                type: Array,
            },
            placeholder: String,
            value: Object,
        },
        render: templates.field_select.r,
        staticRenderFns: templates.field_select.s,
    }

    return FieldSelect
}
