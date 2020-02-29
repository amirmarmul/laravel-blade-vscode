import * as vscode from 'vscode';
const beautifyHtml = require('js-beautify').html;

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('blade');

function beautify(document: vscode.TextDocument, range: vscode.Range) {
    const result = [];
    let output = '';
    let options = beautifyHtml.defaultOptions;

    options.indent_size = editor.tabSize;
    options.end_with_newline = config.newLine;
    
    options.indent_char = ' ';
    options.extra_liners = [];
    options.brace_style = 'collapse';
    options.indent_scripts = 'normal';
    options.space_before_conditional = true;
    options.keep_array_indentation = false;
    options.break_chained_methods = false;
    options.unescape_strings = false;
    options.wrap_line_length = 0;
    options.jslint_happy = false;
    options.comma_first = true;
    options.e4x = true;

    output = beautifyHtml(document.getText(range), options);

    result.push(vscode.TextEdit.replace(range, output));

    return result;
}


function activate(context: vscode.ExtensionContext) {
	console.log('Laravel blade activated!');

	const LANGUAGES = { scheme: 'file', language: 'blade' };

	if (config.format.enable === true) {
		context.subscriptions.push(
			vscode.languages.registerDocumentFormattingEditProvider(LANGUAGES, {
				provideDocumentFormattingEdits(document: vscode.TextDocument) {
					const start = new vscode.Position(0, 0);
					const end = new vscode.Position(
						document.lineCount - 1,
						document.lineAt(document.lineCount -1).text.length
					);
					const rng = new vscode.Range(start, end);

					return beautify(document, rng);
				}
			})
		);

		context.subscriptions.push(
			vscode.languages.registerDocumentRangeFormattingEditProvider(LANGUAGES, {
					provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range) {
						let end = range.end

						if (end.character === 0) {
							end = end.translate(-1, Number.MAX_VALUE);
						} else {
							end = end.translate(0, Number.MAX_VALUE);
						}

						const rng = new vscode.Range(new vscode.Position(range.start.line, 0), end)

						return beautify(document, rng);
					}
				}
			)
		)
	}
}

function deactivate() {}

export {
	activate,
	deactivate,
}
