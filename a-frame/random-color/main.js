AFRAME.registerComponent('random-color', {
    init: function () {
        this.counter = 0;
    },
    tick: function (time, timeDelta) {
        this.counter += timeDelta;

        if (this.counter > 1000) {
            this.counter = 0;

            var el = this.el;
            var mesh = el.getObject3D('mesh');
            var color = mesh.material.color;
            color.r = Math.random();
            color.g = Math.random();
            color.b = Math.random();
        }
    }
});
