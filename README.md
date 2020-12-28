# JSON配置编辑器

集成jsoneditor库，用于编辑复杂配置项：https://github.com/json-editor/json-editor

## 用法

安装：

	./tool/jdcloud-plugin.sh add ../jdcloud-plugin-jsonEditor

插件会自动添加bootstrap库到文件系统。在store.html中添加引入bootstrap库用于美化编辑器风格：

	<link rel="stylesheet" type="text/css" href="lib/bootstrap.min.css" />

在逻辑页对话框中使用示例：page/dlgOrderConfRule.html

		<tr>
			<td>配置值</td>
			<td class="wui-jsonEditor">
				<textarea name="value" rows=14></textarea>
				<p class="hint">
					<a class="easyui-linkbutton btnEdit" data-options="iconCls: 'icon-edit'" href="javascript:;">修改</a>
					<a class="easyui-linkbutton btnFormat" data-options="iconCls: 'icon-reload'" href="javascript:;">格式化JSON</a>
					<a class="easyui-linkbutton btnEditJson" data-options="iconCls: 'icon-edit'" data-schema="schema-example.js" href="javascript:;">配置系列</a>
				</p>
			</td>
		</tr>

标识类wui-jsonEditor已被定义为组件，其下面的标识类btnEdit, btnFormat和btnEditJson的三个类自动绑定了相应的操作。
其中btnEditJson则是弹出新的窗口，在该窗口中编辑配置。
配置项的schema定义由`data-schema`属性定义，示例见web/schema-example.js。

