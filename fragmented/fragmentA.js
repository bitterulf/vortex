var fragmentA = {
	oncreate: function (vnode) {
		// console.log(vnode.dom);
		// vnode.dom.innerHTML = '->->';
		vnode.state.active = false;
		vnode.attrs.listen('clicked', function(data) {
			if (data.origin == 'fragmentA') {
				vnode.state.active = !vnode.state.active;
			}
		});
		vnode.attrs.listenBackend('info', function(data) {
			console.log(data.message);
		});
	},
	view: function (vnode) {
		return [
			m('link', {
				rel: 'stylesheet',
				href: 'fragmentA.css'
			}),
			m(".row",
				m(".col-xs-2", [
					m("button.btn.btn-lg.btn-block[type='button']", {
						class: vnode.state.active ? 'btn-primary' : 'btn-default',
						onclick: function() {
							vnode.attrs.dispatch('clicked', {});
							vnode.attrs.dispatchBackend('clicked', {});
						}
					}, [
						m("span.glyphicon.glyphicon-search[aria-hidden='true']")
					])
				]),
				m(".col-xs-10", [
					m("p", "fooo")
				])
			)
		];
	}
}
