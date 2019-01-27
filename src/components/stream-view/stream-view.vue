<transition-group name="tr-stream" class="c-stream-view" :class="classes('component')" tag="component">
    <div :key="slot.id" class="slot" v-for="(slot, index) in slots">

        <div v-if="slot.type === 'placeholder'"  class="c-stream placeholder">
            <icon class="c-stream__icon" name="logo"/>
            <div class="content">
                <div class="c-stream__slot">{{index + 1}}</div>
            </div>
        </div>
        <Stream :stream="slot" v-else/>
    </div>
</transition-group>

