WUI.m_enhanceFn[".wui-jsonEditor"] = function (jo) {
	var jdlg = jo.closest(".wui-dialog");
	var jval = jo.find("textarea:first");
	jo.find(".btnEdit").click(function () {
		jval.prop("disabled", false);
	});
	jo.find(".btnEditJson").click(btnEditJson_click);
	jo.find(".btnFormat").click(btnFormat_click);

	jdlg.on("beforeshow", onBeforeShow)
	function onBeforeShow(ev, formMode, opt) 
	{
		jval.prop("disabled", formMode == FormMode.forSet);
	}

	function btnFormat_click(ev) {
		var val = jval.val();
		var o = eval("(" + val + ")");
		onSetJson(o);
	}

	function btnEditJson_click(ev) {
		var url = $(this).data("schema");
		WUI.assert(url);
		WUI.loadJson(url, function (data) {
			var val = jval.val();
			WUI.showDlg("#dlgJson", {
				schema: data,
				jsonValue: val,
				onSetJson: onSetJson
			});
		});
	}

	function onSetJson(data) {
		var str = JSON.stringify(data, null, 2);
		jval.prop("disabled", false);
		jval.val(str);
	}
};
