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

        this.interpolateColor = function(color1, color2, value) {
            return {
                r: color1.r + (color2.r - color1.r) * value,
                g: color1.g + (color2.g - color1.g) * value,
                b: color1.b + (color2.b - color1.b) * value
            }
        };

        this.counter = 0;
        this.startColor = this.randomColor();
        this.destinationColor = this.randomColor();
    },
    tick: function (time, timeDelta) {
        this.counter += timeDelta;

        if (this.counter > this.data.interval) {
            this.counter = 0;
            this.startColor = this.destinationColor;
            this.destinationColor = this.randomColor();
        }

        var el = this.el;
        var mesh = el.getObject3D('mesh');
        mesh.material.color = this.interpolateColor(this.startColor, this.destinationColor, this.counter / 1000);
    }
});
