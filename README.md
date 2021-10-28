# JSON配置编辑器

集成jsoneditor库，用于编辑复杂配置项：https://github.com/json-editor/json-editor

## 用法

安装：

	./tool/jdcloud-plugin.sh add ../jdcloud-plugin-jsonEditor

插件会自动添加bootstrap库到文件系统。在store.html中添加引入bootstrap库用于美化编辑器风格：

	<link rel="stylesheet" type="text/css" href="lib/bootstrap.min.css" />

此外，插件还依赖于图标库font-awesome.css (4.x版本)以及相关字体库(font-icon/fonts/ttf,svg等)，由于jdcloud中默认有此库，无须再引入。

在逻辑页对话框中使用示例：page/dlgOrderConfRule.html

		<tr>
			<td>配置值</td>
			<td class="wui-jsonEditor" data-options="schema:'schema/example.js'">
				<textarea name="value" rows=14></textarea>
				<p class="hint">
					<a class="easyui-linkbutton btnEdit" data-options="iconCls: 'icon-edit'" href="javascript:;">修改</a>
					<a class="easyui-linkbutton btnFormat" data-options="iconCls: 'icon-reload'" href="javascript:;">格式化JSON</a>
					<a class="easyui-linkbutton btnEditJson" data-options="iconCls: 'icon-edit'" href="javascript:;">配置</a>
				</p>
			</td>
		</tr>

注意：在data-options中设置`schema:'schema/example.js'`，由该文件定义JSON格式。
为了兼容，也支持在配置按钮（CSS类为btnEditJson）上指定schema：

					<a class="easyui-linkbutton btnEditJson" data-options="iconCls: 'icon-edit'" data-schema="schema/example.js" href="javascript:;">配置</a>

如果想不显示JSON内容，只显示编辑按钮，这时在data-options中设置`input:false`：

		<tr>
			<td>配置值</td>
			<td class="wui-jsonEditor" data-options="schema:'schema/example.js', input:false">
				<textarea name="value" rows=14></textarea>
				<p class="hint">
					<a class="easyui-linkbutton btnEditJson" data-options="iconCls: 'icon-edit'" href="javascript:;">配置</a>
				</p>
			</td>
		</tr>


标识类wui-jsonEditor已被定义为组件，其下面的标识类btnEdit, btnFormat和btnEditJson的三个类自动绑定了相应的操作。
其中btnEditJson则是弹出新的窗口，在该窗口中编辑配置。
配置项的schema定义由`data-schema`属性定义，示例见web/schema-example.js。

wui-jsonEditor组件有以下事件：

- retdata(ev, data): data为关闭对话框时设置的JSON对象（不是字符串），可修改。

## schema文件格式及常用配置值

schema文件一般存为 schema/xx.js，是一个返回js对象的脚本，它比普通JSON文件更灵活。
返回的对象可以是JSONEditor支持的schema格式(参见schema-example), 如：

	{
		type: "object",
		title: "XX配置",
		properties: {
			name: {
				type: "string"
			},
			title: {
				type: "string"
			}
		}
	}


也可以是完整的JSONEditor的options，如：

	var schema = {
		type: "object",
		title: "XX配置",
		properties: {
			name: {
				type: "string"
			},
			title: {
				type: "string"
			}
		}
	}

	// 最后返回的JS对象，须用小括号括起来。有schema属性，表示返回的是完整的JSONEditor选项
	({
		no_additional_properties:true,
		schema: schema,
	})

常用的JSONEditor选项有：

- no_additional_properties: 设置为true不允许任意加其它属性
- remove_empty_properties: 设置为true则忽略所有空的属性。
- show_opt_in: 设置为true则缺省显示所有属性，如果是非必选（schema中属性选项`required: true`）属性，则属性前显示勾选框。

也可以设置各级editor选项(可全局设置，也可在schema各级的options中设置)，如对象上

- disable_array_delete_all_rows: true, 不显示删除ALL按钮
- disable_array_delete_last_row: true, 不显示删除Last按钮
- disable_properties: true, 不显示属性框

在schema各级中常用选项：

- defaultProperties: 为object类型指定在未指定值时缺省显示的属性（若想显示所有属性应设置`show_opt_in=true`），要使用其它属性只能从属性列表中手工勾选。示例：`["res", "join", "default"]`
- required: 指定必填属性，这些属性总会显示。

本插件默认设置了如下选项（可在schema文件中再覆盖它们）：

	theme: "bootstrap4",
	iconlib: "fontawesome4", 
	remove_empty_properties: true,
	use_default_values: false,
	show_opt_in: true

## JSONEditor扩展功能

### 监控变化 onNotify(val, isManualChange)

扩展的editor option，在属性变化时回调，常用于某属性变化后修改、隐藏、灰掉另一属性。还可以用于设置title(取代schema的headerTemplate属性，比它更灵活).

注意：由于JSONEditor自带的watch及on('change')等机制不好用，一是难以监测动态添加的数组元素，
二是在新创建、加载初始化、调整数组元素顺序、删除等操作时也会多次调用，且不易区分这些场景，会造成误修改数据。

在实现A属性变化时修改B属性时，若B属性是可以手工修改的，则**一定要加isManualChange**判断条件，否则就会误修改数据，比如修改完关闭窗口后再重新打开窗口，B属性会又被改回默认值。

#### 示例1：修改其它属性

示例：当uiType下拉框变化时，若值为空，则隐藏opt属性。同时，若值修改为"subobj"，则自动将type属性也修改为"subobj"
注意：JSONEditor自带的dependencies机制，但只能根据下拉框（enum）中的具体某个值来隐藏其它属性，不够灵活。

    opt: {
      type: "textarea",
      options: {
        dependencies: {
          uiType: "subobj"
        }
      }
    }

实现：使用onNotify回调：

	...
		type: "object",
		properties: {
			type: {
				title: "类型",
				type: "string",
				enum: [
					"s",
					"i",
					"subobj"
				],
				default: "s",
				options: {
					enum_titles: [
						"s-字符串",
						"i-整数",
						"subobj-子对象"
					]
				}
			},
			uiType: {
				title: "uiType/UI类型",
				type: "string",
				enum: [
					"combo",
					"upload",
					"subobj"
				],
				default: null,
				options: {
					enum_titles: [
						"combo:下拉列表-值映射",
						"upload:图片或文件",
						"subobj:子对象"
					],
					onNotify: function (val, isManualChange) {
						// 获取同级其它editor
						var edOpt = this.parent.editors["opt"];
						// editor可能不存在，比如从properties对话框中没有选择它
						if (edOpt) {
							// 当isManualChange参数为false时，由于其它editor此时可能尚未初始化完，所以对它的操作放在setTimeout中避免出错
							setTimeout(function () {
								// 显示或隐藏元素，用ed.container取到其DOM元素
								$(edOpt.container).toggle(!!val);
								// edOpt.disable();
							});
						}
						// 加isManualChange判断，意味着如果初始化值uiType为subobj但type是其它值，就不会去处理它
						if (isManualChange && val == "subobj") {
							var edType = this.parent.editors["type"];
							edType.setValue("subobj");
						}
					}
				}
			},
			opt: {
				type: "string",
				format: "textarea"
			}
		}

1. 在name.options.onNotify中写逻辑，函数中，this是当前属性（即name属性）的editor，参数val是当前值。
2. 通过`this.parent.editors[属性名]`可以取到同级其它属性的editor。 取全局editor可以用`this.jsoneditor.getEditor("root.0.type")`
3. 通过`ed.setValue(val)`设置值，通过`ed.container`取对应DOM元素。
4. 由于其它属性可能尚未初始化完（操作顺序在当前editor后面的其它editor时），用setTimeout来操作避免出错。

#### 示例2：修改其它属性的默认值

示例：当name修改时，自动根据name填写type默认值。

	{
		type: "array",
		items: {
			title: "字段",
			type: "object",
			properties: {
				name: {
					title: "名称",
					type: "string",
					options: {
						// !!! 在name属性下的options下 !!!
						onNotify: function (val, isManualChange) {
							if (! isManualChange)
								return;
							var typeVal = UiMeta.guessType(val);
							var edType = this.parent.editors["type"];
							edType.setValue(typeVal);
						}
					}
				},
				type: {
					title: "类型",
					type: "string",
				}
			}
		}
	}

由于只是填写默认值，人工可以再修改它。所以必须通过isManualChange判断后再修改，避免初始化、数组移动等操作导致人工修改的值被重置为默认。

#### 示例3：修改标签标题

以tab页签方式显示数组，页签标题为name和type属性拼合而成：

	{
		title: "字段配置",
		type: "array",
		format: "tabs", // tab页签式显示
		items: {
			title: "字段",
			type: "object",
			// headerTemplate: "{{self.name}}({{self.type}})",
			options: {
				// 与上面注释掉的headerTemplate作用相同；函数式处理更灵活，可用于无法简单属性拼接等复杂情形
				onNotify: function (val, isManualChange) {
					return val.name + '(' + val.type + ')';
				},
			},
			properties: {
				name: {
					title: "名称",
					type: "string",
				},
				type: {
					title: "名称",
					type: "string",
				}
			}
		}
	}

此例中设置标题逻辑比较简单，一般建议直接使用JSONEditor默认支持的headerTemplate。

以下是个复杂示例，它根据res数组及join属性，自动生成title，逻辑为：

- 如果join格式为"JOIN Employee ..."，则标题用"Employee"
- 如果没有join，则取res[0]，若格式为"emp.name empName"，则标题用"empName"

		type: "object",
		options: {
			onNotify: function (e, isManualChange) {
				if (e.join && e.join.match(/JOIN\s*(\w+)/i)) {
					return RegExp.$1;
				}
				if (e.res && e.res[0] && e.res[0].match(/(\w+)$/)) {
					return RegExp.$1;
				}
			}
		}

### onClick(ev) 添加自定义按钮并处理事件

示例：为opt属性框添加“查看示例”按钮，点击则根据同级uiType属性的值，自动将示例填入opt属性框

实现：schema/uicols.js中定义如下：

			title: "字段",
			type: "object",
			properties: {
				...
				uiType: {
					title: "uiType/UI类型",
					type: "string",
					enum: [
						"combo",
						"subobj"
					],
					default: null,
				},
				opt: {
					title: "opt/配置代码",
					type: "string",
					format: "textarea",
					options: {
						input_height: "200px",
						onClick: function (ev) {
							if ($(ev.target).is(".btnExample")) {
								var field = this.parent.getValue();
								this.setValue(examples[field.uiType]);
							}
						}
					},
					description: "<a class='easyui-linkbutton btnExample' href='javascript:;'>查看示例</a>"
				}
			}

- 在opt属性的description中定义按钮，例如可以用easyui link-button组件。（为支持这一点，插件对JSONEditor做了定制，hack了DOMPurify类，但有被XSS攻击风险）
- onClick的ev参数与jQuery中一致，通过检查`ev.target`是哪个按钮来绑定按钮。

### 其它扩展功能

- 从DOM到Editor可以用 jsoneditor.getEditorByDom(dom); 
- Editor到DOM可以用 ed.container 或 jsoneditor.root_container (顶层editor专用)
- 调试时，打开对话框后，可以在控制台用jsonEditor这个全局实例变量
- jsoneditor增加onReady回调，可从中取到jsoneditor对象及其DOM控件，如：

	({
		schema: ...
		onReady: function () {
			// this: jsoneditor对象
			// this.root_container: DOM对象
		}
	})

