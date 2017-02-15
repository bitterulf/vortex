AFRAME.registerComponent('random-color', {
    init: function () {
        var el = this.el;
        var mesh = el.getObject3D('mesh');
        var color = mesh.material.color;
        color.r = Math.random();
        color.g = Math.random();
        color.b = Math.random();
    }
});
