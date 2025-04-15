'''mport cv2
from ultralytics import YOLO
from flask import Flask, Response
import time

app = Flask(__name__)

# Load the YOLOv8 model
model = YOLO('yolov8n.pt')  # Use the desired YOLOv8 model (yolov8s.pt, yolov8m.pt, etc.)

# Start the video capture (0 is for default webcam)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

# Set frame width and height
cap.set(3, 640)  # Width
cap.set(4, 480)  # Height

# Define a function to generate frames for video streaming
def generate_frames():
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Perform inference
        results = model(frame)

        # Render the detection results on the frame
        results.render()

        # Convert the frame to JPEG for Flask to stream
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Yield the frame as a part of the video stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

# Route to serve the video stream
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, threaded=True)'''
'''from flask import Flask, jsonify, request
import subprocess  # To run the real-time detection script
from realtime_detection import get_person_count
app = Flask(__name__)

# Route to start webcam detection
@app.route('/run-webcam', methods=['POST'])
def run_webcam():
    data = request.get_json()
    location = data.get("location")

    if location:
        # Run the real-time detection script
        try:
            # Starting the realtime_detection.py in a subprocess
            subprocess.Popen(['python3', 'realtime_detection.py', location])
            return jsonify({"status": "success", "message": f"Webcam detection started for {location}."})
        except Exception as e:
            return jsonify({"status": "error", "message": f"Error: {str(e)}"})
    else:
        return jsonify({"status": "error", "message": "No location provided."})
    
    
@app.route('/count', methods=['GET'])
def get_count():
    # Simulate the crowd detection response
    # You can replace this with your actual detection logic
    person_count = get_person_count() # Example count
    return jsonify({"person_count": person_count})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)'''

'''from flask import Flask, jsonify
from flask_cors import CORS
import threading
import realtime_detection  # your detection logic here

app = Flask(__name__)
CORS(app)  # allow requests from frontend

# Flag to prevent multiple thread calls
camera_running = False
import realtime_detection

# In the /count route:
threading.Thread(target=realtime_detection.start_detection).start()
@app.route("/count", methods=["GET"])
def start_detection():
    # You can start the detection in a separate thread so the API doesn't block
    threading.Thread(target=realtime_detection.start_detection).start()
    return jsonify({"message": "Detection started!"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)'''

'''from flask import Flask, jsonify
from flask_cors import CORS
import threading
import realtime_detection  # Import the detection logic

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Flag to prevent multiple thread calls
camera_running = False

@app.route("/count", methods=["GET"])
def start_detection():
    global camera_running

    # Start the detection thread only if it's not already running
    if not camera_running:
        camera_running = True
        threading.Thread(target=realtime_detection.start_real_time_detection).start()

    # Return the current count of detected persons
   

if __name__ == "__main__":
    app.run(debug=True, port=5001)'''


'''from flask import Flask, jsonify
from flask_cors import CORS
import threading
import realtime_detection  # Import the detection logic

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Flag to prevent multiple thread calls
camera_running = False

@app.route("/count", methods=["GET"])
def start_detection():
    global camera_running

    # Start detection thread only once
    if not camera_running:
        camera_running = True
        threading.Thread(target=realtime_detection.start_real_time_detection).start()

    # ✅ Return the current count
    person_count = realtime_detection.get_person_count()
    return jsonify({"count": person_count})

if __name__ == "__main__":
    app.run(debug=True, port=5001)'''
'''from flask import Flask, jsonify
from flask_cors import CORS
import threading
import realtime_detection  # Your YOLO logic

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Thread-safe flag
camera_running = False
lock = threading.Lock()

@app.route("/count", methods=["GET"])
def start_detection():
    global camera_running

    with lock:
        if not camera_running:
            camera_running = True
            threading.Thread(target=realtime_detection.start_real_time_detection, daemon=True).start()

    # Return current count
    try:
        person_count = realtime_detection.get_person_count()
        return jsonify({"count": person_count})
    except Exception as e:
        print(f"❌ Error getting person count: {e}")
        return jsonify({"count": 0, "error": "Detection error occurred."})

if __name__ == "__main__":
    app.run(debug=True, port=5001, use_reloader=False)'''



'''from flask import Flask, jsonify
from flask_cors import CORS
import threading
import realtime_detection

app = Flask(__name__)
CORS(app)

camera_running = False
lock = threading.Lock()

@app.route("/count", methods=["GET"])
def start_detection():
    global camera_running

    with lock:
        if not camera_running:
            camera_running = True
            threading.Thread(target=realtime_detection.start_real_time_detection, daemon=True).start()

    person_count = realtime_detection.get_person_count()
    return jsonify({"count": person_count})

@app.route("/stop", methods=["GET"])
def stop_detection():
    global camera_running

    with lock:
        if camera_running:
            realtime_detection.stop_real_time_detection()
            camera_running = False
            return jsonify({"message": "Camera detection stopped."})

    return jsonify({"message": "Camera was not running."})

if __name__ == "__main__":
    app.run(debug=True, port=5001, use_reloader=False)'''


from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/count": {"origins": "http://localhost:8080"}})

@app.route('/start-detection', methods=['GET'])
def start_detection():
    try:
        subprocess.Popen(['python3', 'realtime_detection.py'])
        return jsonify({'status': 'success', 'message': 'Detection started'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)