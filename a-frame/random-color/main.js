AFRAME.registerComponent('random-color', {
    schema: {
        interval: {type: 'int', default: 1000}
    },
    init: function () {
        this.randomColor = function() {
            return {
                r: Math.random(),
                g: Math.random(),
                b: Math.random()
            }
        };
        this.counter = 0;
    },
    tick: function (time, timeDelta) {
        this.counter += timeDelta;

        if (this.counter > this.data.interval) {
            this.counter = 0;

            var el = this.el;
            var mesh = el.getObject3D('mesh');
            mesh.material.color = this.randomColor();
        }
    }
});
