// opt: {schema, jsonValue, onSetJson, jsonEditorOpt?, ...} 
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
		$.extend(opt, {modal:true, dialogOpt:{maximized:true}});
		console.log(opt);

		var jo = jdlg.find(".jsonEditor");
		jo.empty();

		var editorOpt = $.extend({theme: "bootstrap4", iconlib: "fontawesome4", schema: opt.schema}, opt.editorOpt);
		jsonEditor_ = new JSONEditor(jo[0], editorOpt);
		opt_ = opt;
		setTimeout(onShow);

		function onShow() {
			if (opt.jsonValue) {
				var val = opt.jsonValue;
				if (typeof(val) == "string") {
					// NOTE: 如果捕获异常, 则打印出来无法得到原始JSON数据中的错误点
// 					try {
						val = eval("(" + opt.jsonValue + ")");
						jsonEditor_.setValue(val);
// 					} catch (ex) {
// 						console.error(ex);
// 						app_alert("JSON值无效!", "e");
// 					}
				}
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

