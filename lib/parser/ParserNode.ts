///<reference path='../imports.d.ts'/>

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export export class ParserNode {
	generateCode() {
		return '<invalid>';
	}

	optimize() {
		return this;
	}
}

export export class ParserNodeExpression extends ParserNode {
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeContainer extends ParserNode {
	nodes:ParserNode[] = [];

	add(node) {
		this.nodes.push(node);
	}

	generateCode() {
		var output = '';
		for (var n in this.nodes) {
			output += this.nodes[n].generateCode();
		}
		return output;
	}
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeArrayContainer extends ParserNodeExpression {
	constructor(private nodes: ParserNodeExpression[]) {
		super();
	}

	generateCode() {
		var list = [];
		for (var n in this.nodes) {
			list.push(this.nodes[n].generateCode());
		}
		return '[' + list.join(', ') + ']';
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeLiteral extends ParserNodeExpression {
	constructor(public value: any) {
		super();
	}

	generateCode() {
		return JSON.stringify(this.value);
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeIdentifier extends ParserNodeExpression {
	constructor(public value: string) {
		super();
	}

	generateCode() {
		return 'runtimeContext.scope.' + this.value;
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeCommaExpression extends ParserNode {
	constructor(public expressions: ParserNodeExpression[]) {
		super();
	}

	generateCode() {
		return this.expressions.map((item) => item.generateCode()).join(', ');
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeFunctionCall extends ParserNodeExpression {
	constructor(public functionExpr: ParserNodeExpression, public arguments: ParserNodeCommaExpression) {
		super();
	}

	generateCode() {
		return 'runtimeContext.call(' + this.functionExpr.generateCode() + ', [' + this.arguments.generateCode() + '])';
	}
}

export class ParserNodeFilterCall extends ParserNodeExpression {
	constructor(public filterName: string, public arguments: ParserNodeCommaExpression) {
		super();
	}

	generateCode() {
		return 'runtimeContext.filter(' + JSON.stringify(this.filterName) + ', [' + this.arguments.generateCode() + '])';
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeUnaryOperation extends ParserNode {
	constructor(public operation: string, public right: ParserNode) {
		super();
	}

	generateCode() {
		return this.operation + this.right.generateCode();
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeBinaryOperation extends ParserNode {
	constructor(public operation, public left, public right) {
		super();
	}

	generateCode() {
		return (
			'(' +
				this.left.generateCode() +
				' ' + this.operation  + ' ' +
				this.right.generateCode() +
			')'
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeTernaryOperation extends ParserNode {
	constructor(public cond: ParserNode, public exprTrue: ParserNode, public exprFalse: ParserNode) {
		super();
	}

	generateCode() {
		return (
			'(' +
				this.cond.generateCode() + 
				"? " + this.exprTrue.generateCode() +
				": " + this.exprFalse.generateCode() +
			')'
		);
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ParserNodeOutputText extends ParserNode {
	constructor(public text) {
		super();
	}

	generateCode() {
		return 'runtimeContext.write(' + JSON.stringify(this.text) + ');';
	}
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
