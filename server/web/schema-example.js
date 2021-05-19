// refer to: https://github.com/json-editor/json-editor
{
	title: "型号配置",
	type: "object",
	properties: {
		recipesBurnType: {
			title: "recipesBurnType/烧录类型",
			type: "string",
			required: true,
			description: "示例: <code>`xxxx`</code>"
		},
		supportBadPixel: {
			title: "supportBadPixel/支持坏点校正",
			type: "boolean"
		},
		precision: {
			title: "precision/标温精度",
			type: "number",
			format: "number"
		},
		connectType: {
			title: "connectType/连接类型",
			type: "string",
			enum: ["USB","ZUSB","NET"],
			default: "ZUSB"
		},
		material: {
			title: "material/资料",
			type: "array", // "tabs", "tabs-top"
			format: "table",
			items: {
				title: "资料",
				type: "object",
				// headerTemplate: "{{self.name}}",
				properties: {
					index: {
						title: "index/索引号",
						type: "integer",
						format: "number"
					},
					name: {
						title: "name/名称",
						type: "string"
					}
				}
			}
		}
	}
}
