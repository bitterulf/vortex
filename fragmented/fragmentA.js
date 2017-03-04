var fragmentA = {
	oncreate: function(vnode) {
		// console.log(vnode.dom);
		// vnode.dom.innerHTML = '->->';
    },
    view: function(vnode) {
        return m("div", "i am fragment A")
    }
}
