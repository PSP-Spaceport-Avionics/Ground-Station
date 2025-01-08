import time
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from flask_socketio import SocketIO

# import sys
# print(f"Python executable in use: {sys.executable}")
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")
connected_clients = set()


@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!", "data": [1, 2, 3]})
@app.route('/api/data', methods=['POST'])
def post_data():
    input_data = request.json
    return jsonify({"message": "Data received!", "input": input_data})

@app.route('/api/test', methods=['POST'])
def return_data():
    file_path = 'app/test1.xlsx'

    df = pd.read_excel(file_path, engine='openpyxl')
    #5759
    data = df.head(100).to_dict(orient="records")
    formatted_data = list(zip(df.iloc[:, 0], df.iloc[:, 1]))


    # Return the data as JSON
    return jsonify({"data": formatted_data})

# websocket stuff
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    connected_clients.add(request.sid)


@socketio.on('disconnect')
def handle_disconnect():
    print('Clinet disconnected')
    connected_clients.discard(request.sid)

@socketio.on('start_stream')
def stream_data():
    file_path = 'app/test1.xlsx'
    # Load the Excel file
    df = pd.read_excel(file_path, header=None, engine='openpyxl')
    df.columns = ['Time', 'Altitude']
    ground_level = df['Altitude'].iloc[0] - 100
    df['Altitude'] -= ground_level 

    # Simulate real-time streaming
    for index, row in df.iterrows():

        # stop websocket if its not active anymore
        if request.sid not in connected_clients:
            break
        if index > 10000:
            break
        data = row.tolist()
        socketio.emit('data', data)
        time.sleep(0.01)

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5000)


