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


'''from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/count": {"origins": "http://localhost:8080"}})

@app.route('/start-detection', methods=['GET'])
def start_detection():
    try:
        subprocess.Popen(['python3', 'src/main.py'])
        return jsonify({'status': 'success', 'message': 'Detection started'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)'''

'''from flask import Flask, Response, jsonify, request
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables
camera = None
camera_thread = None
stop_thread = False
last_frame = None
detection_data = {
    "peopleCount": 0,
    "density": 0,
    "densityLevel": "low"
}

# Load YOLO model
model = YOLO('yolov8n.pt')

def calculate_density(count, frame_area):
    # Simple calculation - can be adjusted based on requirements
    max_expected_people = 50  # Adjust based on your specific use case
    raw_density = min(100, (count / max_expected_people) * 100)
    
    if raw_density >= 70:
        level = "high"
    elif raw_density >= 30:
        level = "moderate"
    else:
        level = "low"
        
    return round(raw_density, 1), level

def generate_frames():
    global camera, last_frame, detection_data, stop_thread
    
    if camera is None:
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            print("Error: Could not open camera")
            return
    
    frame_width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_area = frame_width * frame_height
    
    while not stop_thread:
        success, frame = camera.read()
        if not success:
            print("Failed to grab frame")
            break
            
        # YOLOv8 detection - only people (class 0)
        results = model(frame, classes=0)
        
        # Extract detection results
        people_count = len(results[0].boxes)
        density_value, density_level = calculate_density(people_count, frame_area)
        
        # Update detection data
        detection_data = {
            "peopleCount": people_count,
            "density": density_value,
            "densityLevel": density_level
        }
        
        # Draw bounding boxes on the frame
        for r in results:
            annotated_frame = r.plot()
            last_frame = annotated_frame.copy()
            
            # Convert to jpeg format for streaming
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        # Short delay to reduce CPU usage
        time.sleep(0.05)

def camera_capture():
    for _ in generate_frames():
        if stop_thread:
            break

@app.route('/start-detection')
def start_detection():
    global camera_thread, stop_thread
    
    # If thread is already running, do nothing
    if camera_thread is not None and camera_thread.is_alive():
        return jsonify({"status": "Detection already running"})
    
    # Reset flag and start new thread
    stop_thread = False
    camera_thread = threading.Thread(target=camera_capture)
    camera_thread.daemon = True
    camera_thread.start()
    
    return jsonify({"status": "Detection started"})

@app.route('/stop-detection')
def stop_detection():
    global camera, camera_thread, stop_thread
    
    stop_thread = True
    
    # Wait for thread to finish
    if camera_thread is not None:
        camera_thread.join(timeout=1.0)
    
    # Release camera
    if camera is not None:
        camera.release()
        camera = None
    
    return jsonify({"status": "Detection stopped"})

@app.route('/video-feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection-data')
def get_detection_data():
    global detection_data
    return jsonify(detection_data)

@app.route('/last-frame')
def get_last_frame():
    global last_frame
    
    if last_frame is None:
        return jsonify({"error": "No frame available"})
    
    # Convert the last frame to base64 for sending to frontend
    ret, buffer = cv2.imencode('.jpg', last_frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "image": frame_base64,
        "data": detection_data
    })

@app.route('/generate-heatmap')
def generate_heatmap():
    global last_frame, detection_data
    
    if last_frame is None:
        return jsonify({"error": "No frame available for heatmap generation"})
    
    # Create a simple heatmap visualization
    heatmap = np.zeros_like(last_frame)
    height, width = last_frame.shape[:2]
    
    # Center of the frame
    center_x, center_y = width // 2, height // 2
    
    # Choose color based on density level
    if detection_data["densityLevel"] == "high":
        color = (0, 0, 255)  # Red (BGR)
    elif detection_data["densityLevel"] == "moderate":
        color = (0, 165, 255)  # Orange (BGR)
    else:
        color = (0, 255, 0)  # Green (BGR)
    
    # Create a radial gradient
    max_radius = int(np.sqrt(width**2 + height**2) / 2)
    for y in range(height):
        for x in range(width):
            # Calculate distance from center
            distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
            if distance <= max_radius:
                # Calculate opacity based on distance
                opacity = max(0, 1 - (distance / max_radius))
                
                # Apply the color with opacity
                heatmap[y, x] = (
                    int(color[0] * opacity),
                    int(color[1] * opacity),
                    int(color[2] * opacity)
                )
    
    # Add the last frame with the heatmap
    alpha = 0.6
    heatmap_overlay = cv2.addWeighted(last_frame, 1 - alpha, heatmap, alpha, 0)
    
    # Convert to base64 for sending to frontend
    ret, buffer = cv2.imencode('.jpg', heatmap_overlay)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "heatmap": heatmap_base64,
        "data": detection_data
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)'''



from flask import Flask, Response, jsonify, request
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables
camera = None
camera_thread = None
stop_thread = False
last_frame = None
last_frame_with_boxes = None
detection_data = {
    "peopleCount": 0,
    "density": 0,
    "densityLevel": "low"
}

# Create directory for saving images
os.makedirs('captured_images', exist_ok=True)

# Load YOLO model - only detect people (class 0)
model = YOLO('yolov8n.pt')

def calculate_density(count, frame_area):
    # Simple calculation - can be adjusted based on requirements
    max_expected_people = 50  # Adjust based on your specific use case
    raw_density = min(100, (count / max_expected_people) * 100)
    
    if raw_density >= 70:
        level = "high"
    elif raw_density >= 30:
        level = "moderate"
    else:
        level = "low"
        
    return round(raw_density, 1), level

def generate_frames():
    global camera, last_frame, last_frame_with_boxes, detection_data, stop_thread
    
    if camera is None:
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            print("Error: Could not open camera")
            return
    
    frame_width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_area = frame_width * frame_height
    
    while not stop_thread:
        success, frame = camera.read()
        if not success:
            print("Failed to grab frame")
            break
            
        # Save the original frame
        last_frame = frame.copy()
            
        # YOLOv8 detection - only people (class 0)
        results = model(frame, classes=0)
        
        # Extract detection results
        people_count = len(results[0].boxes)
        density_value, density_level = calculate_density(people_count, frame_area)
        
        # Update detection data
        detection_data = {
            "peopleCount": people_count,
            "density": density_value,
            "densityLevel": density_level
        }
        
        # Draw bounding boxes on the frame
        for r in results:
            annotated_frame = r.plot()
            last_frame_with_boxes = annotated_frame.copy()
            
            # Convert to jpeg format for streaming
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        # Short delay to reduce CPU usage
        time.sleep(0.05)

def camera_capture():
    for _ in generate_frames():
        if stop_thread:
            break

@app.route('/start-detection')
def start_detection():
    global camera_thread, stop_thread
    
    # If thread is already running, do nothing
    if camera_thread is not None and camera_thread.is_alive():
        return jsonify({"status": "Detection already running"})
    
    # Reset flag and start new thread
    stop_thread = False
    camera_thread = threading.Thread(target=camera_capture)
    camera_thread.daemon = True
    camera_thread.start()
    
    return jsonify({"status": "Detection started"})

@app.route('/stop-detection')
def stop_detection():
    global camera, camera_thread, stop_thread, last_frame, last_frame_with_boxes
    
    stop_thread = True
    
    # Wait for thread to finish
    if camera_thread is not None:
        camera_thread.join(timeout=1.0)
    
    # Save the last frame when stopping
    if last_frame is not None:
        timestamp = int(time.time())
        cv2.imwrite(f'captured_images/last_frame_{timestamp}.jpg', last_frame)
        if last_frame_with_boxes is not None:
            cv2.imwrite(f'captured_images/last_frame_boxes_{timestamp}.jpg', last_frame_with_boxes)
    
    # Release camera
    if camera is not None:
        camera.release()
        camera = None
    
    return jsonify({"status": "Detection stopped", "data": detection_data})

@app.route('/video-feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection-data')
def get_detection_data():
    global detection_data
    return jsonify(detection_data)

@app.route('/last-frame')
def get_last_frame():
    global last_frame_with_boxes, detection_data
    
    if last_frame_with_boxes is None:
        return jsonify({"error": "No frame available"})
    
    # Convert the last frame to base64 for sending to frontend
    ret, buffer = cv2.imencode('.jpg', last_frame_with_boxes)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "image": frame_base64,
        "data": detection_data
    })

@app.route('/generate-heatmap')
def generate_heatmap():
    global last_frame, detection_data
    
    if last_frame is None:
        return jsonify({"error": "No frame available for heatmap generation"})
    
    # Create a heatmap visualization based on the density level
    frame = last_frame.copy()
    height, width = frame.shape[:2]
    
    # Create a heatmap overlay
    heatmap = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Set color based on density level
    if detection_data["densityLevel"] == "high":
        base_color = (0, 0, 255)  # Red (BGR)
    elif detection_data["densityLevel"] == "moderate":
        base_color = (0, 165, 255)  # Orange (BGR)
    else:
        base_color = (0, 255, 0)  # Green (BGR)
    
    # Create radial gradient from center
    center_x, center_y = width // 2, height // 2
    max_radius = int(min(width, height) * 0.8)
    
    for y in range(height):
        for x in range(width):
            # Calculate distance from center
            dist = np.sqrt((x - center_x)**2 + (y - center_y)**2)
            if dist < max_radius:
                # Calculate intensity (higher near center)
                intensity = max(0, 1 - (dist / max_radius))
                
                # Apply color with intensity
                heatmap[y, x] = [
                    int(base_color[0] * intensity),
                    int(base_color[1] * intensity),
                    int(base_color[2] * intensity)
                ]
    
    # Overlay heatmap on original image
    alpha = 0.5  # Transparency factor
    heatmap_overlay = cv2.addWeighted(frame, 1 - alpha, heatmap, alpha, 0)
    
    # Add text with analytics
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(
        heatmap_overlay, 
        f"People: {detection_data['peopleCount']} | Density: {detection_data['density']}%", 
        (10, 30), 
        font, 
        0.7, 
        (255, 255, 255), 
        2
    )
    
    # Save the heatmap
    timestamp = int(time.time())
    heatmap_path = f'captured_images/heatmap_{timestamp}.jpg'
    cv2.imwrite(heatmap_path, heatmap_overlay)
    
    # Convert to base64 for sending to frontend
    ret, buffer = cv2.imencode('.jpg', heatmap_overlay)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "heatmap": heatmap_base64,
        "data": detection_data,
        "file_path": heatmap_path
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

