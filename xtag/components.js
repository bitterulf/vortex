xtag.register('x-frame', {
	lifecycle: {
		created: function() {
			this.innerHTML = '<div style="border: 1px solid red; padding: 8px;"><h1>'+this.attributes.title.value+'</h1><div>'+this.innerHTML+'</div></div>';
		}
	}
});

xtag.register('x-item', {
	lifecycle: {
		created: function() {
			this.innerHTML = '<div style="border: 1px solid blue; padding: 4px;"><h2>'+this.attributes.title.value+'</h2><div>'+this.innerHTML+'</div></div>';
		}
	}
});

xtag.register('x-button', {
	lifecycle: {
		created: function() {
			this.innerHTML = '<input type="button" value="'+this.innerHTML.trim()+'">';

			this.querySelector('input').onClick = function() {
				xtag.fireEvent(this, 'click', {
				});
			}
		}
	}
});
