
module.exports = function (node) { return (types[node.type] || clean)(node) }

function clean (node) { return node.type.replace(/Statement$/, "").replace(/Expression$/, "") }

function left (n) {
  if (n.type === "Identifier") { return "Identifier" }
  if (n.type === "MemberExpression") { return "Member" }
  throw new Error("Unexpected left-hand side: "+n.type)
}

var types = {
  Identifier:           function (n) { return "Identifier" },
  Debugger:             function (n) { return "Debugger" },
  LabeledStatement:     function (n) { return "Label" },
  Literal:              function (n) { return "Literal" },
  FunctionDeclaration:  function (n) { return "Definition" },
  VariableDeclaration:  function (n) { return "Declaration" },
  AssignmentExpression: function (n) { return left(n.left)+(n.operator==="="?"":"Binary")+"Assignment" },
  UpdateExpression:     function (n) { return left(n.argument)+"Update" },
  ExpressionStatement:  function (n) { return (n.expression.value === "use strict" ? "Strict" : "Expression") },
  ForStatement:         function (n) { return (n.init&&n.init.type==="VariableDeclaration") ? "DeclarationFor" : "For" },
  ForInStatement:       function (n) { return (n.left.type === "VariableDeclaration" ? "Declaration" : left(n.left)) + "ForIn" },
  CallExpression:       function (n) { return (n.callee.name === "eval" ? "Eval" : (n.callee.type === "MemberExpression" ? "Member" : "")) + "Call" },
  UnaryExpression:      function (n) {
    if (n.operator === "typeof" && n.argument.type === "Identifier") { return "IdentifierTypeof" }
    if (n.operator === "delete" && n.argument.type === "Identifier") { return "IdentifierDelete" }
    if (n.operator === "delete" && n.argument.type === "MemberExpression") { return "MemberDelete" }
    return "Unary"
  }
}
