// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed

// /**
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "vscode-color-empty-lines-please" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('vscode-color-empty-lines-please.helloWorld', function () {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from vscode-color-empty-lines-please!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// function deactivate() {}

// module.exports = {
// 	activate,
// 	deactivate
// }

const vscode = require('vscode');

let colorEmptyLinesEnabled = false;
let decorationType;

function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.toggleEmptyLineColors', () => {
			colorEmptyLinesEnabled = !colorEmptyLinesEnabled;
			if (colorEmptyLinesEnabled) {
				activateEmptyLineColors();
			} else {
				deactivateEmptyLineColors();
			}
		})
	);

	// Initially, you can set colorEmptyLinesEnabled to true if you want it enabled by default.
}

function activateEmptyLineColors() {
	if (!decorationType) {
		decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: 'rgba(211, 211, 211, 0.3)', // Choose your desired color
			isWholeLine: true,
		});
	}

	vscode.window.visibleTextEditors.forEach((editor) => {
		if (colorEmptyLinesEnabled) {
			colorEmptyLines(editor);
		}
	});

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (colorEmptyLinesEnabled && editor) {
			colorEmptyLines(editor);
		}
	});
}

function deactivateEmptyLineColors() {
	if (decorationType) {
		decorationType.dispose();
		decorationType = undefined;
	}
}

function colorEmptyLines(editor) {
	const emptyLineRanges = [];

	for (let line = 0; line < editor.document.lineCount; line++) {
		const text = editor.document.lineAt(line).text;
		if (text.trim() === '') {
			const range = new vscode.Range(line, 0, line, 0); // Extend the range to cover the entire line
			emptyLineRanges.push(range);
		}
	}

	editor.setDecorations(decorationType, emptyLineRanges);
}

module.exports = {
	activate,
};
