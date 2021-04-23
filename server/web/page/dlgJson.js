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

		var startval = opt.editorOpt && opt.editorOpt.startval;
		delete opt.editorOpt.startval;
		var editorOpt = $.extend({
			theme: "bootstrap4",
			iconlib: "fontawesome4", 
			remove_empty_properties: true
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
		opt_ = opt;
		setTimeout(onShow);

		function onShow() {
			if (startval) {
				if (typeof(startval) == "string") {
					// NOTE: 如果捕获异常, 则打印出来无法得到原始JSON数据中的错误点
// 					try {
						startval = eval("(" + startval + ")");
// 					} catch (ex) {
// 						console.error(ex);
// 						app_alert("JSON值无效!", "e");
// 					}
				}
				// jsonEditor_.setValue(startval);
				jsonEditor_.getEditor("root").setValue(startval, true); // 以这种方式初始化，可以显示所有的字段
			}
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

