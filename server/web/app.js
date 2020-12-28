var m_dfdJsonEditor;
function loadJsonEditorLib()
{
	if (m_dfdJsonEditor == null) {
		m_dfdJsonEditor = WUI.loadScript("lib/jsoneditor.min.js");
	}
	return m_dfdJsonEditor;
}
