WUI.m_enhanceFn[".wui-jsonEditor"] = function (jo) {
	var jo_opt = WUI.getOptions(jo);
	var jdlg = jo.closest(".wui-dialog");
	var jval = jo.find("textarea:first");
	if (jo_opt.input === false) {
		jo.find(":input:first, .btnEdit, .btnFormat").hide();
	}
	jo.find(".btnEdit").click(function () {
		jval.prop("disabled", false);
	});
	jo.find(".btnEditJson").click(btnEditJson_click);
	jo.find(".btnFormat").click(btnFormat_click);

	jdlg.on("beforeshow", onBeforeShow)
	function onBeforeShow(ev, formMode, opt) 
	{
		setTimeout(onShow);
		function onShow() {
			jval.prop("disabled", formMode == FormMode.forSet);
		}
	}

	function btnFormat_click(ev) {
		var val = jval.val();
		var o = eval("(" + val + ")");
		onSetJson(o);
	}

	function btnEditJson_click(ev) {
		var url = jo_opt.schema || $(this).data("schema");
		WUI.assert(url);
		DlgJson.show(url, jval.val(), onSetJson);
	}

	function onSetJson(data) {
		var str = JSON.stringify(data, null, 2);
		jval.prop("disabled", false);
		jval.val(str);
	}
};

var DlgJson = {
	show: function (schemaUrl, initValue, onSetJson, dlgOpt) {
		WUI.loadJson(schemaUrl, function (data) {
			var editorOpt = data.schema? data: { schema: data };
			editorOpt.startval = initValue;
			WUI.showDlg("#dlgJson", $.extend({
				onSetJson: onSetJson,
				editorOpt: editorOpt,
				dialogOpt: {maximized: true}
			}, dlgOpt));
		});
	}
}
