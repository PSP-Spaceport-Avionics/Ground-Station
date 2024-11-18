from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!", "data": [1, 2, 3]})

@app.route('/api/data', methods=['POST'])
def post_data():
    input_data = request.json
    return jsonify({"message": "Data received!", "input": input_data})

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5000)


