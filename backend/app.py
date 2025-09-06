from flask import Flask, Response, jsonify, request
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import base64
import os

# Initialize the Flask app
app = Flask(__name__)
# Enable CORS to allow your React frontend to communicate with this backend
CORS(app)

# --- Global Variables ---
# These variables will hold the state of the application
camera = None
camera_thread = None
stop_thread = False  # A flag to signal the camera thread to stop
last_frame = None  # Stores the latest raw frame from the camera
last_frame_with_boxes = None  # Stores the latest frame with detection boxes drawn on it
detection_data = {
    "peopleCount": 0,
    "density": 0,
    "densityLevel": "low"
}

# --- Setup ---
# Create a directory to save captured images if it doesn't already exist
os.makedirs('captured_images', exist_ok=True)

# Load the YOLOv8 model. We are telling it to only detect people (class 0).
model = YOLO('yolov8n.pt')

# --- Helper Functions ---
def calculate_density(count, frame_area):
    """Calculates crowd density based on the number of people."""
    # This is a simple calculation. You can make it more complex if needed.
    max_expected_people = 50  # Assumption: max 50 people can fit in the view
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
    global camera, last_frame, last_frame_with_boxes, detection_data, stop_thread
    
    # Initialize the camera
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print("Error: Could not open camera")
        return
    
    frame_width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_area = frame_width * frame_height
    
    print("Camera thread started.")
    
    while not stop_thread:
        success, frame = camera.read()
        if not success:
            print("Failed to grab frame, stopping thread.")
            break
            
        # Store the original frame
        last_frame = frame.copy()
        
        # Perform YOLOv8 detection on the frame
        results = model(frame, classes=0, verbose=False) # verbose=False for cleaner output
        
        # Extract results
        people_count = len(results[0].boxes)
        density_value, density_level = calculate_density(people_count, frame_area)
        
        # Update the global detection data dictionary
        detection_data = {
            "peopleCount": people_count,
            "density": density_value,
            "densityLevel": density_level
        }
        
        # Draw bounding boxes on the frame for visualization
        annotated_frame = results[0].plot()
        last_frame_with_boxes = annotated_frame.copy()
        
        # A short delay to prevent the CPU from running at 100%
        time.sleep(0.05)
    
    # Release the camera resource when the loop is stopped
    camera.release()
    camera = None
    print("Camera thread stopped and resources released.")

def generate_frames_for_stream():
    """A generator function that yields frames for the video stream."""
    while not stop_thread:
        if last_frame_with_boxes is None:
            time.sleep(0.1)
            continue
            
        # Encode the frame with boxes as JPEG
        ret, buffer = cv2.imencode('.jpg', last_frame_with_boxes)
        if not ret:
            continue
        
        frame_bytes = buffer.tobytes()
        
        # Yield the frame in the format required for multipart streaming
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.05)

# --- API Endpoints (Routes) ---

@app.route('/')
def home():
    """A simple route to check if the backend is running."""
    return "CrowdAI Backend is running!"

@app.route('/start-detection', methods=['POST'])
def start_detection():
    """Starts the camera processing thread."""
    global camera_thread, stop_thread
    
    if camera_thread is not None and camera_thread.is_alive():
        return jsonify({"status": "Detection is already running"})
    
    stop_thread = False
    camera_thread = threading.Thread(target=camera_processing_thread)
    camera_thread.start()
    
    return jsonify({"status": "Detection started successfully"})

@app.route('/stop-detection', methods=['POST'])
def stop_detection():
    """Stops the camera processing thread and releases resources."""
    global stop_thread, camera_thread
    
    if camera_thread is None or not camera_thread.is_alive():
        return jsonify({"status": "Detection is not running"})
        
    stop_thread = True
    camera_thread.join(timeout=2.0) # Wait for the thread to finish
    
    # Save the last captured frame
    if last_frame is not None:
        timestamp = int(time.time())
        cv2.imwrite(f'captured_images/capture_{timestamp}.jpg', last_frame_with_boxes)
    
    return jsonify({"status": "Detection stopped", "data": detection_data})

@app.route('/video-feed')
def video_feed():
    """Provides the live video stream to the frontend."""
    return Response(generate_frames_for_stream(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection-data')
def get_detection_data():
    """Provides the latest detection data (JSON) to the frontend."""
    return jsonify(detection_data)

@app.route('/generate-heatmap', methods=['POST'])
def generate_heatmap():
    """Generates a heatmap from the last captured frame."""
    if last_frame is None:
        return jsonify({"error": "No frame available for heatmap generation"}), 404
    
    frame = last_frame.copy()
    height, width, _ = frame.shape
    
    # Create a colored overlay based on density level
    heatmap_overlay = np.zeros_like(frame, dtype=np.uint8)
    if detection_data["densityLevel"] == "high":
        color = (0, 0, 255)  # Red in BGR
    elif detection_data["densityLevel"] == "moderate":
        color = (0, 165, 255)  # Orange in BGR
    else:
        color = (0, 255, 0)  # Green in BGR
    
    # Fill the overlay with the chosen color
    cv2.rectangle(heatmap_overlay, (0, 0), (width, height), color, -1)
    
    # Blend the overlay with the original frame
    alpha = 0.5  # Transparency factor
    final_image = cv2.addWeighted(frame, 1 - alpha, heatmap_overlay, alpha, 0)
    
    # Add analytics text to the image
    info_text = f"People: {detection_data['peopleCount']} | Density: {detection_data['densityLevel'].capitalize()}"
    cv2.putText(final_image, info_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    # Encode the final image to base64 to send it as JSON
    _, buffer = cv2.imencode('.jpg', final_image)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "heatmapImage": heatmap_base64,
        "data": detection_data
    })

# --- Main Entry Point ---
if __name__ == '__main__':
    # Runs the Flask app
    app.run(debug=True, host='0.0.0.0', port=5001)