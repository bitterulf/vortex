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

        var switchColorHandler = function() {
            this.startColor = this.destinationColor;
            this.destinationColor = this.randomColor();
        };

        this.el.addEventListener('switchColor', switchColorHandler.bind(this));
    },
    tick: function (time, timeDelta) {
        this.counter += timeDelta;

        if (this.counter > this.data.interval) {
            this.counter = 0;
            this.el.dispatchEvent(new Event('switchColor'));
        }

        var el = this.el;
        var mesh = el.getObject3D('mesh');
        mesh.material.color = this.interpolateColor(this.startColor, this.destinationColor, this.counter / this.data.interval);
    }
});

AFRAME.registerComponent('cursor-listener', {
	init: function () {
		this.el.addEventListener('click', function (evt) {
			console.log('I was clicked at: ', evt.detail.intersection.point);
		});
	}
});

window.onload = function() {
    console.log(document.querySelectorAll('[random-color]'));

    var entity = document.querySelector('a-entity#foo');

    entity.addEventListener('stateadded', function (evt) {
        if (evt.detail.state === 'selected') {
            console.log('Entity now selected!');
        }
    });

    entity.addEventListener('startEngine', function (evt) {
        console.log('engine starting');
    });

    entity.addState('selected');
    entity.emit('startEngine');
    console.log(entity.is('selected'));

    entity.setAttribute('description', 'i am just an example');
};
