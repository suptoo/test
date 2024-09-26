from flask import Flask, render_template_string, request, jsonify
import sys
from io import StringIO

app = Flask(__name__)

HTML = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Phobia Python Compiler</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-language_tools.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        #container {
            display: flex;
            flex-direction: column;
            height: 95vh;
        }
        #editor {
            flex-grow: 1;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #controls {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
        #output {
            height: 200px;
            background-color: #282c34;
            color: #abb2bf;
            padding: 15px;
            border: 1px solid #444;
            border-radius: 4px;
            overflow: auto;
            font-family: monospace;
        }
        button, select {
            font-size: 14px;
            padding: 8px 16px;
            margin: 0 5px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
        }
        button:hover, select:hover {
            background-color: #0056b3;
        }
        #snippetName {
            font-size: 14px;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="controls">
            <div>
                <button onclick="runCode()">Run Code</button>
                <select id="themeSelect" onchange="changeTheme()">
                    <option value="ace/theme/monokai">Monokai</option>
                    <option value="ace/theme/github">GitHub</option>
                    <option value="ace/theme/tomorrow_night">Tomorrow Night</option>
                    <option value="ace/theme/solarized_light">Solarized Light</option>
                </select>
            </div>
           
        </div>
        <div id="editor"></div>
        <pre id="output"></pre>
    </div>
    <script>
        const editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            fontSize: "14px"
        });

        
        editor.setValue(`# Welcome to  LearninGphobia Compailer!


def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
`);

        async function runCode() {
            const code = editor.getValue();
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            const result = await response.json();
            document.getElementById('output').textContent = result.output || result.error;
        }

        function changeTheme() {
            const theme = document.getElementById('themeSelect').value;
            editor.setTheme(theme);
        }

        function saveSnippet() {
            const name = document.getElementById('snippetName').value;
            if (name) {
                const code = editor.getValue();
                localStorage.setItem(name, code);
                alert(`Snippet "${name}" saved!`);
            } else {
                alert("Please enter a name for your snippet.");
            }
        }

        function loadSnippet() {
            const name = document.getElementById('snippetName').value;
            if (name) {
                const code = localStorage.getItem(name);
                if (code) {
                    editor.setValue(code);
                    alert(`Snippet "${name}" loaded!`);
                } else {
                    alert(`No snippet found with name "${name}".`);
                }
            } else {
                alert("Please enter the name of the snippet you want to load.");
            }
        }
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    if not data or 'code' not in data:
        return jsonify({'error': 'Invalid code'}), 400
    
    code = data['code']
    
    
    old_stdout = sys.stdout
    redirected_output = sys.stdout = StringIO()

    try:
        exec(code)
        output = redirected_output.getvalue()
        return jsonify({'output': output}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        sys.stdout = old_stdout
