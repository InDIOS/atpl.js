var assert = require('assert')

var StringReader = require('../lib/lexer/StringReader')
var ExpressionTokenizer = require('../lib/lexer/ExpressionTokenizer')
var TokenReader = require('../lib/lexer/TokenReader')
var ExpressionParser = require('../lib/parser/ExpressionParser')
describe("ExpressionParser", function () {
    it('operator precedence simple test', function () {
        var expressionParser = new ExpressionParser.ExpressionParser(new TokenReader.TokenReader(new ExpressionTokenizer.ExpressionTokenizer(new StringReader.StringReader('1 + 2 * 3 + 1')).tokenize()));
        var parseNode = expressionParser.parseExpression();
        assert.equal('((1 + (2 * 3)) + 1)', parseNode.generateCode());
    });
    it('array definition test', function () {
        var expressionParser = new ExpressionParser.ExpressionParser(new TokenReader.TokenReader(new ExpressionTokenizer.ExpressionTokenizer(new StringReader.StringReader('[1, (2 + 3), -4]')).tokenize()));
        var parseNode = expressionParser.parseExpression();
        assert.equal('[1, (2 + 3), -(4)]', parseNode.generateCode());
    });
});