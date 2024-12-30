from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!", "data": [1, 2, 3]})
@app.route('/api/data', methods=['POST'])
def post_data():
    input_data = request.json
    return jsonify({"message": "Data received!", "input": input_data})

@app.route('/api/test', methods=['POST'])
def return_data():
    file_path = 'test1.xlsx'

    df = pd.read_excel(file_path)

    data = df.head(5759).to_dict(orient="records")

    # Return the data as JSON
    return jsonify({"data": data})

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5000)


