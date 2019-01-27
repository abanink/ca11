
<component class="c-network">

    <div class="svg-container" ref="container">
        <svg xmlns="http://www.w3.org/2000/svg"
            :width="width+'px'"
            :height="height+'px'"
            @mousemove="drag($event)"
            @mouseup="drop()"
            v-if="bounds.minX"
        >

            <line v-for="link in links"
                :x1="coords[link.source.index].x"
                :y1="coords[link.source.index].y"
                :x2="coords[link.target.index].x"
                :y2="coords[link.target.index].y"
                stroke="#aaa" stroke-width="2"
            />

            <circle
                v-for="(node, i) in nodes"
                :cx="coords[i].x"
                :cy="coords[i].y"
                :r="node.super ? 20 : 10"
                :fill="color(node)"
                stroke="white"
                stroke-width="1"
                @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"
            />

        </svg>
    </div>

</component>
