from flask import Flask, Response, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import base64
import os

app = Flask(__name__)
CORS(app)

# --- Global Variables ---
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
# ======================== CHANGE #1: Lazy Load the Model =========================
# We set the model to None initially. It will be loaded only when needed.
# This makes the application start very fast.
model = None
# ===============================================================================

os.makedirs('captured_images', exist_ok=True)

def calculate_density(count):
    """Calculates crowd density based on the number of people."""
    max_expected_people = 50
    raw_density = min(100, (count / max_expected_people) * 100)
    if raw_density >= 70:
        level = "high"
    elif raw_density >= 30:
        level = "moderate"
    else:
        level = "low"
    return round(raw_density, 1), level

def camera_processing_thread():
    """The main function that runs in a separate thread to process camera frames."""
    global camera, last_frame, last_frame_with_boxes, detection_data, stop_thread, model
    
    # ======================== CHANGE #2: Load Model on Demand ========================
    # The model is now loaded here, inside the thread, instead of at the start.
    if model is None:
        print("Loading YOLO model for the first time...")
        model = YOLO('yolov8n.pt')
        print("Model loaded successfully.")
    # ===============================================================================

    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print("Error: Could not open camera")
        return
    
    print("Camera thread started.")
    
    while not stop_thread:
        success, frame = camera.read()
        if not success:
            break
        
        last_frame = frame.copy()
        results = model(frame, classes=0, verbose=False)
        people_count = len(results[0].boxes)
        density_value, density_level = calculate_density(people_count)
        
        detection_data = {
            "peopleCount": people_count,
            "density": density_value,
            "densityLevel": density_level
        }
        
        annotated_frame = results[0].plot()
        last_frame_with_boxes = annotated_frame.copy()
        time.sleep(0.05)
    
    camera.release()
    camera = None
    print("Camera thread stopped and resources released.")

def generate_frames_for_stream():
    """Generator function for video streaming."""
    while not stop_thread:
        if last_frame_with_boxes is not None:
            ret, buffer = cv2.imencode('.jpg', last_frame_with_boxes)
            if ret:
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.05)

# --- API Endpoints ---

# ======================== CHANGE #3: Add Health Check Route ======================
@app.route('/healthz')
def health_check():
    """A simple endpoint for Render to check if the app is alive."""
    return jsonify({"status": "healthy"}), 200
# ===============================================================================

@app.route('/')
def home():
    return "CrowdAI Backend is running!"

@app.route('/start-detection', methods=['POST'])
def start_detection():
    global camera_thread, stop_thread
    if camera_thread and camera_thread.is_alive():
        return jsonify({"status": "Detection is already running"})
    stop_thread = False
    camera_thread = threading.Thread(target=camera_processing_thread)
    camera_thread.start()
    return jsonify({"status": "Detection started successfully"})

@app.route('/stop-detection', methods=['POST'])
def stop_detection():
    global stop_thread, camera_thread
    if not (camera_thread and camera_thread.is_alive()):
        return jsonify({"status": "Detection is not running"})
    stop_thread = True
    camera_thread.join(timeout=2.0)
    return jsonify({"status": "Detection stopped", "data": detection_data})

@app.route('/video-feed')
def video_feed():
    return Response(generate_frames_for_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection-data')
def get_detection_data():
    return jsonify(detection_data)

@app.route('/generate-heatmap', methods=['POST'])
def generate_heatmap():
    if last_frame is None:
        return jsonify({"error": "No frame available"}), 404
    
    frame = last_frame.copy()
    height, width, _ = frame.shape
    heatmap_overlay = np.zeros_like(frame, dtype=np.uint8)
    
    level = detection_data["densityLevel"]
    color = (0, 0, 255) if level == "high" else (0, 165, 255) if level == "moderate" else (0, 255, 0)
    
    cv2.rectangle(heatmap_overlay, (0, 0), (width, height), color, -1)
    alpha = 0.5
    final_image = cv2.addWeighted(frame, 1 - alpha, heatmap_overlay, alpha, 0)
    
    info_text = f"People: {detection_data['peopleCount']} | Density: {level.capitalize()}"
    cv2.putText(final_image, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    
    _, buffer = cv2.imencode('.jpg', final_image)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({"heatmapImage": heatmap_base64, "data": detection_data})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)