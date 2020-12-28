{
	title: "型号配置",
	type: "object",
	properties: {
		recipesBurnType: {
			title: "烧录类型",
			type: "string"
		},
		supportBadPixel: {
			title: "支持坏点校正",
			type: "boolean"
		},
		material: {
			title: "资料",
			type: "array",
			format: "table",
			items: {
				title: "资料",
				type: "object",
				properties: {
					name: {
						title: "名称",
						type: "string"
					}
				}
			}
		}
	}
}
