module.exports = (app, base) => {
    /**
    * @memberof fg.components
    */
    const FieldCheckbox = {
        extends: base,
        methods: {
            updateModel: function(event) {
                console.log("UPDATE")
                this.$emit('input', event.target.checked)
            },
        },
        props: {
            value: '',
        },
        render: templates.field_checkbox.r,
        staticRenderFns: templates.field_checkbox.s,
    }

    return FieldCheckbox
}
