var m_dfdJsonEditor;
function loadJsonEditorLib()
{
	if (m_dfdJsonEditor == null) {
		m_dfdJsonEditor = $.when(WUI.loadScript("lib/jsoneditor.min.js"), WUI.loadScript("lib/jsoneditor-cn.js"));
		m_dfdJsonEditor.then(initJsonEditor);
	}
	return m_dfdJsonEditor;
}

function initJsonEditor()
{
	// 为JSONEditor扩展onNotify回调
	var oldfn = JSONEditor.prototype.notifyWatchers;
	JSONEditor.prototype.notifyWatchers = notifyWatchers;
	JSONEditor.prototype.getEditorByDom = getEditorByDom;

	// hack: 允许在title/description中出现html
	window.DOMPurify = {
		sanitize: function (e) { return e }
	};

	// hack: 支持onNotify回调
	function notifyWatchers(path) {
//		console.log('change', path, this);
		var ed = this.getEditor(path);
		if (ed && ed.options) {
			if (ed.options.onNotify) {
				var isManualChange = event && event.type == "change";
				var val = ed.options.onNotify.call(ed, ed.getValue(), isManualChange);
				if (val !== undefined) {
					ed.header_text = val;
					ed.updateHeaderText();
				}
			}
		}
		oldfn.call(this, path);
	}

	function getEditorByDom(dom) {
		var jo = $(dom).closest("[data-schemapath]");
		return this.getEditor(jo.attr("data-schemapath"));
	}
}
