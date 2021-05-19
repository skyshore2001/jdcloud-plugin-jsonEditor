// opt: {onSetJson, editorOpt?, ...} 
function initDlgJson()
{
	var jdlg = $(this);
	jdlg.on("beforeshow", onBeforeShow)
		.on("validate", onValidate);

	var frm = jdlg.find("form:first")[0];
	var jsonEditor_;
	var opt_;

	function onBeforeShow(ev, formMode, opt) 
	{
		var jo = jdlg.find(".jsonEditor");
		jo.empty();

		opt_ = opt;
		setTimeout(onShow);

		function onShow() {
			var startval = opt.editorOpt && opt.editorOpt.startval;
			if (typeof(startval) == "string" && startval.length > 0) {
				console.log(startval);
				startval = opt.editorOpt.startval = eval("(" + startval + ")");
			}
			if (startval === null || startval === "")
				delete opt.editorOpt.startval;
			var editorOpt = $.extend({
				theme: "bootstrap4",
				iconlib: "fontawesome4", 
				remove_empty_properties: true,
				use_default_values: false,
				show_opt_in: true
			}, opt.editorOpt);
			jsonEditor_ = new JSONEditor(jo[0], editorOpt);
			if (editorOpt.onReady) {
				jsonEditor_.on("ready", function () {
					editorOpt.onReady.call(this);
				});
			}
			// onClick回调
			$(jsonEditor_.root_container).on("click", function (ev) {
				var ed = jsonEditor_.getEditorByDom(ev.target);
				if (ed && ed.options && ed.options.onClick) {
					ed.options.onClick.call(ed, ev);
				}
			});
			window.jsonEditor = jsonEditor_; // 便于全局调试
		}
	}

	function onValidate(ev, mode, oriData, newData) 
	{
		if (opt_.onSetJson) {
			var data = jsonEditor_.getValue();
			opt_.onSetJson(data);
		}
		WUI.closeDlg(jdlg);
	}
}

